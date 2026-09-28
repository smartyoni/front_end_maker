import React from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { DeviceFrame } from './DeviceFrame';
import { CanvasItemRenderer } from './CanvasItemRenderer';
import { Layers } from 'lucide-react';

export const CanvasArea: React.FC = () => {
  const { screens, activeScreenId, selectedComponentId, selectComponent, viewportMode } = useCanvasStore();

  const currentScreen = screens.find((s) => s.id === activeScreenId);
  const components = currentScreen?.components || [];

  return (
    <main
      onClick={() => selectComponent(null)}
      className="flex-1 bg-slate-100 overflow-auto flex items-center justify-center p-8 relative"
      style={{
        backgroundImage: 'radial-gradient(circle, #cbd5e1 1.2px, transparent 1.2px)',
        backgroundSize: '20px 20px',
      }}
    >
      <DeviceFrame mode={viewportMode}>
        {components.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 border-2 border-dashed border-slate-300 rounded-2xl p-6">
            <Layers className="w-10 h-10 mb-3 opacity-40 text-blue-500" />
            <p className="text-sm font-semibold text-slate-600">화면에 배치된 요소가 없습니다</p>
            <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
              좌측 도구함에서 컴포넌트를 클릭하여 원하는 레이아웃을 구성해 보세요.
            </p>
          </div>
        ) : (
          components.map((comp) => (
            <CanvasItemRenderer
              key={comp.id}
              component={comp}
              isSelected={comp.id === selectedComponentId}
              onSelect={() => selectComponent(comp.id)}
            />
          ))
        )}
      </DeviceFrame>
    </main>
  );
};
