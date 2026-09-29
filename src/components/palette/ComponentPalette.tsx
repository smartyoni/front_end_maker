import React from 'react';
import {
  Heading,
  Square,
  FormInput,
  LayoutTemplate,
  List,
  Columns,
  ToggleLeft,
  CheckSquare,
  Tag,
  FolderTree,
  FileText,
  Search,
} from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { ComponentItem, ComponentType } from '../../types/builder';

interface PaletteItemDef {
  type: ComponentType;
  title: string;
  icon: React.ReactNode;
  category: 'productivity' | 'general';
  defaultData: Omit<ComponentItem, 'id'>;
}

const PALETTE_ITEMS: PaletteItemDef[] = [
  // 업무 및 생산성 전용 블록 (공유해주신 디자인 기반)
  {
    type: 'colorBlock',
    title: '보라색 메모 블록',
    icon: <FileText className="w-4 h-4 text-purple-600" />,
    category: 'productivity',
    defaultData: {
      type: 'colorBlock',
      name: '안내문 메모 블록',
      label: '안내문 [확인 사항]',
      headerColor: '#9333ea',
      content: '1. 첫 번째 확인 사항\n2. 두 번째 상세 내용\n3. 세 번째 메모 내용',
      styles: { backgroundColor: '#ffffff', borderRadius: '0px', padding: '0px' },
    },
  },
  {
    type: 'checklist',
    title: '체크리스트 블록',
    icon: <CheckSquare className="w-4 h-4 text-emerald-600" />,
    category: 'productivity',
    defaultData: {
      type: 'checklist',
      name: '체크리스트 블록',
      label: '체크리스트',
      headerColor: '#16a34a',
      items: ['체크 1', '체크 2', '체크 3'],
      styles: { backgroundColor: '#ffffff', borderRadius: '0px', padding: '0px' },
    },
  },
  {
    type: 'chipGroup',
    title: '바로가기 칩 메뉴',
    icon: <Tag className="w-4 h-4 text-amber-600" />,
    category: 'productivity',
    defaultData: {
      type: 'chipGroup',
      name: '바로가기 칩 모음',
      columns: 4,
      rows: 2,
      items: ['1', '2', '3', '4', '5', '6', '7', '8'],
      styles: { padding: '0px', borderRadius: '0px' },
    },
  },
  {
    type: 'categoryList',
    title: '카테고리 트리 목록',
    icon: <FolderTree className="w-4 h-4 text-blue-600" />,
    category: 'productivity',
    defaultData: {
      type: 'categoryList',
      name: '카테고리 목록',
      label: '카테고리 (3)',
      items: ['카테고리 1', '카테고리 2', '카테고리 3'],
      styles: { backgroundColor: '#ffffff', padding: '0px', borderRadius: '0px' },
    },
  },
  {
    type: 'quickInput',
    title: '체크리스트 퀵 추가바',
    icon: <Search className="w-4 h-4 text-sky-600" />,
    category: 'productivity',
    defaultData: {
      type: 'quickInput',
      name: '인라인 추가바',
      placeholder: '새 항목 입력...',
      label: '+ 추가',
      styles: { padding: '0px', borderRadius: '0px' },
    },
  },

  // 기본 UI 및 레이아웃 요소
  {
    type: 'header',
    title: '상단 네비/타이틀',
    icon: <Heading className="w-4 h-4 text-slate-700" />,
    category: 'general',
    defaultData: {
      type: 'header',
      name: '패널 타이틀',
      label: '패널 타이틀',
      styles: { backgroundColor: '#ffffff', textColor: '#0f172a', padding: '8px', fontWeight: 'bold', borderRadius: '0px' },
    },
  },
  {
    type: 'button',
    title: '액션 버튼',
    icon: <Square className="w-4 h-4 text-blue-600" />,
    category: 'general',
    defaultData: {
      type: 'button',
      name: '버튼',
      label: '실행 버튼',
      variant: 'primary',
      styles: { backgroundColor: '#2563eb', textColor: '#ffffff', padding: '8px 12px', borderRadius: '0px', fullWidth: true },
    },
  },
  {
    type: 'input',
    title: '텍스트 입력창',
    icon: <FormInput className="w-4 h-4 text-slate-700" />,
    category: 'general',
    defaultData: {
      type: 'input',
      name: '입력 필드',
      label: '항목명',
      placeholder: '내용을 입력하세요...',
      styles: { padding: '6px 8px', borderRadius: '0px' },
    },
  },
  {
    type: 'card',
    title: '안내 카드',
    icon: <LayoutTemplate className="w-4 h-4 text-purple-600" />,
    category: 'general',
    defaultData: {
      type: 'card',
      name: '카드',
      label: '안내 카드',
      content: '카드 세부 내용입니다.',
      styles: { backgroundColor: '#ffffff', padding: '8px', borderRadius: '0px' },
    },
  },
  {
    type: 'tabs',
    title: '세그먼트 탭',
    icon: <Columns className="w-4 h-4 text-indigo-600" />,
    category: 'general',
    defaultData: {
      type: 'tabs',
      name: '탭 메뉴',
      items: ['탭 1', '탭 2', '탭 3'],
      styles: { padding: '0px', borderRadius: '0px' },
    },
  },
  {
    type: 'list',
    title: '데이터 리스트',
    icon: <List className="w-4 h-4 text-teal-600" />,
    category: 'general',
    defaultData: {
      type: 'list',
      name: '아이템 목록',
      items: ['항목 1', '항목 2', '항목 3'],
      styles: { backgroundColor: '#ffffff', padding: '0px', borderRadius: '0px' },
    },
  },
  {
    type: 'switch',
    title: '토글 스위치',
    icon: <ToggleLeft className="w-4 h-4 text-pink-600" />,
    category: 'general',
    defaultData: {
      type: 'switch',
      name: '설정 스위치',
      label: '알림 받기',
      styles: { padding: '6px 0' },
    },
  },
];

export const ComponentPalette: React.FC = () => {
  const { addComponent, screens, activeScreenId, selectedPanelId } = useCanvasStore();

  const currentScreen = screens.find((s) => s.id === activeScreenId);
  const targetPanel = currentScreen?.panels.find((p) => p.id === selectedPanelId) || currentScreen?.panels[0];

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-4">
      {/* 타겟 패널 안내 배너 */}
      <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 shadow-xs">
        <span className="font-semibold block text-[11px] text-blue-700 uppercase tracking-wider mb-0.5">부착 대상 패널</span>
        <span className="font-bold truncate block">📍 {targetPanel?.title || '선택된 패널 없음'}</span>
      </div>

      <div>
        <h3 className="text-xs font-bold text-slate-600 mb-2 px-1 uppercase tracking-wider">업무 & 메모 전용 블록</h3>
        <div className="grid grid-cols-2 gap-2">
          {PALETTE_ITEMS.filter((i) => i.category === 'productivity').map((item) => (
            <button
              key={item.title}
              onClick={() => addComponent(item.defaultData)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-slate-800 group"
            >
              <div className="p-2 rounded-lg bg-white border border-slate-200 group-hover:scale-110 shadow-xs transition-transform mb-1.5">
                {item.icon}
              </div>
              <span className="text-xs font-semibold text-center leading-tight">{item.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-slate-600 mb-2 px-1 uppercase tracking-wider">기본 UI & 레이아웃</h3>
        <div className="grid grid-cols-2 gap-2">
          {PALETTE_ITEMS.filter((i) => i.category === 'general').map((item) => (
            <button
              key={item.title}
              onClick={() => addComponent(item.defaultData)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-slate-800 group"
            >
              <div className="p-2 rounded-lg bg-white border border-slate-200 group-hover:scale-110 shadow-xs transition-transform mb-1.5">
                {item.icon}
              </div>
              <span className="text-xs font-semibold text-center leading-tight">{item.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
