import React, { useState } from 'react';
import { MoreVertical, Edit2, Copy, Trash2, X, Check } from 'lucide-react';
import { RichTextItem } from './RichTextItem';

interface GroupBlockRowProps {
  idx: number;
  item: string;
  isChecked: boolean;
  isChecklist: boolean;
  draggedIndex: number | null;
  onDragStart: (idx: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (idx: number) => void;
  onItemChange: (idx: number, value: string) => void;
  onToggleCheck: (idx: number) => void;
  onDeleteItem: (idx: number, e: React.MouseEvent) => void;
}

export const GroupBlockRow: React.FC<GroupBlockRowProps> = ({
  idx,
  item,
  isChecked,
  isChecklist,
  draggedIndex,
  onDragStart,
  onDragOver,
  onDrop,
  onItemChange,
  onToggleCheck,
  onDeleteItem,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyText = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.trim()) return;
    navigator.clipboard.writeText(item);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setMenuOpen(false);
    }, 1000);
  };

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setMenuOpen(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteItem(idx, e);
    setMenuOpen(false);
  };

  return (
    <div
      draggable
      onDragStart={() => onDragStart(idx)}
      onDragOver={onDragOver}
      onDrop={() => onDrop(idx)}
      className={`flex items-start justify-between pl-2 pr-0.5 py-1.5 hover:bg-slate-50 transition group relative ${
        draggedIndex === idx ? 'opacity-40 bg-blue-50' : ''
      }`}
    >
      <div className="flex items-start gap-2 flex-1 min-w-0 py-0.5" onClick={(e) => e.stopPropagation()}>
        {/* 체크리스트용 체크박스 */}
        {isChecklist && (
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => onToggleCheck(idx)}
            className="mt-1 rounded border-slate-300 text-emerald-600 focus:ring-0 cursor-pointer w-3.5 h-3.5 shrink-0"
          />
        )}

        {/* 줄바꿈, URL 하이퍼링크, 전화번호 SMS 연동 리치 텍스트 블록 */}
        <RichTextItem
          text={item}
          isEditing={isEditing}
          onEndEdit={() => setIsEditing(false)}
          onChange={(val) => onItemChange(idx, val)}
          isChecked={isChecked}
          placeholder="(빈 블록)"
        />
      </div>

      {/* 편집 중일 때는 [완료] 버튼, 평상시에는 가장 우측 끝 최소 여백 [⋮] 3점 메뉴 */}
      {isEditing ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(false);
          }}
          className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold shrink-0 ml-1 mt-0.5 shadow-xs"
        >
          완료
        </button>
      ) : (
        <div className="relative shrink-0 ml-auto mr-0 mt-0.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-0.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
            title="블록 메뉴"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {/* 3점 메뉴 드롭다운 (수정, 복사, 삭제, 취소) */}
          {menuOpen && (
            <div className="absolute right-0 top-6 z-30 bg-white text-slate-700 shadow-lg border border-slate-200 py-1 w-24 text-[11px] font-medium">
              <button
                type="button"
                onClick={handleStartEdit}
                className="w-full px-2 py-1 text-left hover:bg-slate-100 flex items-center gap-1.5"
              >
                <Edit2 className="w-3 h-3 text-blue-600" />
                <span>수정</span>
              </button>
              <button
                type="button"
                onClick={handleCopyText}
                className="w-full px-2 py-1 text-left hover:bg-slate-100 flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-600" />}
                <span>{copied ? '복사됨' : '복사'}</span>
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="w-full px-2 py-1 text-left hover:bg-red-50 text-red-600 flex items-center gap-1.5"
              >
                <Trash2 className="w-3 h-3" />
                <span>삭제</span>
              </button>
              <div className="border-t border-slate-100 my-0.5" />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="w-full px-2 py-1 text-left hover:bg-slate-100 text-slate-400 flex items-center gap-1.5"
              >
                <X className="w-3 h-3" />
                <span>취소</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
