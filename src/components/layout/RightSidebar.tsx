import React from 'react';
import { PropertyInspector } from '../inspector/PropertyInspector';
import { Sliders } from 'lucide-react';

export const RightSidebar: React.FC = () => {
  return (
    <aside className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full shrink-0 z-10">
      <div className="h-11 px-4 border-b border-slate-800 flex items-center gap-2">
        <Sliders className="w-3.5 h-3.5 text-blue-400" />
        <h2 className="text-xs font-bold text-slate-300">속성 & 인터랙션 설정</h2>
      </div>
      <PropertyInspector />
    </aside>
  );
};
