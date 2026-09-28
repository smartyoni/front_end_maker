import React from 'react';
import { PropertyInspector } from '../inspector/PropertyInspector';
import { Sliders } from 'lucide-react';

export const RightSidebar: React.FC = () => {
  return (
    <aside className="w-80 bg-white border-l border-slate-200 flex flex-col h-full shrink-0 z-10 shadow-sm">
      <div className="h-11 px-4 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
        <Sliders className="w-3.5 h-3.5 text-blue-600" />
        <h2 className="text-xs font-bold text-slate-700">속성 & 인터랙션 설정</h2>
      </div>
      <PropertyInspector />
    </aside>
  );
};
