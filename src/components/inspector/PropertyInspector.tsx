import React, { useState } from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { useCustomComponentStore } from '../../store/customComponentStore';
import { StyleSection } from './StyleSection';
import { ActionSection } from './ActionSection';
import { Trash2, Sliders, BookmarkPlus } from 'lucide-react';
import { CustomComponentModal } from '../palette/CustomComponentModal';

export const PropertyInspector: React.FC = () => {
  const { screens, activeScreenId, selectedComponentId, updateComponent, deleteComponent } = useCanvasStore();
  const { addPreset } = useCustomComponentStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition border border-blue-200"
            title="이 설정을 내 도구함에 등록"
          >
            <BookmarkPlus className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteComponent(selectedComponent.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 transition"
            title="컴포넌트 삭제"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 기본 텍스트 및 속성 */}
      <div className="space-y-3">
        {selectedComponent.type === 'chipGroup' && (
          <div className="space-y-2">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                열(컬럼) 개수
              </label>
              <div className="grid grid-cols-5 gap-1">
                {[1, 2, 3, 4, 5].map((col) => {
                  const isActive = (selectedComponent.columns || 4) === col;
                  return (
                    <button
                      key={col}
                      onClick={() => {
                        const currentRows = selectedComponent.rows || 2;
                        const total = currentRows * col;
                        const newItems = Array.from({ length: total }, (_, i) => String(i + 1));
                        handleUpdate({ columns: col, rows: currentRows, items: newItems });
                      }}
                      className={`py-1.5 rounded text-xs font-bold border transition ${
                        isActive
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {col}열
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                행(로우) 개수
              </label>
              <div className="grid grid-cols-5 gap-1">
                {[1, 2, 3, 4, 5].map((row) => {
                  const currentCols = selectedComponent.columns || 4;
                  const isActive = (selectedComponent.rows || 2) === row;
                  return (
                    <button
                      key={row}
                      onClick={() => {
                        const total = row * currentCols;
                        const newItems = Array.from({ length: total }, (_, i) => String(i + 1));
                        handleUpdate({ rows: row, columns: currentCols, items: newItems });
                      }}
                      className={`py-1.5 rounded text-xs font-bold border transition ${
                        isActive
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {row}행
                    </button>
                  );
                })}
        </div>
      </div>

      <div className="p-2 bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex justify-between items-center">
        <span>총 요소 개수: <strong className="text-blue-600">{(selectedComponent.rows || 2) * (selectedComponent.columns || 4)}개</strong> (1~{(selectedComponent.rows || 2) * (selectedComponent.columns || 4)} 자동 넘버링)</span>
      </div>
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

        {/* 탭/목록 아이템 쉼표 구분 편집 (바로가기 칩은 행/열 넘버링으로 대체) */}
        {selectedComponent.type !== 'chipGroup' && selectedComponent.items !== undefined && (
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
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>
        )}

        {/* 요소 기능 및 개발 스펙 메모란 */}
        <div className="pt-2 border-t border-slate-200">
          <label className="text-xs font-bold text-blue-700 block mb-1 flex items-center justify-between">
            <span>요소 기능 및 개발 메모</span>
            <span className="text-[10px] text-slate-400 font-normal">안티그래비티 참고용</span>
          </label>
          <textarea
            rows={3}
            value={selectedComponent.functionNote || ''}
            onChange={(e) => handleUpdate({ functionNote: e.target.value })}
            className="w-full p-2 bg-amber-50/50 border border-amber-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white resize-none transition"
          />
        </div>
      </div>

      {/* 스타일 편집 분리 컴포넌트 */}
      <StyleSection component={selectedComponent} onUpdate={handleUpdate} />

      {/* 액션/인터랙션 편집 분리 컴포넌트 */}
      <ActionSection component={selectedComponent} onUpdate={handleUpdate} />

      {/* 내 도구함에 등록 배너 버튼 */}
      <div className="pt-2">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded transition shadow-xs"
        >
          <BookmarkPlus className="w-4 h-4" />
          <span>이 설정을 내 도구함에 등록</span>
        </button>
      </div>

      {/* 내 컴포넌트 등록 모달 */}
      <CustomComponentModal
        isOpen={isModalOpen}
        mode="create"
        initialData={{
          name: selectedComponent.name || selectedComponent.label || '내 컴포넌트',
          component: selectedComponent,
        }}
        onClose={() => setIsModalOpen(false)}
        onSave={(presetData) => {
          addPreset(presetData);
          alert(`'${presetData.name}' 컴포넌트가 1번 패널 [내 컴포넌트] 도구함에 등록되었습니다.`);
        }}
      />
    </div>
  );
};
