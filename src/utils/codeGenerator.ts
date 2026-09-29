import { ComponentItem, Screen, Panel } from '../types/builder';

export function generateReactCode(screen: Screen): string {
  const panelsJSX = screen.panels
    .map((panel, idx) => generatePanelJSX(panel, idx))
    .join('\n\n        ');

  return `import React, { useState } from 'react';

export default function ${sanitizeName(screen.name)}App() {
  return (
    <div className="h-screen w-screen bg-slate-100 flex overflow-hidden font-sans">
      <div className="flex-1 flex overflow-x-auto m-2 bg-white rounded-xl border border-slate-200 shadow-sm">
        ${panelsJSX}
      </div>
    </div>
  );
}
`;
}

function generatePanelJSX(panel: Panel, idx: number): string {
  const compJSX = panel.components
    .map((comp) => generateComponentJSX(comp))
    .join('\n            ');

  const widthStyle =
    panel.width === 'flex-1' ? 'flex-1 min-w-[360px]' : `w-[${panel.width}] shrink-0`;

  return `<!-- 패널 ${idx + 1}: ${panel.title} -->
        <section className="${widthStyle} h-full border-r border-slate-200 p-3 flex flex-col space-y-3 overflow-y-auto">
          <div className="text-xs font-bold text-slate-500 pb-1 border-b border-slate-100">${panel.title}</div>
            ${compJSX}
        </section>`;
}

function generateComponentJSX(comp: ComponentItem): string {
  switch (comp.type) {
    case 'colorBlock':
      return `<div className="w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">
          <div className="px-3.5 py-2 text-white text-xs font-bold flex items-center justify-between" style={{ backgroundColor: '${comp.headerColor || '#9333ea'}' }}>
            <span>${comp.label || '섹션 블록'}</span>
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
            ${(comp.items || []).map((item) => `<label className="flex items-center gap-2 py-2 px-1 text-xs text-slate-700"><input type="checkbox" className="rounded" /><span>${item}</span></label>`).join('\n            ')}
          </div>
        </div>`;

    case 'chipGroup': {
      const cols = comp.columns || 4;
      const rows = comp.rows || (comp.items ? Math.ceil(comp.items.length / cols) : 2);
      const total = cols * rows;
      const items = comp.items && comp.items.length === total
        ? comp.items
        : Array.from({ length: total }, (_, i) => String(i + 1));
      return `<div className="grid gap-1 p-0 w-full" style={{ gridTemplateColumns: 'repeat(${cols}, minmax(0, 1fr))' }}>
          ${items.map((chip) => `<span className="w-full py-1.5 px-1 text-[11px] font-semibold border bg-slate-100 text-slate-800 text-center truncate flex items-center justify-center">${chip}</span>`).join('\n          ')}
        </div>`;
    }

    case 'categoryList':
      return `<div className="w-full space-y-1">
          <div className="text-xs font-bold text-slate-700 pb-1 border-b border-slate-200">${comp.label || '카테고리'}</div>
          ${(comp.items || []).map((cat) => `<div className="px-2 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-slate-100 cursor-pointer">› ${cat}</div>`).join('\n          ')}
        </div>`;

    case 'quickInput':
      return `<div className="flex items-center gap-1.5 w-full">
          <input type="text" placeholder="${comp.placeholder || '입력...'}" className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg" />
          <button className="px-3 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg">${comp.label || '+ 추가'}</button>
        </div>`;

    case 'header':
      return `<div className="w-full py-2.5 px-3 bg-slate-50 rounded-lg flex items-center justify-between border border-slate-200">
          <h2 className="font-bold text-sm text-slate-800">${comp.label || 'Header'}</h2>
        </div>`;

    case 'button':
      return `<button className="w-full py-2 px-4 rounded-lg font-semibold text-xs bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition">
          ${comp.label || 'Button'}
        </button>`;

    case 'input':
      return `<div className="w-full space-y-1">
          ${comp.label ? `<label className="text-xs font-medium text-slate-600">${comp.label}</label>` : ''}
          <input type="text" placeholder="${comp.placeholder || '입력...'}" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800" />
        </div>`;

    case 'card':
      return `<div className="w-full p-3 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1.5">
          <h4 className="font-semibold text-xs text-slate-800">${comp.label || 'Card'}</h4>
          <p className="text-xs text-slate-500 leading-relaxed">${comp.content || ''}</p>
        </div>`;

    default:
      return `<div className="p-2 text-xs text-slate-700">${comp.label || comp.name}</div>`;
  }
}

function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, '') || 'App';
}
