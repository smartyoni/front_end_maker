import { ComponentItem, Screen } from '../types/builder';

export function generateReactCode(screen: Screen): string {
  const compJSX = screen.components
    .map((comp) => generateComponentJSX(comp))
    .join('\n      ');

  return `import React, { useState } from 'react';

export default function ${sanitizeName(screen.name)}Screen() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-start p-4">
      <div className="w-full max-w-md bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col space-y-3 p-4">
      ${compJSX}
      </div>
    </div>
  );
}
`;
}

function generateComponentJSX(comp: ComponentItem): string {
  switch (comp.type) {
    case 'header':
      return `<header className="w-full py-3 px-4 bg-slate-800/80 backdrop-blur rounded-lg flex items-center justify-between border-b border-slate-700">
          <h1 className="font-bold text-lg text-white">${comp.label || 'Header'}</h1>
          <button className="text-sm px-2 py-1 bg-slate-700 rounded text-slate-300">Menu</button>
        </header>`;

    case 'button': {
      const isPrimary = comp.variant === 'primary';
      const bgClass = isPrimary ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-200';
      return `<button 
          onClick={() => ${comp.action?.type === 'navigate' ? `alert('Navigate to ${comp.action.targetScreenId}')` : `alert('Clicked!')`}}
          className="w-full py-3 px-4 rounded-xl font-semibold transition ${bgClass}">
          ${comp.label || 'Button'}
        </button>`;
    }

    case 'input':
      return `<div className="w-full flex flex-col gap-1.5">
          ${comp.label ? `<label className="text-xs font-medium text-slate-400">${comp.label}</label>` : ''}
          <input 
            type="text" 
            placeholder="${comp.placeholder || '내용을 입력하세요...'}" 
            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500 placeholder-slate-500 text-sm"
          />
        </div>`;

    case 'card':
      return `<div className="w-full p-4 bg-slate-800/90 border border-slate-700/60 rounded-2xl shadow-sm space-y-2">
          <h3 className="font-semibold text-slate-100">${comp.label || 'Card Title'}</h3>
          <p className="text-sm text-slate-400 leading-relaxed">${comp.content || 'Card description text.'}</p>
        </div>`;

    case 'tabs':
      return `<div className="w-full flex border-b border-slate-800 text-sm">
          ${(comp.items || ['탭 1', '탭 2']).map((tab, i) => `<button className="flex-1 py-2 font-medium text-center ${i === 0 ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400'}">${tab}</button>`).join('\n          ')}
        </div>`;

    case 'list':
      return `<div className="w-full bg-slate-800/60 rounded-xl p-2 divide-y divide-slate-700/40">
          ${(comp.items || ['아이템 1', '아이템 2']).map((item) => `<div className="py-2.5 px-3 text-sm text-slate-300 flex items-center justify-between"><span>${item}</span><span className="text-slate-500 text-xs">›</span></div>`).join('\n          ')}
        </div>`;

    case 'bottomNav':
      return `<nav className="w-full py-2 px-4 bg-slate-900 border-t border-slate-800 flex justify-around items-center text-xs text-slate-400">
          ${(comp.items || ['홈', '검색', '설정']).map((item) => `<span>${item}</span>`).join('\n          ')}
        </nav>`;

    default:
      return `<div className="p-3 bg-slate-800 rounded-lg text-sm text-slate-300">${comp.label || comp.name}</div>`;
  }
}

function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, '') || 'App';
}
