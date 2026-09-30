import React, { useState } from 'react';
import { ComponentItem } from '../../types/builder';
import { useCanvasStore } from '../../store/canvasStore';
import { Check, Tag } from 'lucide-react';
import { CategorySubItemList } from './CategorySubItemList';

interface CategoryTabGridProps {
  component: ComponentItem;
}

export const CategoryTabGrid: React.FC<CategoryTabGridProps> = ({ component }) => {
  const { updateComponent } = useCanvasStore();

  const cols = component.columns || 4;
  const rows = component.rows || 2;
  const total = cols * rows;

  const defaultTabNames = ['전체', '업무', '개인', '프로젝트', '아이디어', '공부', '취미', '보관함'];
  const items = component.items && component.items.length > 0
    ? component.items
    : defaultTabNames.slice(0, total).concat(
        Array.from({ length: Math.max(0, total - defaultTabNames.length) }, (_, i) => `탭 ${i + 9}`)
      );

  const activeIndex = Math.min(component.activeTabIndex ?? 0, Math.max(0, items.length - 1));
  const subItemsMap = component.subItems || {};
  const currentSubItems = subItemsMap[String(activeIndex)] || [];

  const [editingTabIndex, setEditingTabIndex] = useState<number | null>(null);
  const [tabInputText, setTabInputText] = useState('');
  const [draggedTabIndex, setDraggedTabIndex] = useState<number | null>(null);

  // 탭 선택
  const handleSelectTab = (idx: number) => {
    updateComponent(component.id, { activeTabIndex: idx });
  };

  // 탭 이름 인라인 수정
  const startEditingTab = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTabIndex(idx);
    setTabInputText(items[idx] || '');
  };

  const handleSaveTabName = (idx: number) => {
    const trimmed = tabInputText.trim();
    if (trimmed) {
      const newItems = [...items];
      newItems[idx] = trimmed;
      updateComponent(component.id, { items: newItems });
    }
    setEditingTabIndex(null);
  };

  // 탭 드래그 앤 드롭 정렬 (하위 항목 데이터도 함께 이동)
  const handleTabDragStart = (idx: number, e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', String(idx));
    setDraggedTabIndex(idx);
  };

  const handleTabDrop = (targetIdx: number) => {
    if (draggedTabIndex === null || draggedTabIndex === targetIdx) return;

    const newItems = [...items];
    const [movedTab] = newItems.splice(draggedTabIndex, 1);
    newItems.splice(targetIdx, 0, movedTab);

    // 하위 항목 데이터도 탭 인덱스에 맞춰 매핑 재정렬
    const oldSubList = items.map((_, i) => subItemsMap[String(i)] || []);
    const [movedSub] = oldSubList.splice(draggedTabIndex, 1);
    oldSubList.splice(targetIdx, 0, movedSub);

    const newSubMap: Record<string, string[]> = {};
    oldSubList.forEach((list, i) => {
      newSubMap[String(i)] = list;
    });

    let newActive = activeIndex;
    if (activeIndex === draggedTabIndex) {
      newActive = targetIdx;
    } else if (draggedTabIndex < activeIndex && targetIdx >= activeIndex) {
      newActive -= 1;
    } else if (draggedTabIndex > activeIndex && targetIdx <= activeIndex) {
      newActive += 1;
    }

    updateComponent(component.id, {
      items: newItems,
      subItems: newSubMap,
      activeTabIndex: newActive,
    });
    setDraggedTabIndex(null);
  };

  // 하위 항목 조작 핸들러
  const handleAddSubItem = (text: string) => {
    updateComponent(component.id, {
      subItems: {
        ...subItemsMap,
        [String(activeIndex)]: [...currentSubItems, text],
      },
    });
  };

  const handleDeleteSubItem = (subIdx: number) => {
    updateComponent(component.id, {
      subItems: {
        ...subItemsMap,
        [String(activeIndex)]: currentSubItems.filter((_, i) => i !== subIdx),
      },
    });
  };

  const handleUpdateSubItem = (subIdx: number, text: string) => {
    const updated = [...currentSubItems];
    updated[subIdx] = text;
    updateComponent(component.id, {
      subItems: {
        ...subItemsMap,
        [String(activeIndex)]: updated,
      },
    });
  };

  const handleReorderSubItems = (sourceIdx: number, targetIdx: number) => {
    const updated = [...currentSubItems];
    const [moved] = updated.splice(sourceIdx, 1);
    updated.splice(targetIdx, 0, moved);
    updateComponent(component.id, {
      subItems: {
        ...subItemsMap,
        [String(activeIndex)]: updated,
      },
    });
  };

  const activeTabName = items[activeIndex] || `탭 ${activeIndex + 1}`;

  return (
    <div className="w-full border border-slate-300 rounded bg-white shadow-sm overflow-hidden select-none">
      {/* 1. 상단 라벨 및 안내 */}
      <div className="px-2.5 py-1.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          <Tag className="w-3.5 h-3.5 text-blue-600" />
          <span>{component.label || component.name || '네비게이션 탭'}</span>
        </div>
        <span className="text-[10px] text-slate-500">더블클릭: 이름 수정 / 드래그: 순서 변경</span>
      </div>

      {/* 2. 탭 그리드 영역 */}
      <div
        className="p-1.5 grid gap-1 bg-slate-50/60"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {items.map((tab, idx) => {
          const isActive = idx === activeIndex;
          const isDragging = idx === draggedTabIndex;
          const subCount = (subItemsMap[String(idx)] || []).length;

          return (
            <div
              key={idx}
              draggable
              onDragStart={(e) => handleTabDragStart(idx, e)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleTabDrop(idx)}
              onClick={() => handleSelectTab(idx)}
              onDoubleClick={(e) => startEditingTab(idx, e)}
              className={`relative px-1 py-1.5 rounded text-center cursor-pointer transition-all flex items-center justify-center min-h-[34px] border ${
                isDragging ? 'opacity-40 border-dashed border-blue-500 bg-blue-50' : ''
              } ${
                isActive
                  ? 'bg-blue-600 text-white font-bold border-blue-700 shadow-sm ring-1 ring-blue-400'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400 hover:bg-slate-100'
              }`}
              title="클릭: 선택 / 더블클릭: 수정 / 드래그: 순서 이동"
            >
              {editingTabIndex === idx ? (
                <div className="flex items-center w-full px-0.5" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={tabInputText}
                    autoFocus
                    onChange={(e) => setTabInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveTabName(idx);
                      if (e.key === 'Escape') setEditingTabIndex(null);
                    }}
                    onBlur={() => handleSaveTabName(idx)}
                    className="w-full text-[11px] text-slate-900 bg-white px-1 py-0.5 rounded outline-none border border-blue-500"
                  />
                  <button
                    onClick={() => handleSaveTabName(idx)}
                    className="ml-0.5 p-0.5 text-emerald-600 hover:text-emerald-700"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1 w-full px-1">
                  <span className="text-[11px] truncate">{tab}</span>
                  {subCount > 0 && (
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded-full font-semibold ${
                        isActive ? 'bg-blue-800 text-blue-100' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {subCount}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. 선택된 탭의 하위 항목 영역 (분리된 서브 컴포넌트) */}
      <CategorySubItemList
        activeTabName={activeTabName}
        subItems={currentSubItems}
        onAddSubItem={handleAddSubItem}
        onDeleteSubItem={handleDeleteSubItem}
        onUpdateSubItem={handleUpdateSubItem}
        onReorderSubItems={handleReorderSubItems}
      />
    </div>
  );
};
