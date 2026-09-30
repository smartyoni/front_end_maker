import React, { useState } from 'react';
import { PlusCircle, Sliders, Sparkles } from 'lucide-react';
import { ComponentPalette } from '../palette/ComponentPalette';
import { CommonSettingsTab } from './CommonSettingsTab';
import { IdeasWorkspaceTab } from './IdeasWorkspaceTab';

export const LeftSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'palette' | 'settings' | 'ideas'>('palette');

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-full shrink-0 z-10 shadow-sm">
      {/* 탭 헤더 (도구함 / 공통설정 / 확장 구상함) */}
      <div className="flex border-b border-slate-200 bg-slate-50/50">
        <button
          onClick={() => setActiveTab('palette')}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1 text-[11px] font-semibold border-b-2 transition ${
            activeTab === 'palette'
              ? 'border-blue-600 text-blue-600 bg-white font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          title="컴포넌트 도구함"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>도구함</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1 text-[11px] font-semibold border-b-2 transition ${
            activeTab === 'settings'
              ? 'border-blue-600 text-blue-600 bg-white font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          title="바이브코딩 공통 인터랙션 및 프롬프트 설정"
        >
          <Sliders className="w-3.5 h-3.5 text-blue-600" />
          <span>공통설정</span>
        </button>
        <button
          onClick={() => setActiveTab('ideas')}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1 text-[11px] font-semibold border-b-2 transition ${
            activeTab === 'ideas'
              ? 'border-blue-600 text-blue-600 bg-white font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          title="아이디어 및 추가 블록 구상함"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>구상함</span>
        </button>
      </div>

      {/* 탭 내용 영역 */}
      {activeTab === 'palette' && <ComponentPalette />}
      {activeTab === 'settings' && <CommonSettingsTab />}
      {activeTab === 'ideas' && <IdeasWorkspaceTab />}
    </aside>
  );
};
