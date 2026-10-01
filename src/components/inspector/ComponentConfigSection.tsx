import React from 'react';
import { ComponentItem } from '../../types/builder';

interface ComponentConfigSectionProps {
  component: ComponentItem;
  onUpdate: (updates: Partial<ComponentItem>) => void;
}

export const ComponentConfigSection: React.FC<ComponentConfigSectionProps> = ({
  component,
  onUpdate,
}) => {
  return (
    <div className="space-y-3 p-1">
      {/* 1. 상단 타이틀바 색상 선택기 */}
      {component.headerColor !== undefined && (
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-500">테마 색상</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={component.headerColor || '#5ea578'}
              onChange={(e) => onUpdate({ headerColor: e.target.value })}
              className="w-7 h-7 rounded border border-slate-300 bg-transparent cursor-pointer shrink-0"
              title="상단 바 색상 선택"
            />
            <input
              type="text"
              value={component.headerColor || ''}
              onChange={(e) => onUpdate({ headerColor: e.target.value })}
              placeholder="#5ea578"
              className="flex-1 px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs font-mono text-slate-700 outline-none focus:bg-white focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {/* 2. 라벨 텍스트 입력 */}
      {component.label !== undefined && (
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-500">라벨 / 타이틀</label>
          <input
            type="text"
            value={component.label}
            placeholder="라벨을 정하세요"
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
          />
        </div>
      )}

      {/* 3. 네비게이션 탭일 경우 행/열 및 탭 관리 */}
      {component.type === 'chipGroup' && (
        <div className="space-y-2 p-2.5 bg-slate-50 border border-slate-200 rounded">
          <div className="flex items-center justify-between text-[11px] text-slate-600">
            <span className="font-semibold">열 개수</span>
            <div className="flex gap-1">
              {[2, 3, 4, 5, 6].map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => {
                    const currentRows = component.rows || 2;
                    const total = currentRows * col;
                    const oldItems = component.items || [];
                    const newItems = Array.from({ length: total }, (_, i) => oldItems[i] || `탭 ${i + 1}`);
                    onUpdate({ columns: col, rows: currentRows, items: newItems });
                  }}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition ${
                    (component.columns || 4) === col
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
                  type="button"
                  onClick={() => {
                    const currentCols = component.columns || 4;
                    const total = r * currentCols;
                    const oldItems = component.items || [];
                    const newItems = Array.from({ length: total }, (_, i) => oldItems[i] || `탭 ${i + 1}`);
                    onUpdate({ columns: currentCols, rows: r, items: newItems });
                  }}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition ${
                    (component.rows || 2) === r
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

      {/* 4. 본문 내용 (content가 있는 컴포넌트의 경우) */}
      {component.content !== undefined && (
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-500">본문 내용</label>
          <textarea
            rows={3}
            value={component.content || ''}
            onChange={(e) => onUpdate({ content: e.target.value })}
            placeholder="본문 내용을 입력하세요..."
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white resize-none transition"
          />
        </div>
      )}

      {/* 5. 항목 리스트 (리스트, 체크리스트 등 items가 있는 컴포넌트) */}
      {component.items !== undefined && component.type !== 'chipGroup' && (
        <div className="space-y-1.5 p-2 bg-slate-50 border border-slate-200 rounded">
          <div className="flex items-center justify-between text-[11px] text-slate-600">
            <span className="font-semibold">항목 목록 ({component.items.length})</span>
            <button
              type="button"
              onClick={() => {
                onUpdate({ items: [...(component.items || []), `새 항목 ${(component.items?.length || 0) + 1}`] });
              }}
              className="text-[10px] text-blue-600 hover:text-blue-800 font-bold"
            >
              + 항목 추가
            </button>
          </div>
          <div className="space-y-1 max-h-36 overflow-y-auto">
            {component.items.map((it, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <input
                  type="text"
                  value={it}
                  onChange={(e) => {
                    const newItems = [...(component.items || [])];
                    newItems[idx] = e.target.value;
                    onUpdate({ items: newItems });
                  }}
                  className="flex-1 px-2 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:border-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newItems = (component.items || []).filter((_, i) => i !== idx);
                    onUpdate({ items: newItems });
                  }}
                  className="p-1 text-slate-400 hover:text-red-500 rounded text-xs font-bold"
                  title="항목 삭제"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. 메모용 텍스트박스 */}
      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-slate-500">기능 메모</label>
        <textarea
          rows={2}
          value={component.functionNote || ''}
          onChange={(e) => onUpdate({ functionNote: e.target.value })}
          placeholder="이 컴포넌트에 대한 동작 메모나 전달사항을 입력하세요..."
          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white resize-none transition"
        />
      </div>
    </div>
  );
};
