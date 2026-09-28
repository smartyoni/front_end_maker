import React from 'react';
import { ChevronUp, ChevronDown, Trash2, Columns, Layers } from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';

export const LayerTree: React.FC = () => {
  const {
    screens,
    activeScreenId,
    selectedPanelId,
    selectPanel,
    selectedComponentId,
    selectComponent,
    deleteComponent,
    moveComponent,
  } = useCanvasStore();

  const currentScreen = screens.find((s) => s.id === activeScreenId);
  const panels = currentScreen?.panels || [];

  if (panels.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
        <Layers className="w-8 h-8 mb-2 opacity-50 text-slate-400" />
        <p className="text-xs">패널이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-3">
      {panels.map((panel, pIdx) => {
        const isPanelActive = panel.id === selectedPanelId;
        return (
          <div key={panel.id} className="space-y-1">
            {/* 패널 타이틀 바 */}
            <div
              onClick={() => selectPanel(panel.id)}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${
                isPanelActive
                  ? 'bg-blue-100/70 text-blue-900 border border-blue-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <Columns className="w-3 h-3 text-blue-600 shrink-0" />
                <span className="truncate">
                  패널 {pIdx + 1}: {panel.title}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">({panel.components.length})</span>
            </div>

            {/* 패널 내부 컴포넌트 목록 */}
            <div className="pl-2 space-y-1">
              {panel.components.length === 0 ? (
                <div className="px-2 py-1 text-[11px] text-slate-400 italic">비어 있음</div>
              ) : (
                panel.components.map((comp, cIdx) => {
                  const isSelected = comp.id === selectedComponentId;
                  return (
                    <div
                      key={comp.id}
                      onClick={() => {
                        selectPanel(panel.id);
                        selectComponent(comp.id);
                      }}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition cursor-pointer group ${
                        isSelected
                          ? 'bg-blue-50 border border-blue-400 text-blue-900 font-semibold shadow-xs'
                          : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-[10px] text-slate-400 font-mono w-3">{cIdx + 1}</span>
                        <span className="truncate">{comp.name || comp.label || comp.type}</span>
                      </div>

                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          disabled={cIdx === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            moveComponent(comp.id, 'up');
                          }}
                          className="p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-20"
                          title="위로 이동"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                          disabled={cIdx === panel.components.length - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            moveComponent(comp.id, 'down');
                          }}
                          className="p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-20"
                          title="아래로 이동"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteComponent(comp.id);
                          }}
                          className="p-0.5 text-slate-400 hover:text-red-500"
                          title="삭제"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
