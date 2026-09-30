import React, { useState } from 'react';
import { Copy, Check, Terminal, RotateCcw } from 'lucide-react';
import { ComponentItem } from '../../types/builder';

interface VibePromptSectionProps {
  component: ComponentItem;
  onUpdate: (updates: Partial<ComponentItem>) => void;
}

const DEFAULT_VIBE_PROMPTS: Record<string, string> = {
  textGroup: `[React + Tailwind CSS 컴포넌트 구현 프롬프트]
- 컴포넌트명: 아웃라이너형 텍스트박스 그룹 (TextGroup)
- 레이아웃 및 기능 스펙:
  1. 그룹 헤더:
     - 헤더 바 전체 클릭 시 자식 항목 접기/펼치기(아코디언 토글). 좌측에 화살표(ChevronDown/Right)와 폴더 아이콘, 그룹명 표시.
     - 그룹명은 더블클릭 또는 우측 3점 메뉴를 통해 인라인 수정 가능.
     - 헤더 우측 끝에 [+] 버튼(클릭 시 하단에 빈 텍스트박스 행 즉시 추가)과 [⋮] 3점 메뉴 버튼 배치.
     - 3점 메뉴 클릭 시 [이름 수정], [그룹 삭제], [취소] 드롭다운 노출.
  2. 자식 텍스트 항목 목록:
     - 기본 생성 시 빈 텍스트박스 1개가 기본 포함되어 있음.
     - 각 행을 클릭해 자유롭게 텍스트 입력 및 수정 (placeholder: '(빈 항목)').
     - 드래그 앤 드롭(HTML5 Drag & Drop)으로 행 순서를 상하로 자유롭게 이동. 별도의 핸들 아이콘 없이 행 자체를 드래그하여 순서 변경.
     - 각 행 마우스 호버 시 우측에 개별 삭제(✕) 버튼 노출.
  3. 스타일:
     - 상단 헤더 배경색(#5ea578 세이지 그린 등 커스텀 테마 색상) 지원.
     - 슬림한 테두리(border-slate-300)와 컴팩트한 패딩(text-xs) 적용.`,

  checklist: `[React + Tailwind CSS 컴포넌트 구현 프롬프트]
- 컴포넌트명: 업무용 체크리스트 그룹 (ChecklistGroup)
- 레이아웃 및 기능 스펙:
  1. 그룹 헤더:
     - 헤더 바 전체 클릭 시 하위 체크리스트 접기/펼치기 토글. 좌측에 화살표와 폴더 아이콘, 그룹 타이틀 표시.
     - 타이틀은 더블클릭 또는 3점 메뉴를 통해 인라인 수정 가능.
     - 헤더 우측 끝에 [+] 항목 추가 버튼과 [⋮] 메뉴(이름 수정, 그룹 전체 삭제, 취소) 제공.
  2. 자식 체크리스트 항목:
     - 각 행은 [체크박스 + 텍스트 입력 필드]로 구성.
     - 기본 생성 시 빈 체크박스 항목 1개 포함.
     - 체크박스 클릭 시 토글되며, 완료된 항목은 취소선(line-through) 및 흐린 텍스트 스타일 적용.
     - 드래그 앤 드롭(HTML5 Drag & Drop)으로 체크 항목 간 상하 순서 이동 지원 (핸들 아이콘 없이 행 자체 드래그).
     - 각 행 마우스 호버 시 우측에 개별 삭제(✕) 버튼 노출.
  3. 스타일:
     - 상단 헤더 배경색(#5ea578 세이지 그린), 테두리 border-slate-300, 텍스트 크기 text-xs 기반의 컴팩트한 비즈니스 툴 스타일.`,
};

export const VibePromptSection: React.FC<VibePromptSectionProps> = ({
  component,
  onUpdate,
}) => {
  const [copied, setCopied] = useState(false);

  // textGroup과 checklist는 기본 프롬프트가 존재함. 다른 컴포넌트는 빈 값.
  const defaultPrompt = DEFAULT_VIBE_PROMPTS[component.type] || '';
  const currentPrompt =
    component.vibePrompt !== undefined
      ? component.vibePrompt
      : defaultPrompt;

  const handleCopy = () => {
    if (!currentPrompt.trim()) return;
    navigator.clipboard.writeText(currentPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetToDefault = () => {
    if (defaultPrompt) {
      onUpdate({ vibePrompt: defaultPrompt });
    } else {
      onUpdate({ vibePrompt: '' });
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 pt-2 border-t border-slate-200 space-y-1.5">
      <div className="flex items-center justify-between shrink-0">
        <label className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5" />
          <span>바이브코딩 프롬프트</span>
        </label>
        <div className="flex items-center gap-1">
          {defaultPrompt && (
            <button
              type="button"
              onClick={handleResetToDefault}
              className="p-1 text-slate-400 hover:text-slate-600 rounded transition"
              title="기본 추천 프롬프트로 재설정"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded border transition ${
              copied
                ? 'bg-emerald-50 text-emerald-600 border-emerald-300'
                : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'
            }`}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? '복사됨' : '복사'}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <textarea
          value={currentPrompt}
          onChange={(e) => onUpdate({ vibePrompt: e.target.value })}
          placeholder="이 컴포넌트를 AI 코딩 도구(Cursor, Antigravity 등)에 전달하여 바로 구현할 수 있는 프롬프트를 기록하세요..."
          className="w-full flex-1 min-h-[140px] p-2.5 bg-slate-900 text-slate-200 border border-slate-700 rounded text-[11px] font-mono leading-relaxed outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
        />
      </div>

      <p className="text-[10px] text-slate-400 leading-tight shrink-0 pb-1">
        AI 코딩 도구에 복사·붙여넣기하여 코드로 구현하는 프롬프트입니다.
      </p>
    </div>
  );
};
