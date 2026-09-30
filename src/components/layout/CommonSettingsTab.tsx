import React, { useState } from 'react';
import {
  Sliders,
  Copy,
  Check,
  RotateCcw,
  Trash2,
  Edit3,
  Terminal,
  Keyboard,
} from 'lucide-react';
import { useGlobalSettingsStore } from '../../store/globalSettingsStore';

export const CommonSettingsTab: React.FC = () => {
  const { settings, updateSettings, resetSettings, getGeneratedGlobalPrompt } =
    useGlobalSettingsStore();
  const [copied, setCopied] = useState(false);

  const promptText = getGeneratedGlobalPrompt();

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3.5 bg-slate-50/50 text-slate-800">
      {/* 탭 헤더 */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>바이브코딩 공통 설정</span>
          </div>
          <button
            onClick={() => {
              if (confirm('공통 설정을 기본값으로 되돌리시겠습니까?')) {
                resetSettings();
              }
            }}
            className="p-1 text-slate-400 hover:text-slate-600 rounded transition"
            title="기본 설정으로 초기화"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5">
          모든 컴포넌트에 일괄 적용되는 핵심 인터랙션 규칙을 설정합니다.
        </p>
      </div>

      {/* 1. 삭제 인터랙션 설정 */}
      <div className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-xs space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-red-600">
          <Trash2 className="w-3.5 h-3.5" />
          <span>삭제 확인 및 팝오버 규격</span>
        </div>

        {/* 팝업 위치 옵션 */}
        <div className="space-y-1.5 pt-1">
          <label
            onClick={() => updateSettings({ deleteConfirmStyle: 'nearPopover' })}
            className={`flex items-start gap-2 p-2 rounded border cursor-pointer transition ${
              settings.deleteConfirmStyle === 'nearPopover'
                ? 'bg-blue-50/50 border-blue-400'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <input
              type="radio"
              name="deleteConfirmStyle"
              checked={settings.deleteConfirmStyle === 'nearPopover'}
              onChange={() => updateSettings({ deleteConfirmStyle: 'nearPopover' })}
              className="mt-0.5"
            />
            <div>
              <div className="text-xs font-semibold text-slate-800">
                버튼 근처 초근접 팝오버 (추천 ⭐)
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                삭제 버튼 바로 옆에 말풍선 형태로 떠 마우스 이동을 최소화합니다.
              </p>
            </div>
          </label>

          <label
            onClick={() => updateSettings({ deleteConfirmStyle: 'modal' })}
            className={`flex items-start gap-2 p-2 rounded border cursor-pointer transition ${
              settings.deleteConfirmStyle === 'modal'
                ? 'bg-blue-50/50 border-blue-400'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <input
              type="radio"
              name="deleteConfirmStyle"
              checked={settings.deleteConfirmStyle === 'modal'}
              onChange={() => updateSettings({ deleteConfirmStyle: 'modal' })}
              className="mt-0.5"
            />
            <div>
              <div className="text-xs font-semibold text-slate-800">화면 중앙 확인 모달</div>
              <p className="text-[10px] text-slate-500 leading-tight">
                화면 정중앙에 팝업되는 전통적인 확인 모달창입니다.
              </p>
            </div>
          </label>
        </div>

        {/* Enter 키 즉시 삭제 체크박스 */}
        <div className="pt-1 border-t border-slate-100">
          <label className="flex items-center gap-2 text-xs cursor-pointer select-none text-slate-700">
            <input
              type="checkbox"
              checked={settings.deleteEnterKeyConfirm}
              onChange={(e) => updateSettings({ deleteEnterKeyConfirm: e.target.checked })}
              className="rounded text-blue-600 focus:ring-0"
            />
            <span className="flex items-center gap-1 font-medium">
              <Keyboard className="w-3.5 h-3.5 text-slate-500" />
              <span>확인 팝업 시 `Enter` 키로 즉시 삭제</span>
            </span>
          </label>
        </div>
      </div>

      {/* 2. 편집 & 인터랙션 설정 */}
      <div className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-xs space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
          <span>편집 및 데이터 조작 규격</span>
        </div>

        <div className="space-y-1.5 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
            <input
              type="checkbox"
              checked={settings.inlineEditTrigger === 'doubleClick'}
              onChange={(e) =>
                updateSettings({
                  inlineEditTrigger: e.target.checked ? 'doubleClick' : 'menuOnly',
                })
              }
              className="rounded text-blue-600"
            />
            <span className="font-medium">더블클릭 인라인 텍스트 수정 허용</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
            <input
              type="checkbox"
              checked={settings.dragAndDropReorder}
              onChange={(e) => updateSettings({ dragAndDropReorder: e.target.checked })}
              className="rounded text-blue-600"
            />
            <span className="font-medium">행 자체 드래그 앤 드롭 정렬 (핸들 없이 드래그)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
            <input
              type="checkbox"
              checked={settings.autoLinkDetect}
              onChange={(e) => updateSettings({ autoLinkDetect: e.target.checked })}
              className="rounded text-blue-600"
            />
            <span className="font-medium">URL 하이퍼링크 및 휴대폰 번호 SMS 자동 연결</span>
          </label>
        </div>
      </div>

      {/* 3. 추가 공통 프롬프트 메모 */}
      <div className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-xs space-y-1.5">
        <div className="text-xs font-bold text-slate-800">추가 공통 프롬프트 메모</div>
        <textarea
          rows={2}
          value={settings.customGlobalPrompt}
          onChange={(e) => updateSettings({ customGlobalPrompt: e.target.value })}
          placeholder="모든 컴포넌트 프롬프트에 추가할 나만의 공통 규칙을 적어보세요..."
          className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white resize-none"
        />
      </div>

      {/* 4. 자동 생성된 프로젝트 공통 바이브코딩 프롬프트 */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700">
            <Terminal className="w-3.5 h-3.5" />
            <span>생성된 공통 프롬프트</span>
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded border transition ${
              copied
                ? 'bg-emerald-50 text-emerald-600 border-emerald-300'
                : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'
            }`}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? '복사됨!' : '공통 프롬프트 복사'}</span>
          </button>
        </div>

        <textarea
          readOnly
          value={promptText}
          rows={8}
          className="w-full p-2 bg-slate-900 text-slate-200 border border-slate-700 rounded text-[11px] font-mono leading-relaxed outline-none resize-none"
        />
        <p className="text-[10px] text-slate-400">
          AI 코딩 도구(Cursor 등)에 프로젝트 규칙(Rules)이나 프롬프트 서두로 전달하는 공통 가이드입니다.
        </p>
      </div>
    </div>
  );
};
