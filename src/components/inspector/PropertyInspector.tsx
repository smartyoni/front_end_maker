import React from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { StyleSection } from './StyleSection';
import { ActionSection } from './ActionSection';
import { Trash2, Sliders } from 'lucide-react';

export const PropertyInspector: React.FC = () => {
  const { screens, activeScreenId, selectedComponentId, updateComponent, deleteComponent } = useCanvasStore();

  const currentScreen = screens.find((s) => s.id === activeScreenId);
  const allComponents = currentScreen?.panels.flatMap((p) => p.components) || [];
  const selectedComponent = allComponents.find((c) => c.id === selectedComponentId);

  if (!selectedComponent) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500">
        <Sliders className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-xs">선택된 컴포넌트가 없습니다.</p>
        <p className="text-[11px] text-slate-600 mt-1">캔버스에서 컴포넌트를 클릭해 속성을 편집하세요.</p>
      </div>
    );
  }

  const handleUpdate = (updates: any) => {
    updateComponent(selectedComponent.id, updates);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* 컴포넌트 기본 정보 헤더 */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
            {selectedComponent.type}
          </span>
          <h3 className="text-sm font-bold text-slate-800 truncate max-w-[170px]">
            {selectedComponent.name || selectedComponent.label}
          </h3>
        </div>
        <button
          onClick={() => deleteComponent(selectedComponent.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 transition"
          title="컴포넌트 삭제"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* 기본 텍스트 및 속성 */}
      <div className="space-y-3">
        {selectedComponent.type === 'chipGroup' && (
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              한 행당 열(컬럼) 개수 (동일 너비 배분)
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[2, 3, 4, 5].map((col) => {
                const isActive = (selectedComponent.columns || 4) === col;
                return (
                  <button
                    key={col}
                    onClick={() => handleUpdate({ columns: col })}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {col}열
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              모든 칩 메뉴의 가로 너비가 균등하게 자동 정렬됩니다.
            </p>
          </div>
        )}

        {selectedComponent.headerColor !== undefined && (
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">상단 타이틀 바 색상 (Header Color)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedComponent.headerColor || '#9333ea'}
                onChange={(e) => handleUpdate({ headerColor: e.target.value })}
                className="w-7 h-7 rounded border border-slate-300 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={selectedComponent.headerColor || ''}
                onChange={(e) => handleUpdate({ headerColor: e.target.value })}
                className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
              />
            </div>
          </div>
        )}

        {selectedComponent.label !== undefined && (
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">라벨 / 텍스트</label>
            <input
              type="text"
              value={selectedComponent.label}
              onChange={(e) => handleUpdate({ label: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>
        )}

        {selectedComponent.placeholder !== undefined && (
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">플레이스홀더 안내문</label>
            <input
              type="text"
              value={selectedComponent.placeholder}
              onChange={(e) => handleUpdate({ placeholder: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>
        )}

        {selectedComponent.content !== undefined && (
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">본문 설명 문구</label>
            <textarea
              rows={3}
              value={selectedComponent.content}
              onChange={(e) => handleUpdate({ content: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white resize-none transition"
            />
          </div>
        )}

        {/* 탭/목록 아이템 쉼표 구분 편집 */}
        {selectedComponent.items !== undefined && (
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">하위 항목 (쉼표로 구분)</label>
            <input
              type="text"
              value={selectedComponent.items.join(', ')}
              onChange={(e) =>
                handleUpdate({
                  items: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                })
              }
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>
        )}
      </div>

      {/* 스타일 편집 분리 컴포넌트 */}
      <StyleSection component={selectedComponent} onUpdate={handleUpdate} />

      {/* 액션/인터랙션 편집 분리 컴포넌트 */}
      <ActionSection component={selectedComponent} onUpdate={handleUpdate} />
    </div>
  );
};
