import React, { useState } from 'react';
import { PlusCircle, Sparkles } from 'lucide-react';
import { ComponentPalette } from '../palette/ComponentPalette';
import { IdeasWorkspaceTab } from './IdeasWorkspaceTab';

export const LeftSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'palette' | 'ideas'>('palette');

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-full shrink-0 z-10 shadow-sm">
      {/* 탭 헤더 */}
      <div className="flex border-b border-slate-200 bg-slate-50/50">
        <button
          onClick={() => setActiveTab('palette')}
          className={`flex-1 py-3 flex items-center justify-center gap-1.5 text-xs font-semibold border-b-2 transition ${
            activeTab === 'palette'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>도구함</span>
        </button>
        <button
          onClick={() => setActiveTab('ideas')}
          className={`flex-1 py-3 flex items-center justify-center gap-1.5 text-xs font-semibold border-b-2 transition ${
            activeTab === 'ideas'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>확장 구상함</span>
        </button>
      </div>

      {/* 탭 내용 영역 */}
      {activeTab === 'palette' ? <ComponentPalette /> : <IdeasWorkspaceTab />}
    </aside>
  );
};
