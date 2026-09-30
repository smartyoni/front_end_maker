import React from 'react';
import { ComponentType } from '../../types/builder';

interface CustomComponentFormProps {
  compType: ComponentType;
  setCompType: (val: ComponentType) => void;
  label: string;
  setLabel: (val: string) => void;
  headerColor: string;
  setHeaderColor: (val: string) => void;
  columns: number;
  setColumns: (val: number) => void;
  itemsText: string;
  setItemsText: (val: string) => void;
  content: string;
  setContent: (val: string) => void;
  functionNote: string;
  setFunctionNote: (val: string) => void;
}

const AVAILABLE_TYPES: { type: ComponentType; label: string }[] = [
  { type: 'colorBlock', label: '컬러 메모 블록' },
  { type: 'chipGroup', label: '칩/버튼 그리드' },
  { type: 'button', label: '단일 버튼' },
  { type: 'quickInput', label: '빠른 입력바' },
  { type: 'card', label: '컨텐츠 카드' },
  { type: 'header', label: '상단 네비바' },
  { type: 'checklist', label: '체크리스트' },
  { type: 'input', label: '입력 폼' },
  { type: 'text', label: '텍스트' },
  { type: 'tabs', label: '탭 바' },
];

export const CustomComponentForm: React.FC<CustomComponentFormProps> = ({
  compType,
  setCompType,
  label,
  setLabel,
  headerColor,
  setHeaderColor,
  columns,
  setColumns,
  itemsText,
  setItemsText,
  content,
  setContent,
  functionNote,
  setFunctionNote,
}) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-bold text-slate-700 block mb-1">UI 기본 형태</label>
          <select
            value={compType}
            onChange={(e) => setCompType(e.target.value as ComponentType)}
            className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs"
          >
            {AVAILABLE_TYPES.map((t) => (
              <option key={t.type} value={t.type}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-bold text-slate-700 block mb-1">표시 라벨/타이틀</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="타이틀 텍스트"
            className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs"
          />
        </div>
      </div>

      {compType === 'colorBlock' && (
        <div>
          <label className="font-bold text-slate-700 block mb-1">상단 바 포인트 컬러</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={headerColor}
              onChange={(e) => setHeaderColor(e.target.value)}
              className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
            />
            <input
              type="text"
              value={headerColor}
              onChange={(e) => setHeaderColor(e.target.value)}
              className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded font-mono text-xs"
            />
          </div>
        </div>
      )}

      {compType === 'chipGroup' && (
        <div>
          <label className="font-bold text-slate-700 block mb-1">열(컬럼) 개수: {columns}열</label>
          <input
            type="range"
            min={1}
            max={6}
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
            className="w-full"
          />
        </div>
      )}

      {(compType === 'chipGroup' || compType === 'checklist' || compType === 'tabs') && (
        <div>
          <label className="font-bold text-slate-700 block mb-1">하위 아이템 목록 (한 줄에 하나씩)</label>
          <textarea
            value={itemsText}
            onChange={(e) => setItemsText(e.target.value)}
            rows={3}
            placeholder="항목1&#10;항목2&#10;항목3"
            className="w-full px-2.5 py-1.5 border border-slate-300 rounded outline-none text-xs"
          />
        </div>
      )}

      <div>
        <label className="font-bold text-slate-700 block mb-1">내용 / 플레이스홀더</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={2}
          placeholder="표시될 본문 내용이나 플레이스홀더"
          className="w-full px-2.5 py-1.5 border border-slate-300 rounded outline-none text-xs"
        />
      </div>

      {/* 기능 및 스펙 상세 정의 (이모지 제거) */}
      <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded">
        <label className="font-bold text-amber-900 block mb-1 flex items-center justify-between text-xs">
          <span>기능 스펙 및 개발 정의 (Function Note)</span>
          <span className="text-[10px] text-amber-700 font-normal">기능/동작/구조 스펙 기술</span>
        </label>
        <textarea
          value={functionNote}
          onChange={(e) => setFunctionNote(e.target.value)}
          rows={2}
          placeholder="예: 클릭 시 결제 API 호출 후 토스트 노출 / 선택 항목에 따라 서브 패널 데이터 갱신"
          className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded text-slate-800 outline-none text-[11px]"
        />
      </div>
    </div>
  );
};
