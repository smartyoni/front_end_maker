import React from 'react';
import {
  Heading,
  Square,
  FormInput,
  LayoutTemplate,
  List,
  Navigation,
  Columns,
  ToggleLeft,
} from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { ComponentItem, ComponentType } from '../../types/builder';

interface PaletteItemDef {
  type: ComponentType;
  title: string;
  icon: React.ReactNode;
  category: 'layout' | 'basic' | 'content';
  defaultData: Omit<ComponentItem, 'id'>;
}

const PALETTE_ITEMS: PaletteItemDef[] = [
  {
    type: 'header',
    title: '상단 네비바',
    icon: <Heading className="w-4 h-4 text-sky-400" />,
    category: 'layout',
    defaultData: {
      type: 'header',
      name: '헤더 바',
      label: '새 헤더 타이틀',
      styles: { backgroundColor: '#0f172a', textColor: '#ffffff', padding: '16px', fontWeight: 'bold' },
    },
  },
  {
    type: 'bottomNav',
    title: '하단 탭바',
    icon: <Navigation className="w-4 h-4 text-emerald-400" />,
    category: 'layout',
    defaultData: {
      type: 'bottomNav',
      name: '바텀 내비게이션',
      items: ['홈', '검색', '내정보'],
      styles: { backgroundColor: '#0f172a', textColor: '#94a3b8', padding: '12px' },
    },
  },
  {
    type: 'tabs',
    title: '세그먼트 탭',
    icon: <Columns className="w-4 h-4 text-indigo-400" />,
    category: 'layout',
    defaultData: {
      type: 'tabs',
      name: '상단 탭',
      items: ['전체', '인기', '신규'],
      styles: { padding: '8px' },
    },
  },
  {
    type: 'button',
    title: '액션 버튼',
    icon: <Square className="w-4 h-4 text-blue-400" />,
    category: 'basic',
    defaultData: {
      type: 'button',
      name: '버튼',
      label: '클릭하세요',
      variant: 'primary',
      styles: {
        backgroundColor: '#3b82f6',
        textColor: '#ffffff',
        padding: '12px 20px',
        borderRadius: '10px',
        fullWidth: true,
      },
    },
  },
  {
    type: 'input',
    title: '텍스트 입력창',
    icon: <FormInput className="w-4 h-4 text-amber-400" />,
    category: 'basic',
    defaultData: {
      type: 'input',
      name: '입력 필드',
      label: '이메일 주소',
      placeholder: 'example@domain.com',
      styles: { padding: '10px 14px', borderRadius: '8px' },
    },
  },
  {
    type: 'card',
    title: '정보 카드',
    icon: <LayoutTemplate className="w-4 h-4 text-purple-400" />,
    category: 'content',
    defaultData: {
      type: 'card',
      name: '카드',
      label: '새 소식 카드',
      content: '여기에 카드에 표시할 상세 안내 문구를 작성해 보세요.',
      styles: {
        backgroundColor: '#1e293b',
        textColor: '#cbd5e1',
        padding: '16px',
        borderRadius: '14px',
        margin: '8px 0',
      },
    },
  },
  {
    type: 'list',
    title: '목록 리스트',
    icon: <List className="w-4 h-4 text-teal-400" />,
    category: 'content',
    defaultData: {
      type: 'list',
      name: '리스트',
      label: '메뉴 목록',
      items: ['알림 센터', '결제 수단 관리', '고객센터 문의'],
      styles: { backgroundColor: '#1e293b', padding: '8px', borderRadius: '12px' },
    },
  },
  {
    type: 'switch',
    title: '토글 스위치',
    icon: <ToggleLeft className="w-4 h-4 text-pink-400" />,
    category: 'basic',
    defaultData: {
      type: 'switch',
      name: '토글 설정',
      label: '푸시 알림 받기',
      styles: { padding: '8px 0' },
    },
  },
];

export const ComponentPalette: React.FC = () => {
  const { addComponent } = useCanvasStore();

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-4">
      <div>
        <h3 className="text-xs font-bold text-slate-500 mb-2 px-1 uppercase tracking-wider">레이아웃 & 네비게이션</h3>
        <div className="grid grid-cols-2 gap-2">
          {PALETTE_ITEMS.filter((i) => i.category === 'layout').map((item) => (
            <button
              key={item.title}
              onClick={() => addComponent(item.defaultData)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all text-slate-700 group"
            >
              <div className="p-2 rounded-lg bg-white border border-slate-200 group-hover:scale-110 shadow-sm transition-transform mb-1.5">
                {item.icon}
              </div>
              <span className="text-xs font-semibold">{item.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-slate-500 mb-2 px-1 uppercase tracking-wider">기본 UI 요소</h3>
        <div className="grid grid-cols-2 gap-2">
          {PALETTE_ITEMS.filter((i) => i.category === 'basic').map((item) => (
            <button
              key={item.title}
              onClick={() => addComponent(item.defaultData)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all text-slate-700 group"
            >
              <div className="p-2 rounded-lg bg-white border border-slate-200 group-hover:scale-110 shadow-sm transition-transform mb-1.5">
                {item.icon}
              </div>
              <span className="text-xs font-semibold">{item.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-slate-500 mb-2 px-1 uppercase tracking-wider">컨텐츠 블록</h3>
        <div className="grid grid-cols-2 gap-2">
          {PALETTE_ITEMS.filter((i) => i.category === 'content').map((item) => (
            <button
              key={item.title}
              onClick={() => addComponent(item.defaultData)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all text-slate-700 group"
            >
              <div className="p-2 rounded-lg bg-white border border-slate-200 group-hover:scale-110 shadow-sm transition-transform mb-1.5">
                {item.icon}
              </div>
              <span className="text-xs font-semibold">{item.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
