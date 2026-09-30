import React, { useState, useEffect } from 'react';
import { X, Code2, Sliders, Check } from 'lucide-react';
import { ComponentItem, ComponentType, CustomComponentPreset } from '../../types/builder';

interface CustomComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (presetData: {
    name: string;
    description: string;
    category: string;
    component: Omit<ComponentItem, 'id'>;
  }) => void;
  initialData?: CustomComponentPreset | { component: Omit<ComponentItem, 'id'>; name?: string };
  mode: 'create' | 'edit';
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

export const CustomComponentModal: React.FC<CustomComponentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('사용자 정의');
  const [compType, setCompType] = useState<ComponentType>('colorBlock');
  const [label, setLabel] = useState('');
  const [content, setContent] = useState('');
  const [headerColor, setHeaderColor] = useState('#8b5cf6');
  const [columns, setColumns] = useState(4);
  const [itemsText, setItemsText] = useState('');
  const [functionNote, setFunctionNote] = useState('');
  const [isJsonMode, setIsJsonMode] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setName(initialData.name || ('component' in initialData ? initialData.component.name : '') || '새 커스텀 컴포넌트');
      setDescription(('description' in initialData ? initialData.description : '') || '');
      setCategory(('category' in initialData ? initialData.category : '사용자 정의') || '사용자 정의');

      const comp = 'component' in initialData ? initialData.component : (initialData as any);
      setCompType(comp.type || 'colorBlock');
      setLabel(comp.label || comp.name || '');
      setContent(comp.content || comp.placeholder || '');
      setHeaderColor(comp.headerColor || '#8b5cf6');
      setColumns(comp.columns || 4);
      setItemsText(comp.items ? comp.items.join('\n') : '');
      setFunctionNote(comp.functionNote || '');

      setJsonText(JSON.stringify(comp, null, 2));
    } else {
      setName('새 커스텀 컴포넌트');
      setDescription('');
      setCategory('사용자 정의');
      setCompType('colorBlock');
      setLabel('새 컴포넌트 타이틀');
      setContent('상세 내용 또는 안내 문구를 입력하세요.');
      setHeaderColor('#3b82f6');
      setColumns(4);
      setItemsText('항목 1\n항목 2\n항목 3\n항목 4');
      setFunctionNote('어떤 목적으로 쓰이며 어떻게 동작하는지 기능을 기술하세요.');
      setJsonText(
        JSON.stringify(
          {
            type: 'colorBlock',
            name: '새 컴포넌트',
            label: '새 타이틀',
            headerColor: '#3b82f6',
            content: '내용',
            functionNote: '기능 스펙',
          },
          null,
          2
        )
      );
    }
    setJsonError(null);
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('컴포넌트 이름을 입력해주세요.');
      return;
    }

    if (isJsonMode) {
      try {
        const parsed = JSON.parse(jsonText);
        if (!parsed.type) throw new Error('컴포넌트 type 속성이 필요합니다.');
        onSave({
          name: name.trim(),
          description: description.trim(),
          category: category.trim() || '사용자 정의',
          component: parsed,
        });
        onClose();
      } catch (err: any) {
        setJsonError(err.message || '올바른 JSON 형식이 아닙니다.');
      }
      return;
    }

    const items = itemsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const componentData: Omit<ComponentItem, 'id'> = {
      type: compType,
      name: name.trim(),
      label: label.trim(),
      content: content.trim() || undefined,
      headerColor: headerColor || undefined,
      columns: Number(columns) || undefined,
      items: items.length > 0 ? items : undefined,
      functionNote: functionNote.trim() || undefined,
      styles: {
        backgroundColor: '#ffffff',
        borderRadius: '4px',
        padding: '10px',
      },
    };

    onSave({
      name: name.trim(),
      description: description.trim(),
      category: category.trim() || '사용자 정의',
      component: componentData,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold">
              {mode === 'create' ? '새 컴포넌트 직접 등록' : '내 컴포넌트 설정 수정'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsJsonMode(!isJsonMode)}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded border transition ${
                isJsonMode ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-700 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{isJsonMode ? '폼 편집 모드' : 'JSON 직접 편집'}</span>
            </button>
            <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 모달 폼 본문 */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* 1. 기본 식별 정보 */}
          <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
            <div>
              <label className="font-bold text-slate-700 block mb-1">컴포넌트 이름 *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 주문 결제 박스"
                required
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">카테고리 분류</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="예: 업무, 결제, 공통"
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="font-semibold text-slate-600 block mb-1">간단 설명</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="예: 상단 헤더와 4개 상태 필터가 포함된 컨트롤"
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* 2. 세부 구조 및 기능 설정 */}
          {isJsonMode ? (
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">컴포넌트 JSON 스펙</label>
              <textarea
                value={jsonText}
                onChange={(e) => {
                  setJsonText(e.target.value);
                  setJsonError(null);
                }}
                rows={12}
                className="w-full font-mono text-[11px] p-2.5 bg-slate-950 text-emerald-400 border border-slate-800 rounded outline-none"
              />
              {jsonError && <p className="text-red-500 text-[11px]">{jsonError}</p>}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">UI 기본 형태</label>
                  <select
                    value={compType}
                    onChange={(e) => setCompType(e.target.value as ComponentType)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
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
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
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
                      className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded font-mono"
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
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded outline-none"
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
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded outline-none"
                />
              </div>

              {/* 기능 및 스펙 상세 정의 */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded">
                <label className="font-bold text-amber-900 block mb-1 flex items-center justify-between">
                  <span>💡 기능 스펙 & 개발 정의 (Function Note)</span>
                  <span className="text-[10px] text-amber-700 font-normal">어떤 기능/구조인지 기술</span>
                </label>
                <textarea
                  value={functionNote}
                  onChange={(e) => setFunctionNote(e.target.value)}
                  rows={2}
                  placeholder="예: 클릭 시 결제 API 호출 후 성공 토스트 노출 / 선택 항목에 따라 하위 패널 데이터 갱신"
                  className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded text-slate-800 outline-none text-[11px]"
                />
              </div>
            </div>
          )}

          {/* 하단 액션 버튼 */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 transition"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold transition shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{mode === 'create' ? '내 도구함에 등록' : '설정 저장'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
