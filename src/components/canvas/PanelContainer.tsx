import React from 'react';
import { Panel } from '../../types/builder';
import { useCanvasStore } from '../../store/canvasStore';
import { CanvasItemRenderer } from './CanvasItemRenderer';
import { Plus, CheckCircle2, Columns } from 'lucide-react';

interface PanelContainerProps {
  panel: Panel;
  index: number;
}

export const PanelContainer: React.FC<PanelContainerProps> = ({ panel, index }) => {
  const {
    selectedPanelId,
    selectPanel,
    selectedComponentId,
    selectComponent,
    setPanelWidth,
    isPreviewMode,
  } = useCanvasStore();

  const isSelected = selectedPanelId === panel.id;

  const widthOptions = ['220px', '260px', '320px', '400px', 'flex-1'];

  return (
    <div
      onClick={() => selectPanel(panel.id)}
      style={{ width: panel.width === 'flex-1' ? undefined : panel.width }}
      className={`h-full flex flex-col bg-slate-50 border-r border-slate-200 transition-all ${
        panel.width === 'flex-1' ? 'flex-1 min-w-[360px]' : 'shrink-0'
      } ${
        !isPreviewMode && isSelected
          ? 'ring-2 ring-blue-500 ring-inset bg-blue-50/10'
          : 'hover:bg-slate-100/50'
      }`}
    >
      {/* 패널 헤더 (편집 모드 시 너비 설정 및 선택 표시) */}
      {!isPreviewMode && (
        <div
          className={`h-9 px-3 border-b flex items-center justify-between text-xs transition ${
            isSelected
              ? 'bg-blue-600 text-white border-blue-700 font-semibold'
              : 'bg-white text-slate-700 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-1.5 truncate">
            <Columns className="w-3.5 h-3.5 shrink-0 opacity-80" />
            <span className="truncate">
              패널 {index + 3}: {panel.title}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* 너비 조절 드롭다운 */}
            <select
              value={panel.width}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setPanelWidth(panel.id, e.target.value)}
              className={`text-[11px] py-0.5 px-1.5 rounded border focus:outline-none ${
                isSelected
                  ? 'bg-blue-700 border-blue-500 text-white'
                  : 'bg-slate-50 border-slate-300 text-slate-700'
              }`}
            >
              {widthOptions.map((w) => (
                <option key={w} value={w}>
                  {w === 'flex-1' ? '자동 확장 (flex-1)' : w}
                </option>
              ))}
            </select>

            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-200" />}
          </div>
        </div>
      )}

      {/* 패널 내부 컴포넌트 렌더링 영역 (여백 없이 꽉 찬 밀착 레이아웃) */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-1.5">
        {panel.components.length === 0 ? (
          <div className="h-32 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-300 rounded-xl text-slate-400">
            <span className="text-xs">컴포넌트가 없습니다</span>
            <span className="text-[10px] text-slate-500 mt-0.5">좌측 도구함에서 클릭하여 추가하세요</span>
          </div>
        ) : (
          panel.components.map((comp) => (
            <CanvasItemRenderer
              key={comp.id}
              component={comp}
              isSelected={comp.id === selectedComponentId}
              onSelect={() => selectComponent(comp.id)}
            />
          ))
        )}
      </div>

      {/* 패널 하단 빠른 추가 가이드 버튼 */}
      {!isPreviewMode && (
        <div className="p-2 border-t border-slate-200 bg-white/70">
          <button
            onClick={(e) => {
              e.stopPropagation();
              selectPanel(panel.id);
            }}
            className={`w-full py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-dashed ${
              isSelected
                ? 'bg-blue-50 border-blue-400 text-blue-700'
                : 'bg-slate-50 border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isSelected ? '이 패널이 선택됨 (도구함 클릭 시 추가)' : '이 패널 선택하기'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
