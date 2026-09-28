import React from 'react';
import { ChevronUp, ChevronDown, Trash2, Layers } from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';

export const LayerTree: React.FC = () => {
  const { screens, activeScreenId, selectedComponentId, selectComponent, deleteComponent, moveComponent } =
    useCanvasStore();

  const currentScreen = screens.find((s) => s.id === activeScreenId);
  const components = currentScreen?.components || [];

  if (components.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500">
        <Layers className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-xs">배치된 컴포넌트가 없습니다.</p>
        <p className="text-[11px] text-slate-600 mt-1">도구함에서 요소를 추가해 보세요.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-1">
      {components.map((comp, idx) => {
        const isSelected = comp.id === selectedComponentId;
        return (
          <div
            key={comp.id}
            onClick={() => selectComponent(comp.id)}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition cursor-pointer group ${
              isSelected
                ? 'bg-blue-50 border border-blue-400 text-blue-900 shadow-sm font-medium'
                : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <span className="text-[10px] text-slate-400 font-mono w-4">{idx + 1}</span>
              <span className="truncate font-medium">{comp.name || comp.label || comp.type}</span>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                disabled={idx === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  moveComponent(comp.id, 'up');
                }}
                className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20"
                title="위로 이동"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={idx === components.length - 1}
                onClick={(e) => {
                  e.stopPropagation();
                  moveComponent(comp.id, 'down');
                }}
                className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20"
                title="아래로 이동"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteComponent(comp.id);
                }}
                className="p-1 text-slate-400 hover:text-red-500"
                title="삭제"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
