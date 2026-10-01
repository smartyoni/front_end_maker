import React, { useState } from 'react';
import { Plus, Check, FolderOpen, MoreVertical, Edit2, Trash2, X } from 'lucide-react';

interface CategorySubItemListProps {
  activeTabName: string;
  subItems: string[];
  onAddSubItem: (text: string) => void;
  onDeleteSubItem: (idx: number) => void;
  onUpdateSubItem: (idx: number, text: string) => void;
  onReorderSubItems: (sourceIdx: number, targetIdx: number) => void;
}

export const CategorySubItemList: React.FC<CategorySubItemListProps> = ({
  activeTabName,
  subItems,
  onAddSubItem,
  onDeleteSubItem,
  onUpdateSubItem,
  onReorderSubItems,
}) => {
  const [newSubInput, setNewSubInput] = useState('');
  const [draggedSubIndex, setDraggedSubIndex] = useState<number | null>(null);
  const [editingSubIndex, setEditingSubIndex] = useState<number | null>(null);
  const [editingSubText, setEditingSubText] = useState('');
  const [menuOpenIndex, setMenuOpenIndex] = useState<number | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSubInput.trim();
    if (!trimmed) return;
    onAddSubItem(trimmed);
    setNewSubInput('');
  };

  const handleStartEdit = (idx: number, text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingSubIndex(idx);
    setEditingSubText(text);
    setMenuOpenIndex(null);
  };

  const handleSave = (idx: number) => {
    const trimmed = editingSubText.trim();
    if (trimmed) {
      onUpdateSubItem(idx, trimmed);
    }
    setEditingSubIndex(null);
  };

  const handleDelete = (idx: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onDeleteSubItem(idx);
    setMenuOpenIndex(null);
  };

  const handleDrop = (targetIdx: number) => {
    if (draggedSubIndex === null || draggedSubIndex === targetIdx) return;
    onReorderSubItems(draggedSubIndex, targetIdx);
    setDraggedSubIndex(null);
  };

  return (
    <div className="border-t border-slate-200 bg-white p-2">
      {/* 1. 하위 항목 헤더 */}
      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
          <span className="truncate">‘{activeTabName}’ 하위 항목</span>
          <span className="text-[10px] font-normal text-slate-500">({subItems.length})</span>
        </div>
      </div>

      {/* 2. 하위 항목 추가 입력바 */}
      <form onSubmit={handleAdd} className="flex items-center gap-1 mb-2">
        <input
          type="text"
          value={newSubInput}
          onChange={(e) => setNewSubInput(e.target.value)}
          placeholder={`'${activeTabName}' 에 새 항목 추가...`}
          className="flex-1 px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:border-blue-500 bg-slate-50 focus:bg-white"
        />
        <button
          type="submit"
          className="px-2.5 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          <span>추가</span>
        </button>
      </form>

      {/* 3. 하위 항목 목록 */}
      {subItems.length === 0 ? (
        <div className="py-3 text-center text-slate-400 text-[11px] bg-slate-50 rounded border border-dashed border-slate-200">
          등록된 하위 항목이 없습니다. 상단에서 항목을 추가해보세요.
        </div>
      ) : (
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {subItems.map((subItem, sIdx) => {
            const isSubDragging = sIdx === draggedSubIndex;
            const isMenuOpen = menuOpenIndex === sIdx;

            return (
              <div
                key={sIdx}
                draggable={editingSubIndex !== sIdx}
                onDragStart={() => setDraggedSubIndex(sIdx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(sIdx)}
                className={`relative flex items-center justify-between pl-2 pr-0 py-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 transition ${
                  isSubDragging ? 'opacity-40 border-dashed border-blue-400' : ''
                }`}
              >
                <div className="flex items-center gap-1.5 flex-1 min-w-0 mr-1">
                  {editingSubIndex === sIdx ? (
                    <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editingSubText}
                        autoFocus
                        onChange={(e) => setEditingSubText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSave(sIdx);
                          if (e.key === 'Escape') setEditingSubIndex(null);
                        }}
                        onBlur={() => handleSave(sIdx)}
                        className="w-full text-xs px-1.5 py-0.5 bg-white border border-blue-500 rounded outline-none"
                      />
                      <button
                        onClick={() => handleSave(sIdx)}
                        className="p-0.5 text-emerald-600 hover:text-emerald-700"
                        title="저장"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span
                      onDoubleClick={(e) => handleStartEdit(sIdx, subItem, e)}
                      className="truncate cursor-pointer hover:text-blue-600 font-medium"
                      title="더블클릭 또는 우측 3점 메뉴로 수정"
                    >
                      {subItem}
                    </span>
                  )}
                </div>

                {/* 우측 3점 메뉴: 가장 우측 끝 최소 여백 밀착 배치 */}
                <div className="relative shrink-0 ml-auto mr-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenIndex(isMenuOpen ? null : sIdx);
                    }}
                    className={`p-0.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition ${
                      isMenuOpen ? 'text-slate-800 bg-slate-200' : ''
                    }`}
                    title="항목 메뉴"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>

                  {/* 3점 메뉴 팝업 */}
                  {isMenuOpen && (
                    <div
                      className="absolute right-0 top-6 z-30 bg-white text-slate-700 shadow-lg border border-slate-200 py-1 w-24 rounded text-[11px] font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={(e) => handleStartEdit(sIdx, subItem, e)}
                        className="w-full px-2.5 py-1 text-left hover:bg-slate-100 flex items-center gap-1.5"
                      >
                        <Edit2 className="w-3 h-3 text-slate-500" />
                        <span>수정</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(sIdx, e)}
                        className="w-full px-2.5 py-1 text-left hover:bg-red-50 text-red-600 flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>삭제</span>
                      </button>
                      <div className="border-t border-slate-100 my-0.5" />
                      <button
                        type="button"
                        onClick={() => setMenuOpenIndex(null)}
                        className="w-full px-2.5 py-1 text-left hover:bg-slate-100 text-slate-400 flex items-center gap-1.5"
                      >
                        <X className="w-3 h-3" />
                        <span>취소</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
