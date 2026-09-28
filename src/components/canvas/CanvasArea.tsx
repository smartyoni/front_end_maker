import React from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { PanelContainer } from './PanelContainer';

export const CanvasArea: React.FC = () => {
  const { screens, activeScreenId } = useCanvasStore();

  const currentScreen = screens.find((s) => s.id === activeScreenId);
  const panels = currentScreen?.panels || [];

  return (
    <main className="flex-1 bg-white overflow-hidden flex flex-col relative">
      {/* 웹앱 전체 화면 브라우저 작업 공간 (여백 없이 꽉 찬 뷰) */}
      <div className="flex-1 flex overflow-x-auto overflow-y-hidden bg-white">
        {panels.map((panel, idx) => (
          <PanelContainer key={panel.id} panel={panel} index={idx} />
        ))}
      </div>
    </main>
  );
};
