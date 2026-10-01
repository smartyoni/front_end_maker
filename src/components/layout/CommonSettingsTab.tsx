import React, { useState } from 'react';
import {
  Trash2,
  Edit3,
  ArrowUpDown,
  MoreVertical,
  Link2,
  HelpCircle,
  Sparkles,
  RotateCcw,
  Plus,
  ChevronRight,
} from 'lucide-react';
import { useGlobalSettingsStore, CommonPromptItem } from '../../store/globalSettingsStore';

export const CommonSettingsTab: React.FC = () => {
  const {
    promptItems,
    selectedPromptId,
    selectPromptItem,
    addPromptItem,
    reorderPromptItems,
    resetToDefaults,
  } = useGlobalSettingsStore();

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleDragStart = (id: string, e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedId(id);
  };

  const handleDragOver = (id: string, e: React.DragEvent) => {
    e.preventDefault();
    if (dragOverId !== id) {
      setDragOverId(id);
    }
  };

  const handleDrop = (targetId: string) => {
    if (draggedId && draggedId !== targetId) {
      reorderPromptItems(draggedId, targetId);
    }
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const renderIcon = (iconName: CommonPromptItem['iconName']) => {
    switch (iconName) {
      case 'trash':
        return <Trash2 className="w-3.5 h-3.5 text-red-600" />;
      case 'edit':
        return <Edit3 className="w-3.5 h-3.5 text-blue-600" />;
      case 'drag':
        return <ArrowUpDown className="w-3.5 h-3.5 text-emerald-600" />;
      case 'menu':
        return <MoreVertical className="w-3.5 h-3.5 text-purple-600" />;
      case 'link':
        return <Link2 className="w-3.5 h-3.5 text-sky-600" />;
      case 'empty':
        return <HelpCircle className="w-3.5 h-3.5 text-amber-600" />;
      case 'style':
      default:
        return <Sparkles className="w-3.5 h-3.5 text-indigo-600" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 text-slate-800">
      {/* 1. 상단 안내 및 초기화 바 */}
      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between pb-1 border-b border-slate-200">
        <span>공통 프롬프트 규격 ({promptItems.length})</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-normal">클릭: 2번 패널 편집</span>
          <button
            onClick={() => {
              if (confirm('모든 공통 프롬프트를 기본 추천 규격으로 초기화하시겠습니까?')) {
                resetToDefaults();
              }
            }}
            className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
            title="기본값으로 초기화"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 2. 도구함과 동일한 리스트 형식의 공통설정 항목 목록 */}
      <div className="space-y-1">
        {promptItems.map((item) => {
          const isSelected = selectedPromptId === item.id;
          const isDragging = draggedId === item.id;
          const isDragOver = dragOverId === item.id && !isDragging;

          return (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(item.id, e)}
              onDragOver={(e) => handleDragOver(item.id, e)}
              onDrop={() => handleDrop(item.id)}
              onDragEnd={handleDragEnd}
              onClick={() => selectPromptItem(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 bg-white border cursor-pointer select-none transition group ${
                isDragging
                  ? 'opacity-30 border-dashed border-blue-500 bg-blue-50/40'
                  : isDragOver
                  ? 'border-blue-500 ring-2 ring-blue-400 ring-offset-1 bg-blue-50/20'
                  : isSelected
                  ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-1 ring-blue-500/30'
                  : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
              }`}
              title="클릭: 2번 패널에서 프롬프트 확인 및 편집 / 드래그: 순서 이동"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1 mr-1">
                <div
                  className={`p-1 border shrink-0 transition ${
                    isSelected
                      ? 'border-blue-300 bg-white shadow-2xs'
                      : 'border-slate-200 bg-slate-50 group-hover:bg-white'
                  }`}
                >
                  {renderIcon(item.iconName)}
                </div>
                <div className="min-w-0 flex-1">
                  <span
                    className={`text-xs font-bold block truncate leading-tight ${
                      isSelected ? 'text-blue-900' : 'text-slate-800'
                    }`}
                  >
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate leading-tight mt-0.5">
                    {item.description}
                  </span>
                </div>
              </div>

              {/* 우측 선택 화살표 인디케이터 */}
              <div className="shrink-0 text-slate-400 group-hover:text-blue-600 transition">
                <ChevronRight
                  className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600 font-bold' : ''}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. 새 공통 규격 프롬프트 추가 버튼 */}
      <button
        onClick={() => {
          const title = prompt('새 공통 규격의 이름을 입력하세요:', '새 공통 인터랙션 규격');
          if (!title) return;
          const desc = prompt('간략한 설명을 입력하세요:', '프로젝트 전역 공통 적용 규격');
          addPromptItem(title, desc || '', `[${title} 스펙]:\n1. 상세 구현 가이드라인을 작성하세요.`);
        }}
        className="w-full py-1.5 px-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-300 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition text-slate-700"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>새 공통 프롬프트 규격 추가</span>
      </button>
    </div>
  );
};
