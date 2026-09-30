import React from 'react';
import { PropertyInspector } from '../inspector/PropertyInspector';
import { GlobalPromptInspector } from '../inspector/GlobalPromptInspector';
import { useGlobalSettingsStore } from '../../store/globalSettingsStore';

export const RightSidebar: React.FC = () => {
  const { activeLeftTab } = useGlobalSettingsStore();

  return (
    <aside className="w-80 bg-white border-l border-slate-200 flex flex-col h-full shrink-0 z-10 shadow-sm overflow-hidden">
      {activeLeftTab === 'settings' ? <GlobalPromptInspector /> : <PropertyInspector />}
    </aside>
  );
};
