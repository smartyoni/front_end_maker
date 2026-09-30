import React from 'react';
import { PropertyInspector } from '../inspector/PropertyInspector';

export const RightSidebar: React.FC = () => {
  return (
    <aside className="w-80 bg-white border-l border-slate-200 flex flex-col h-full shrink-0 z-10 shadow-sm overflow-hidden">
      <PropertyInspector />
    </aside>
  );
};
