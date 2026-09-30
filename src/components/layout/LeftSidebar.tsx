import React from 'react';
import { PlusCircle, Sliders } from 'lucide-react';
import { ComponentPalette } from '../palette/ComponentPalette';
import { CommonSettingsTab } from './CommonSettingsTab';
import { useGlobalSettingsStore } from '../../store/globalSettingsStore';

export const LeftSidebar: React.FC = () => {
  const { activeLeftTab, setActiveLeftTab } = useGlobalSettingsStore();

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-full shrink-0 z-10 shadow-sm">
      {/* 탭 헤더 (도구함 / 공통설정) */}
      <div className="flex border-b border-slate-200 bg-slate-50/50">
        <button
          onClick={() => setActiveLeftTab('palette')}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold border-b-2 transition ${
            activeLeftTab === 'palette'
              ? 'border-blue-600 text-blue-600 bg-white font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          title="컴포넌트 도구함"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>도구함</span>
        </button>
        <button
          onClick={() => setActiveLeftTab('settings')}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold border-b-2 transition ${
            activeLeftTab === 'settings'
              ? 'border-blue-600 text-blue-600 bg-white font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          title="바이브코딩 공통 인터랙션 및 프롬프트 설정"
        >
          <Sliders className="w-3.5 h-3.5 text-blue-600" />
          <span>공통설정</span>
        </button>
      </div>

      {/* 탭 내용 영역 */}
      {activeLeftTab === 'palette' && <ComponentPalette />}
      {activeLeftTab === 'settings' && <CommonSettingsTab />}
    </aside>
  );
};
