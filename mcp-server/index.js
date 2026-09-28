#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 디자인 데이터 파일 절대 경로
const DESIGN_DATA_PATH = path.resolve(__dirname, '../design-data/current-design.json');

// 도구 명세 (Tools definition)
const TOOLS = [
  {
    name: 'get_current_design',
    description: '웹앱 디자인 빌더에서 작업한 현재 화면의 레이아웃, 패널 분할, 컴포넌트 구조(JSON)를 가져옵니다.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_react_code',
    description: '웹앱 디자인 빌더에서 만든 화면을 완성된 React + TypeScript + Tailwind CSS 컴포넌트 코드로 변환하여 반환합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        screenId: {
          type: 'string',
          description: '변환할 화면 ID (생략 시 첫 번째 화면 변환)',
        },
      },
    },
  },
  {
    name: 'apply_design_to_file',
    description: '웹앱 디자인 빌더에서 만든 화면 코드를 현재 작업 중인 프로젝트의 특정 파일 경로에 직접 생성/적용합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        filePath: {
          type: 'string',
          description: '생성할 대상 파일의 절대 경로 또는 상대 경로 (예: src/pages/Dashboard.tsx)',
        },
        screenId: {
          type: 'string',
          description: '적용할 화면 ID (생략 시 첫 번째 화면 적용)',
        },
      },
      required: ['filePath'],
    },
  },
];

function loadDesignData() {
  if (!fs.existsSync(DESIGN_DATA_PATH)) {
    return { screens: [] };
  }
  const raw = fs.readFileSync(DESIGN_DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

function generateReactCodeFromData(screen) {
  const sanitizeName = (name) => name.replace(/[^a-zA-Z0-9]/g, '') || 'App';
  
  const panelsJSX = (screen.panels || [])
    .map((panel, idx) => {
      const compJSX = (panel.components || [])
        .map((comp) => generateCompJSX(comp))
        .join('\n            ');
      const widthClass = panel.width === 'flex-1' ? 'flex-1 min-w-[360px]' : `w-[${panel.width}] shrink-0`;
      return `<!-- 패널 ${idx + 1}: ${panel.title} -->
        <section className="${widthClass} h-full border-r border-slate-200 p-2 flex flex-col space-y-2 overflow-y-auto">
          <div className="text-xs font-bold text-slate-500 pb-1 border-b border-slate-100">${panel.title}</div>
            ${compJSX}
        </section>`;
    })
    .join('\n\n        ');

  return `import React, { useState } from 'react';

export default function ${sanitizeName(screen.name)}View() {
  return (
    <div className="h-screen w-screen bg-white flex overflow-hidden font-sans text-slate-800">
      <div className="flex-1 flex overflow-x-auto overflow-y-hidden">
        ${panelsJSX}
      </div>
    </div>
  );
}
`;
}

function generateCompJSX(comp) {
  switch (comp.type) {
    case 'colorBlock':
      return `<div className="w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">
          <div className="px-3.5 py-2 text-white text-xs font-bold flex items-center justify-between" style={{ backgroundColor: '${comp.headerColor || '#9333ea'}' }}>
            <span>${comp.label || '섹션'}</span>
          </div>
          <div className="p-3 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
            ${comp.content || ''}
          </div>
        </div>`;

    case 'checklist':
      return `<div className="w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">
          <div className="px-3.5 py-2 text-white text-xs font-bold flex items-center justify-between" style={{ backgroundColor: '${comp.headerColor || '#16a34a'}' }}>
            <span>${comp.label || '체크리스트'}</span>
          </div>
          <div className="p-2 divide-y divide-slate-100">
            ${(comp.items || []).map((item) => `<label className="flex items-center gap-2 py-2 px-1 text-xs text-slate-700 cursor-pointer"><input type="checkbox" className="rounded text-emerald-600" /><span>${item}</span></label>`).join('\n            ')}
          </div>
        </div>`;

    case 'chipGroup': {
      const cols = comp.columns || 4;
      return `<div className="grid gap-1 p-0 w-full" style={{ gridTemplateColumns: 'repeat(${cols}, minmax(0, 1fr))' }}>
          ${(comp.items || []).map((chip) => `<span className="w-full py-1.5 px-1 rounded-md text-[11px] font-semibold border bg-slate-100 text-slate-800 text-center truncate flex items-center justify-center">${chip}</span>`).join('\n          ')}
        </div>`;
    }

    case 'categoryList':
      return `<div className="w-full space-y-1">
          <div className="text-xs font-bold text-slate-700 pb-1 border-b border-slate-200">${comp.label || '카테고리'}</div>
          ${(comp.items || []).map((cat) => `<div className="px-2 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-slate-100 cursor-pointer">› ${cat}</div>`).join('\n          ')}
        </div>`;

    case 'quickInput':
      return `<div className="flex items-center gap-1.5 w-full">
          <input type="text" placeholder="${comp.placeholder || '입력...'}" className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800" />
          <button className="px-3 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg shadow-sm">${comp.label || '+ 추가'}</button>
        </div>`;

    default:
      return `<div className="p-2 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg">${comp.label || comp.name}</div>`;
  }
}

// JSON-RPC 2.0 핸들러
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on('line', (line) => {
  if (!line.trim()) return;
  try {
    const request = JSON.parse(line);
    handleRequest(request);
  } catch (err) {
    // ignore parse errors
  }
});

function sendResponse(response) {
  process.stdout.write(JSON.stringify(response) + '\n');
}

function handleRequest(req) {
  const { id, method, params } = req;

  if (method === 'initialize') {
    sendResponse({
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: {
          name: 'app-design-mcp-server',
          version: '1.0.0',
        },
      },
    });
  } else if (method === 'notifications/initialized') {
    // notification, no response
  } else if (method === 'ping') {
    sendResponse({ jsonrpc: '2.0', id, result: {} });
  } else if (method === 'tools/list') {
    sendResponse({
      jsonrpc: '2.0',
      id,
      result: { tools: TOOLS },
    });
  } else if (method === 'tools/call') {
    handleToolCall(id, params?.name, params?.arguments || {});
  } else {
    sendResponse({
      jsonrpc: '2.0',
      id,
      error: { code: -32601, message: `Method not found: ${method}` },
    });
  }
}

function handleToolCall(id, toolName, args) {
  try {
    const data = loadDesignData();
    const screen = args.screenId
      ? data.screens?.find((s) => s.id === args.screenId) || data.screens?.[0]
      : data.screens?.[0];

    if (toolName === 'get_current_design') {
      sendResponse({
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
            },
          ],
        },
      });
    } else if (toolName === 'get_react_code') {
      if (!screen) {
        throw new Error('디자인된 화면이 없습니다.');
      }
      const code = generateReactCodeFromData(screen);
      sendResponse({
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: code,
            },
          ],
        },
      });
    } else if (toolName === 'apply_design_to_file') {
      if (!screen) {
        throw new Error('디자인된 화면이 없습니다.');
      }
      const code = generateReactCodeFromData(screen);
      const targetPath = path.resolve(process.cwd(), args.filePath);
      const parentDir = path.dirname(targetPath);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }
      fs.writeFileSync(targetPath, code, 'utf-8');

      sendResponse({
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: `성공적으로 '${args.filePath}' 파일에 '${screen.name}' 화면 코드를 적용했습니다!`,
            },
          ],
        },
      });
    } else {
      sendResponse({
        jsonrpc: '2.0',
        id,
        error: { code: -32601, message: `Tool not found: ${toolName}` },
      });
    }
  } catch (error) {
    sendResponse({
      jsonrpc: '2.0',
      id,
      result: {
        isError: true,
        content: [
          {
            type: 'text',
            text: `오류 발생: ${error.message}`,
          },
        ],
      },
    });
  }
}
