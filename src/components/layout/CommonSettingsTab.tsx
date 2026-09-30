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
  Terminal,
} from 'lucide-react';
import { useGlobalSettingsStore, CommonRuleItem } from '../../store/globalSettingsStore';

export const CommonSettingsTab: React.FC = () => {
  const {
    rules,
    toggleRule,
    reorderRules,
    resetRules,
    customGlobalPrompt,
    setCustomGlobalPrompt,
  } = useGlobalSettingsStore();

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const enabledCount = rules.filter((r) => r.enabled).length;

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
      reorderRules(draggedId, targetId);
    }
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const renderIcon = (iconName: CommonRuleItem['iconName']) => {
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
      {/* 상단 헤더: 항목 수 & 조작 안내 & 초기화 */}
      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between pb-1 border-b border-slate-200">
        <div className="flex items-center gap-1.5">
          <span>공통 규격 항목 ({enabledCount}/{rules.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-normal">드래그: 순서 이동</span>
          <button
            onClick={() => {
              if (confirm('모든 공통 규칙 설정을 기본값으로 초기화하시겠습니까?')) {
                resetRules();
              }
            }}
            className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
            title="기본 규칙으로 초기화"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 도구함과 동일한 규격의 컴포넌트 리스트 뷰 */}
      <div className="space-y-1">
        {rules.map((rule) => {
          const isDragging = draggedId === rule.id;
          const isDragOver = dragOverId === rule.id && !isDragging;

          return (
            <div
              key={rule.id}
              draggable
              onDragStart={(e) => handleDragStart(rule.id, e)}
              onDragOver={(e) => handleDragOver(rule.id, e)}
              onDrop={() => handleDrop(rule.id)}
              onDragEnd={handleDragEnd}
              onClick={() => toggleRule(rule.id)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 bg-white border cursor-pointer select-none transition group ${
                isDragging
                  ? 'opacity-30 border-dashed border-blue-500 bg-blue-50/40'
                  : isDragOver
                  ? 'border-blue-500 ring-2 ring-blue-400 ring-offset-1 bg-blue-50/20'
                  : rule.enabled
                  ? 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'
                  : 'border-slate-200 bg-slate-50/60 opacity-60 hover:opacity-90'
              }`}
              title="클릭: 활성화/해제 토글 / 드래그: 순서 이동"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                <div
                  className={`p-1 border shrink-0 transition ${
                    rule.enabled
                      ? 'border-slate-200 bg-slate-50 group-hover:bg-white'
                      : 'border-slate-200 bg-slate-100 text-slate-400'
                  }`}
                >
                  {renderIcon(rule.iconName)}
                </div>
                <div className="min-w-0 flex-1">
                  <span
                    className={`text-xs font-bold block truncate leading-tight ${
                      rule.enabled ? 'text-slate-800' : 'text-slate-400 line-through'
                    }`}
                  >
                    {rule.title}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate leading-tight mt-0.5">
                    {rule.description}
                  </span>
                </div>
              </div>

              {/* 토글 상태 뱃지 */}
              <div className="shrink-0 flex items-center">
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded transition ${
                    rule.enabled
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {rule.enabled ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 사용자 추가 규칙 메모 */}
      <div className="pt-2 border-t border-slate-200 space-y-1">
        <span className="text-[11px] font-bold text-slate-600">추가 특별 규칙 (메모)</span>
        <textarea
          rows={2}
          value={customGlobalPrompt}
          onChange={(e) => setCustomGlobalPrompt(e.target.value)}
          placeholder="프로젝트 공통 프롬프트에 추가할 커스텀 지침 입력..."
          className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white resize-none"
        />
      </div>

      {/* 5번 패널 연동 가이드 */}
      <div className="p-2 bg-indigo-50/70 border border-indigo-200 rounded text-xs flex items-center gap-1.5 text-indigo-900 leading-tight">
        <Terminal className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
        <span className="text-[11px]">
          위 리스트에서 ON된 규칙들이 <strong>5번 패널</strong>의 완성본 프롬프트로 확정됩니다.
        </span>
      </div>
    </div>
  );
};
