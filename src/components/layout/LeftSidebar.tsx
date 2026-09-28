import React, { useState } from 'react';
import { PlusCircle, Layers } from 'lucide-react';
import { ComponentPalette } from '../palette/ComponentPalette';
import { LayerTree } from '../tree/LayerTree';

export const LeftSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'palette' | 'tree'>('palette');

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-full shrink-0 z-10">
      {/* 탭 헤더 */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('palette')}
          className={`flex-1 py-3 flex items-center justify-center gap-1.5 text-xs font-semibold border-b-2 transition ${
            activeTab === 'palette'
              ? 'border-blue-500 text-blue-400 bg-slate-800/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>컴포넌트 도구함</span>
        </button>
        <button
          onClick={() => setActiveTab('tree')}
          className={`flex-1 py-3 flex items-center justify-center gap-1.5 text-xs font-semibold border-b-2 transition ${
            activeTab === 'tree'
              ? 'border-blue-500 text-blue-400 bg-slate-800/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>레이어 트리</span>
        </button>
      </div>

      {/* 탭 내용 영역 */}
      {activeTab === 'palette' ? <ComponentPalette /> : <LayerTree />}
    </aside>
  );
};
