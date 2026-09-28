import React from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { PanelContainer } from './PanelContainer';

export const CanvasArea: React.FC = () => {
  const { screens, activeScreenId } = useCanvasStore();

  const currentScreen = screens.find((s) => s.id === activeScreenId);
  const panels = currentScreen?.panels || [];

  return (
    <main className="flex-1 bg-slate-200/70 overflow-hidden flex flex-col relative">
      {/* 웹앱 전체 화면 브라우저 작업 공간 */}
      <div className="flex-1 flex overflow-x-auto overflow-y-hidden bg-white shadow-sm border border-slate-200 m-2 rounded-xl">
        {panels.map((panel, idx) => (
          <PanelContainer key={panel.id} panel={panel} index={idx} />
        ))}
      </div>
    </main>
  );
};
