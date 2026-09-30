import React, { useState } from 'react';
import { Terminal, Copy, Check, RotateCcw, Sliders } from 'lucide-react';
import { useGlobalSettingsStore } from '../../store/globalSettingsStore';

export const GlobalPromptInspector: React.FC = () => {
  const { resetSettings, getGeneratedGlobalPrompt } = useGlobalSettingsStore();
  const [copied, setCopied] = useState(false);

  const promptText = getGeneratedGlobalPrompt();

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col p-3 space-y-2 bg-white overflow-hidden">
      {/* 5번 패널 상단 헤더 */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0 mr-2">
          <Terminal className="w-4 h-4 text-indigo-600 shrink-0" />
          <h3 className="text-xs font-bold text-slate-800 truncate">
            프로젝트 공통 바이브 프롬프트
          </h3>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => {
              if (confirm('공통 설정을 기본값으로 초기화하시겠습니까?')) {
                resetSettings();
              }
            }}
            className="p-1 text-slate-400 hover:text-slate-600 rounded transition"
            title="공통 설정 초기화"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded border transition ${
              copied
                ? 'bg-emerald-50 text-emerald-600 border-emerald-300'
                : 'bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700 shadow-xs'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '복사됨!' : '프롬프트 복사'}</span>
          </button>
        </div>
      </div>

      {/* 안내 카드 */}
      <div className="p-2 bg-indigo-50/60 border border-indigo-100 rounded text-[11px] text-indigo-900 leading-tight shrink-0 flex items-start gap-1.5">
        <Sliders className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
        <span>
          1번 패널 <strong>[공통설정]</strong>에서 체크한 인터랙션 규칙들이 실시간으로 이 프롬프트에 자동 반영됩니다.
        </span>
      </div>

      {/* 대형 프롬프트 박스 (남은 높이를 모두 채움) */}
      <div className="flex-1 min-h-0 flex flex-col">
        <textarea
          readOnly
          value={promptText}
          className="w-full flex-1 p-3 bg-slate-900 text-slate-200 border border-slate-700 rounded-lg text-[11px] font-mono leading-relaxed outline-none focus:ring-1 focus:ring-indigo-500 resize-none select-all"
          title="클릭하여 전체 선택 및 복사"
        />
      </div>

      {/* 하단 안내 가이드 */}
      <div className="pt-1 border-t border-slate-100 shrink-0">
        <p className="text-[10px] text-slate-400 leading-tight">
          💡 AI 코딩 도구(Cursor, Antigravity 등)의 <strong>Rules(.cursorrules)</strong>나 세션 시스템 프롬프트에 붙여넣어 프로젝트 전역에 일관된 UX를 구현하세요.
        </p>
      </div>
    </div>
  );
};
