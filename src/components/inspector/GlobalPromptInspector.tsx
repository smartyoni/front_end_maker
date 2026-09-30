import React, { useState } from 'react';
import {
  Terminal,
  Copy,
  Check,
  RotateCcw,
  Trash2,
  Layers,
  FileCode,
} from 'lucide-react';
import { useGlobalSettingsStore } from '../../store/globalSettingsStore';

export const GlobalPromptInspector: React.FC = () => {
  const {
    promptItems,
    selectedPromptId,
    updatePromptItem,
    deletePromptItem,
    resetToDefaults,
    getAllAssembledPrompt,
  } = useGlobalSettingsStore();

  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');
  const [copied, setCopied] = useState(false);

  const selectedItem =
    promptItems.find((p) => p.id === selectedPromptId) || promptItems[0];

  const assembledPrompt = getAllAssembledPrompt();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!selectedItem) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500">
        <Terminal className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-xs">공통 프롬프트 규격을 선택하세요.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-3 space-y-2.5 bg-white overflow-hidden">
      {/* 1. 상단 탭 모드 전환: [선택 항목 편집] vs [전체 통합본 확정] */}
      <div className="flex border-b border-slate-200 shrink-0">
        <button
          onClick={() => setViewMode('single')}
          className={`flex-1 py-1.5 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition ${
            viewMode === 'single'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>선택 항목 프롬프트</span>
        </button>
        <button
          onClick={() => setViewMode('all')}
          className={`flex-1 py-1.5 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition ${
            viewMode === 'all'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>전체 통합 확정본</span>
        </button>
      </div>

      {viewMode === 'single' ? (
        <>
          {/* 2. 단일 항목 헤더 & 제목/설명 인라인 편집 */}
          <div className="space-y-1.5 shrink-0 pb-1 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={selectedItem.title}
                onChange={(e) =>
                  updatePromptItem(selectedItem.id, { title: e.target.value })
                }
                className="text-xs font-bold text-slate-800 px-1 py-0.5 border border-transparent hover:border-slate-300 focus:border-indigo-500 rounded flex-1 mr-2 outline-none"
                placeholder="규격 제목"
                title="클릭하여 규격 제목 수정"
              />

              <div className="flex items-center gap-1 shrink-0">
                {promptItems.length > 1 && (
                  <button
                    onClick={() => {
                      if (confirm(`'${selectedItem.title}' 규격을 삭제하시겠습니까?`)) {
                        deletePromptItem(selectedItem.id);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-red-500 rounded transition"
                    title="이 공통 규격 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => handleCopy(selectedItem.promptText)}
                  className={`flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded border transition ${
                    copied
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-300'
                      : 'bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700 shadow-xs'
                  }`}
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? '복사됨!' : '이 프롬프트 복사'}</span>
                </button>
              </div>
            </div>

            <input
              type="text"
              value={selectedItem.description}
              onChange={(e) =>
                updatePromptItem(selectedItem.id, { description: e.target.value })
              }
              className="text-[11px] text-slate-500 px-1 py-0.5 border border-transparent hover:border-slate-200 focus:border-indigo-400 rounded w-full outline-none"
              placeholder="규격에 대한 요약 설명 입력"
            />
          </div>

          {/* 3. 대형 프롬프트 편집기 (직접 수정 가능) */}
          <div className="flex-1 min-h-0 flex flex-col space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
              <span className="flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                <span>바이브코딩 프롬프트 내용 (직접 편집 가능)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">입력 즉시 자동 저장</span>
            </div>
            <textarea
              value={selectedItem.promptText}
              onChange={(e) =>
                updatePromptItem(selectedItem.id, { promptText: e.target.value })
              }
              placeholder="AI 코딩 도구에 전달할 상세 인터랙션 규격을 작성하세요..."
              className="w-full flex-1 p-2.5 bg-slate-900 text-slate-200 border border-slate-700 rounded-lg text-[11px] font-mono leading-relaxed outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
            />
          </div>
        </>
      ) : (
        /* 전체 통합본 확정 뷰 */
        <div className="flex-1 min-h-0 flex flex-col space-y-1.5">
          <div className="flex items-center justify-between shrink-0">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>전체 공통 규격 통합본 ({promptItems.length}개 항목)</span>
            </div>
            <button
              onClick={() => handleCopy(assembledPrompt)}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded border transition ${
                copied
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-300'
                  : 'bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700 shadow-xs'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '복사됨!' : '전체 통합본 복사'}</span>
            </button>
          </div>

          <textarea
            readOnly
            value={assembledPrompt}
            className="w-full flex-1 p-3 bg-slate-900 text-slate-200 border border-slate-700 rounded-lg text-[11px] font-mono leading-relaxed outline-none focus:ring-1 focus:ring-indigo-500 resize-none select-all"
            title="전체 통합본 (클릭 시 전체 선택)"
          />
        </div>
      )}

      {/* 하단 공통 초기화 액션 */}
      <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
        <span>💡 Cursor Rules나 시스템 프롬프트에 붙여넣어 사용하세요.</span>
        <button
          onClick={() => {
            if (confirm('모든 공통 규격 프롬프트를 기본 추천 규격으로 초기화하시겠습니까?')) {
              resetToDefaults();
            }
          }}
          className="flex items-center gap-1 hover:text-slate-700 transition"
          title="모든 프롬프트 초기화"
        >
          <RotateCcw className="w-3 h-3" />
          <span>기본값 리셋</span>
        </button>
      </div>
    </div>
  );
};
