import React, { useState } from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { useCustomComponentStore } from '../../store/customComponentStore';
import { Trash2, Sliders, BookmarkPlus } from 'lucide-react';
import { CustomComponentModal } from '../palette/CustomComponentModal';
import { VibePromptSection } from './VibePromptSection';

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
        <p className="text-[11px] text-slate-600 mt-1">캔버스에서 컴포넌트를 클릭해 편집하세요.</p>
      </div>
    );
  }

  const handleUpdate = (updates: any) => {
    updateComponent(selectedComponent.id, updates);
  };

  return (
    <div className="h-full flex flex-col p-3 space-y-2.5 overflow-hidden bg-white">
      {/* 1. 최상단 헤더: 영문 태그 제거, 컴포넌트 타이틀 배치, 높이 최적화 */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 shrink-0">
        <h3 className="text-xs font-bold text-slate-800 truncate flex-1 mr-2" title={selectedComponent.name || selectedComponent.label}>
          {selectedComponent.name || selectedComponent.label || '컴포넌트'}
        </h3>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1 rounded text-blue-600 hover:bg-blue-50 transition border border-blue-200"
            title="이 설정을 내 도구함에 등록"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => deleteComponent(selectedComponent.id)}
            className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-slate-100 transition"
            title="컴포넌트 삭제"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. 컴포넌트 핵심 컨트롤 영역 (상단 타이틀바 색상 라벨 제거, 라벨/텍스트 라벨 제거) */}
      <div className="space-y-2 shrink-0">
        {/* 상단 타이틀바 색상 선택기 (라벨 제거) */}
        {selectedComponent.headerColor !== undefined && (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={selectedComponent.headerColor || '#5ea578'}
              onChange={(e) => handleUpdate({ headerColor: e.target.value })}
              className="w-7 h-7 rounded border border-slate-300 bg-transparent cursor-pointer shrink-0"
              title="상단 바 색상 선택"
            />
            <input
              type="text"
              value={selectedComponent.headerColor || ''}
              onChange={(e) => handleUpdate({ headerColor: e.target.value })}
              placeholder="#5ea578"
              className="flex-1 px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs font-mono text-slate-700 outline-none"
            />
          </div>
        )}

        {/* 라벨 텍스트 입력 (라벨 제거, 플레이스홀더: '라벨을 정하세요') */}
        {selectedComponent.label !== undefined && (
          <div>
            <input
              type="text"
              value={selectedComponent.label}
              placeholder="라벨을 정하세요"
              onChange={(e) => handleUpdate({ label: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>
        )}

        {/* 네비게이션 탭일 경우 행/열 및 탭 관리 */}
        {selectedComponent.type === 'chipGroup' && (
          <div className="space-y-2 p-2 bg-slate-50 border border-slate-200 rounded">
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span className="font-semibold">열 개수</span>
              <div className="flex gap-1">
                {[2, 3, 4, 5, 6].map((col) => (
                  <button
                    key={col}
                    onClick={() => {
                      const currentRows = selectedComponent.rows || 2;
                      const total = currentRows * col;
                      const oldItems = selectedComponent.items || [];
                      const newItems = Array.from({ length: total }, (_, i) => oldItems[i] || `탭 ${i + 1}`);
                      handleUpdate({ columns: col, rows: currentRows, items: newItems });
                    }}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                      (selectedComponent.columns || 4) === col
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span className="font-semibold">행 개수</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      const currentCols = selectedComponent.columns || 4;
                      const total = r * currentCols;
                      const oldItems = selectedComponent.items || [];
                      const newItems = Array.from({ length: total }, (_, i) => oldItems[i] || `탭 ${i + 1}`);
                      handleUpdate({ columns: currentCols, rows: r, items: newItems });
                    }}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                      (selectedComponent.rows || 2) === r
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 메모용 텍스트박스 */}
        <div>
          <textarea
            rows={2}
            value={selectedComponent.functionNote || ''}
            onChange={(e) => handleUpdate({ functionNote: e.target.value })}
            placeholder="메모를 입력하세요..."
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white resize-none transition"
          />
        </div>
      </div>

      {/* 3. 남은 공간을 모두 프롬프트에 제공 (flex-1) */}
      <VibePromptSection component={selectedComponent} onUpdate={handleUpdate} />

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
