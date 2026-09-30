import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Folder,
  Plus,
  MoreVertical,
  Check,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';
import { ComponentItem } from '../../types/builder';
import { useCanvasStore } from '../../store/canvasStore';
import { RichTextItem } from './RichTextItem';

interface GroupBlockRendererProps {
  component: ComponentItem;
  isChecklist?: boolean;
}

export const GroupBlockRenderer: React.FC<GroupBlockRendererProps> = ({
  component,
  isChecklist = false,
}) => {
  const { updateComponent, deleteComponent } = useCanvasStore();
  const [isOpen, setIsOpen] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(component.label || component.name || '그룹');
  const [menuOpen, setMenuOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // 기본 빈 항목 1개 보장
  const items = component.items && component.items.length > 0 ? component.items : [''];
  const checkedItems = component.checkedItems || [];

  const handleTitleSubmit = () => {
    updateComponent(component.id, {
      label: titleInput.trim() || '그룹',
      name: titleInput.trim() || '그룹',
    });
    setIsEditingTitle(false);
  };

  const handleAddItem = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newItems = [...items, ''];
    const newChecked = [...checkedItems, false];
    updateComponent(component.id, {
      items: newItems,
      checkedItems: newChecked,
    });
    setIsOpen(true);
  };

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    updateComponent(component.id, { items: newItems });
  };

  const handleToggleCheck = (index: number) => {
    const newChecked = [...checkedItems];
    newChecked[index] = !newChecked[index];
    updateComponent(component.id, { checkedItems: newChecked });
  };

  const handleDeleteItem = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (items.length <= 1) {
      updateComponent(component.id, { items: [''], checkedItems: [false] });
      return;
    }
    const newItems = items.filter((_, i) => i !== index);
    const newChecked = checkedItems.filter((_, i) => i !== index);
    updateComponent(component.id, { items: newItems, checkedItems: newChecked });
  };

  // 드래그 앤 드롭 핸들러
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    const newItems = [...items];
    const newChecked = [...checkedItems];

    const [movedItem] = newItems.splice(draggedIndex, 1);
    const [movedCheck] = newChecked.splice(draggedIndex, 1);

    newItems.splice(index, 0, movedItem);
    newChecked.splice(index, 0, movedCheck || false);

    updateComponent(component.id, {
      items: newItems,
      checkedItems: newChecked,
    });
    setDraggedIndex(null);
  };

  const headerBg = component.headerColor || (isChecklist ? '#5ea578' : '#64748b');

  return (
    <div className="w-full border border-slate-300 bg-white select-none">
      {/* 1. 그룹 헤더: 헤더 전체 클릭 시 접힘/펼침 */}
      <div
        onClick={() => {
          if (!isEditingTitle) setIsOpen(!isOpen);
        }}
        className="px-2 py-1.5 text-white flex items-center justify-between text-xs font-semibold relative cursor-pointer select-none"
        style={{ backgroundColor: headerBg }}
      >
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <span className="p-0.5 hover:bg-black/10 rounded transition shrink-0">
            {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </span>
          <Folder className="w-3.5 h-3.5 shrink-0 opacity-90" />

          {isEditingTitle ? (
            <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={titleInput}
                autoFocus
                onChange={(e) => setTitleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTitleSubmit();
                  if (e.key === 'Escape') setIsEditingTitle(false);
                }}
                className="px-1.5 py-0.5 text-xs text-slate-800 bg-white rounded outline-none w-full max-w-[140px]"
              />
              <button onClick={handleTitleSubmit} className="p-0.5 hover:bg-black/20 rounded">
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <span
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditingTitle(true);
              }}
              className="truncate flex-1 font-bold"
              title="클릭하여 접기/펼치기, 더블클릭하여 이름 수정"
            >
              {component.label || component.name || (isChecklist ? '체크리스트' : '텍스트 그룹')}
            </span>
          )}
        </div>

        {/* 헤더 우측 버튼: 추가 & 3점 메뉴 */}
        <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={handleAddItem}
            className="p-1 hover:bg-black/15 rounded transition"
            title={isChecklist ? '체크리스트 항목 추가' : '텍스트박스 추가'}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 hover:bg-black/15 rounded transition"
              title="메뉴"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {/* 3점 메뉴 팝업 (수정, 삭제, 취소) */}
            {menuOpen && (
              <div className="absolute right-0 top-6 z-30 bg-white text-slate-700 shadow-lg border border-slate-200 py-1 w-28 text-[11px] font-medium">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingTitle(true);
                    setMenuOpen(false);
                  }}
                  className="w-full px-2.5 py-1 text-left hover:bg-slate-100 flex items-center gap-1.5"
                >
                  <Edit2 className="w-3 h-3 text-slate-500" />
                  <span>이름 수정</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('이 그룹과 전체 내용을 삭제하시겠습니까?')) {
                      deleteComponent(component.id);
                    }
                    setMenuOpen(false);
                  }}
                  className="w-full px-2.5 py-1 text-left hover:bg-red-50 text-red-600 flex items-center gap-1.5"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>그룹 삭제</span>
                </button>
                <div className="border-t border-slate-100 my-0.5" />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="w-full px-2.5 py-1 text-left hover:bg-slate-100 text-slate-400 flex items-center gap-1.5"
                >
                  <X className="w-3 h-3" />
                  <span>취소</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. 자식 텍스트 블록 목록 (드래그 앤 드롭 지원) */}
      {isOpen && (
        <div className="divide-y divide-slate-100">
          {items.map((item, idx) => {
            const isChecked = isChecklist && !!checkedItems[idx];
            return (
              <div
                key={idx}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(idx)}
                className={`flex items-center justify-between px-2 py-1.5 hover:bg-slate-50 transition group ${
                  draggedIndex === idx ? 'opacity-40 bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-2 flex-1 min-w-0 py-0.5" onClick={(e) => e.stopPropagation()}>
                  {/* 체크리스트용 체크박스 */}
                  {isChecklist && (
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleCheck(idx)}
                      className="mt-1 rounded border-slate-300 text-emerald-600 focus:ring-0 cursor-pointer w-3.5 h-3.5 shrink-0"
                    />
                  )}

                  {/* 줄바꿈, URL 하이퍼링크, 전화번호 SMS 연동 리치 텍스트 항목 */}
                  <RichTextItem
                    text={item}
                    onChange={(val) => handleItemChange(idx, val)}
                    isChecked={isChecked}
                  />
                </div>

                {/* 개별 항목 삭제 버튼 */}
                <button
                  type="button"
                  onClick={(e) => handleDeleteItem(idx, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 rounded transition shrink-0"
                  title="항목 삭제"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
