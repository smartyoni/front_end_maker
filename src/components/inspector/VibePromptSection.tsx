import React, { useState } from 'react';
import { Copy, Check, Terminal, RotateCcw } from 'lucide-react';
import { ComponentItem } from '../../types/builder';

interface VibePromptSectionProps {
  component: ComponentItem;
  onUpdate: (updates: Partial<ComponentItem>) => void;
}

export const DEFAULT_VIBE_PROMPTS: Record<string, string> = {
  textGroup: `[React + Tailwind CSS 컴포넌트 구현 프롬프트]
- 컴포넌트명: 아웃라이너형 텍스트박스 그룹 (TextGroup)
- 레이아웃 및 기능 스펙:
  1. 그룹 헤더:
     - 헤더 바 전체 클릭 시 하위 블록 접기/펼치기(아코디언 토글). 좌측에 화살표(ChevronDown/Right)와 폴더 아이콘, 그룹명 표시.
     - 그룹명은 더블클릭 또는 우측 3점 메뉴를 통해 인라인 수정 가능.
     - 헤더 우측 끝에 [+] 버튼과 [⋮] 3점 메뉴 버튼을 배치하되, 3점 메뉴는 해당 라인의 가장 우측 끝에 최소의 여백만을 가지도록 밀착 배치.
     - 3점 메뉴 클릭 시 [이름 수정], [그룹 삭제], [취소] 드롭다운 노출.
  2. 자식 텍스트 블록(Block) 목록:
     - 기본 생성 시 빈 텍스트 블록 1개가 기본 포함되어 있음 (placeholder: '(빈 블록)').
     - 블록 단순 클릭 시에는 편집창이 열리지 않으며, 텍스트 내 URL 하이퍼링크 및 휴대폰 번호(010 등) SMS 연결이 바로 동작함.
     - 블록 내용 수정은 우측 3점 메뉴 [⋮]의 [수정]을 통해서만 진입하며, 진입 시 줄바꿈(Enter)이 지원되는 textarea 및 [완료] 버튼이 활성화됨.
     - 드래그 앤 드롭(HTML5 Drag & Drop)으로 블록 순서를 상하로 자유롭게 이동. 별도의 핸들 아이콘 없이 행 자체를 드래그하여 순서 변경.
     - 각 블록 라인의 가장 우측 끝에 최소의 여백으로 [⋮] 3점 메뉴 버튼 배치:
       * [수정]: 해당 블록의 편집 textarea 활성화
       * [복사]: 해당 블록에 입력된 텍스트 내용을 클립보드에 복사
       * [삭제]: 해당 블록 삭제
       * [취소]: 3점 메뉴 닫기
  3. 스타일:
     - 상단 헤더 배경색(#5ea578 세이지 그린 등 커스텀 테마 색상) 지원.
     - 슬림한 테두리(border-slate-300)와 컴팩트한 패딩(text-xs) 적용.`,

  checklist: `[React + Tailwind CSS 컴포넌트 구현 프롬프트]
- 컴포넌트명: 업무용 체크리스트 그룹 (ChecklistGroup)
- 레이아웃 및 기능 스펙:
  1. 그룹 헤더:
     - 헤더 바 전체 클릭 시 하위 체크 블록 접기/펼치기 토글. 좌측에 화살표와 폴더 아이콘, 그룹 타이틀 표시.
     - 타이틀은 더블클릭 또는 3점 메뉴를 통해 인라인 수정 가능.
     - 헤더 우측 끝에 [+] 항목 추가 버튼과 [⋮] 메뉴(이름 수정, 그룹 전체 삭제, 취소) 제공.
  2. 자식 체크 블록(Block) 목록:
     - 각 블록은 [체크박스 + 텍스트 영역]으로 구성 (기본 생성 시 빈 체크 블록 1개 포함).
     - 블록 클릭 시에는 편집창이 열리지 않고 URL/전화번호 SMS 링크가 동작하며, 체크박스 클릭으로 완료 토글.
     - 블록 내용 수정은 우측 [⋮] 3점 메뉴의 [수정]을 통해서만 진입 (줄바꿈 지원 textarea 및 [완료] 버튼).
     - 텍스트 내 URL 자동 감지 하이퍼링크 변환 및 휴대폰 번호 클릭 시 SMS 문자앱 연결 (sms: 프로토콜).
     - 체크박스 클릭 시 토글되며, 완료된 블록은 취소선(line-through) 및 흐린 텍스트 스타일 적용.
     - 드래그 앤 드롭(HTML5 Drag & Drop)으로 체크 블록 간 상하 순서 이동 지원 (핸들 아이콘 없이 행 자체 드래그).
     - 각 블록 라인의 가장 우측 끝에 최소의 여백으로 [⋮] 3점 메뉴 버튼 배치:
       * [수정]: 해당 블록의 편집 textarea 활성화
       * [복사]: 해당 블록에 입력된 텍스트 내용을 클립보드에 복사
       * [삭제]: 해당 블록 삭제
       * [취소]: 3점 메뉴 닫기
  3. 스타일:
     - 상단 헤더 배경색(#5ea578 세이지 그린), 테두리 border-slate-300, 텍스트 크기 text-xs 기반의 컴팩트한 비즈니스 툴 스타일.`,

  chipGroup: `[React + Tailwind CSS 컴포넌트 구현 프롬프트]
- 컴포넌트명: 네비게이션 탭 그리드 (NavigationTabGrid / CategoryTabGrid)
- 역할: 최상위 카테고리 탭 탐색 및 선택된 탭별 하위 항목(Sub-items) 생성·관리
- 레이아웃 및 기능 스펙:
  1. 상단 라벨 및 안내 바:
     - 태그 아이콘(Tag)과 컴포넌트명('네비게이션 탭') 표시.
     - 우측에 인터랙션 안내 힌트('더블클릭: 이름 수정 / 드래그: 순서 변경') 제공.
  2. 네비게이션 탭 그리드:
     - 열(columns, 기본 4열) 및 행(rows, 기본 2행) 격자 균등 배치(grid-cols-N).
     - 탭 클릭 시 활성 탭(Active Tab) 전환: 파란색 테마(bg-blue-600, text-white, border-blue-700, ring-1 ring-blue-400).
     - 비활성 탭: 깔끔한 화이트/연회색 카드 스타일(hover:bg-slate-100).
     - 각 탭에 등록된 하위 항목 개수를 표시하는 카운트 뱃지 노출.
     - 탭 이름 인라인 수정: 탭을 더블클릭하면 인라인 input이 열려 이름 변경 (Enter, 확인 버튼, onBlur 저장 지원).
     - 탭 드래그 앤 드롭(HTML5 Drag & Drop): 탭을 드래그하여 순서 재배치 지원. 탭 이동 시 해당 탭의 하위 항목 데이터도 함께 안전하게 동기화 이동.
  3. 선택된 탭의 하위 항목(Sub-items) 관리 패널:
     - 상단 그리드 바로 아래에 밀착 결합된 카드 형태로 렌더링.
     - 헤더: 폴더 아이콘(FolderOpen) + 현재 선택된 탭 이름('선택된 탭' 하위 항목) 및 총 개수 뱃지 표시.
     - 항목 추가 인풋: 텍스트 입력 후 Enter 또는 [+ 추가] 버튼 클릭 시 해당 탭의 하위 항목으로 등록.
     - 하위 항목 목록:
       * 행 자체 드래그 앤 드롭(HTML5 Drag & Drop)으로 상하 순서 변경 (별도 드래그 핸들 없음).
       * 더블클릭 시 인라인 input으로 항목 텍스트 수정.
       * 각 항목 우측 끝에 [⋮] 3점 메뉴 버튼 배치:
         - [수정]: 해당 항목의 인라인 input 활성화 및 저장
         - [삭제]: 해당 하위 항목 삭제
         - [취소]: 3점 메뉴 닫기
       * 하위 항목이 없을 때 빈 상태 안내 문구 노출.
  4. 스타일:
     - Tailwind CSS 기반 컴팩트 비즈니스 도구 디자인, border-slate-300, 텍스트 text-xs 기반의 정밀한 레이아웃.`,
};

export const VibePromptSection: React.FC<VibePromptSectionProps> = ({
  component,
  onUpdate,
}) => {
  const [copied, setCopied] = useState(false);

  // textGroup과 checklist는 기본 프롬프트가 존재함. 다른 컴포넌트는 빈 값.
  const defaultPrompt = DEFAULT_VIBE_PROMPTS[component.type] || '';
  const currentPrompt =
    component.vibePrompt !== undefined && component.vibePrompt.trim() !== ''
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
