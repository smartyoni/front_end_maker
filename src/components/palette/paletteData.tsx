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
  Compass,
} from 'lucide-react';
import { ComponentItem, ComponentType } from '../../types/builder';

export type PaletteCategory = 'all' | 'memo' | 'nav' | 'action' | 'data';

export interface PaletteCategoryMeta {
  id: PaletteCategory;
  name: string;
}

export const PALETTE_CATEGORIES: PaletteCategoryMeta[] = [
  { id: 'all', name: '전체' },
  { id: 'memo', name: '메모·업무' },
  { id: 'nav', name: '네비·메뉴' },
  { id: 'action', name: '입력·액션' },
  { id: 'data', name: '데이터·카드' },
];

export interface PaletteItemDef {
  type: ComponentType;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'memo' | 'nav' | 'action' | 'data';
  defaultData: Omit<ComponentItem, 'id'>;
}

export const PALETTE_ITEMS: PaletteItemDef[] = [
  // 1. 메모 & 업무 블록 (Work & Note)
  {
    type: 'textGroup',
    title: '텍스트박스 그룹',
    description: '헤더와 드래그 가능한 텍스트박스 묶음',
    icon: <FileText className="w-4 h-4 text-emerald-600" />,
    category: 'memo',
    defaultData: {
      type: 'textGroup',
      name: '텍스트박스 그룹',
      label: '텍스트 그룹',
      headerColor: '#5ea578',
      items: [''],
      styles: { backgroundColor: '#ffffff', borderRadius: '0px', padding: '0px' },
    },
  },
  {
    type: 'checklist',
    title: '체크리스트 그룹',
    description: '헤더와 드래그 가능한 체크박스 묶음',
    icon: <CheckSquare className="w-4 h-4 text-emerald-600" />,
    category: 'memo',
    defaultData: {
      type: 'checklist',
      name: '체크리스트 그룹',
      label: '체크리스트',
      headerColor: '#5ea578',
      items: [''],
      checkedItems: [false],
      styles: { backgroundColor: '#ffffff', borderRadius: '0px', padding: '0px' },
    },
  },
  {
    type: 'categoryList',
    title: '카테고리 트리',
    description: '계층형 카테고리 목록',
    icon: <FolderTree className="w-4 h-4 text-blue-600" />,
    category: 'memo',
    defaultData: {
      type: 'categoryList',
      name: '카테고리 목록',
      label: '카테고리 (3)',
      items: ['카테고리 1', '카테고리 2', '카테고리 3'],
      styles: { backgroundColor: '#ffffff', padding: '0px', borderRadius: '0px' },
    },
  },

  // 2. 네비 & 바로가기 메뉴 (Nav & Menu)
  {
    type: 'chipGroup',
    title: '네비게이션 탭',
    description: '최상위 카테고리 탭 및 하위 항목 관리',
    icon: <Tag className="w-4 h-4 text-blue-600" />,
    category: 'nav',
    defaultData: {
      type: 'chipGroup',
      name: '네비게이션 탭',
      label: '네비게이션 탭',
      columns: 4,
      rows: 2,
      activeTabIndex: 0,
      items: ['전체', '업무', '개인', '프로젝트', '아이디어', '공부', '취미', '보관함'],
      subItems: {
        '0': ['전체 공지사항 확인', '중요 일정 체크'],
        '1': ['프로젝트 기획서 초안', '회의록 정리'],
      },
      styles: { padding: '0px', borderRadius: '0px' },
    },
  },
  {
    type: 'header',
    title: '헤더/프로필 바',
    description: '패널 상단 제목 및 사용자 정보',
    icon: <Heading className="w-4 h-4 text-slate-700" />,
    category: 'nav',
    defaultData: {
      type: 'header',
      name: '패널 타이틀',
      label: '패널 타이틀',
      styles: { backgroundColor: '#ffffff', textColor: '#0f172a', padding: '8px', fontWeight: 'bold', borderRadius: '0px' },
    },
  },
  {
    type: 'tabs',
    title: '세그먼트 탭',
    description: '화면 전환 탭 버튼 그룹',
    icon: <Columns className="w-4 h-4 text-indigo-600" />,
    category: 'nav',
    defaultData: {
      type: 'tabs',
      name: '탭 메뉴',
      items: ['탭 1', '탭 2', '탭 3'],
      styles: { padding: '0px', borderRadius: '0px' },
    },
  },
  {
    type: 'bottomNav',
    title: '하단 네비게이션',
    description: '모바일/앱 하단 고정 탭바',
    icon: <Compass className="w-4 h-4 text-cyan-600" />,
    category: 'nav',
    defaultData: {
      type: 'bottomNav',
      name: '하단 메뉴바',
      items: ['홈', '검색', '설정'],
      styles: { padding: '0px', borderRadius: '0px' },
    },
  },

  // 3. 입력 & 액션 (Input & Action)
  {
    type: 'quickInput',
    title: '인라인 빠른 추가바',
    description: '인풋 + 추가 버튼 한 줄 구성',
    icon: <Search className="w-4 h-4 text-sky-600" />,
    category: 'action',
    defaultData: {
      type: 'quickInput',
      name: '인라인 추가바',
      label: '+ 추가',
      styles: { padding: '0px', borderRadius: '0px' },
    },
  },
  {
    type: 'button',
    title: '액션 버튼',
    description: '클릭 인터랙션 전용 버튼',
    icon: <Square className="w-4 h-4 text-blue-600" />,
    category: 'action',
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
    description: '단일 텍스트/숫자 필드',
    icon: <FormInput className="w-4 h-4 text-slate-700" />,
    category: 'action',
    defaultData: {
      type: 'input',
      name: '입력 필드',
      label: '항목명',
      styles: { padding: '6px 8px', borderRadius: '0px' },
    },
  },
  {
    type: 'switch',
    title: '토글 스위치',
    description: 'On/Off 설정 스위치',
    icon: <ToggleLeft className="w-4 h-4 text-pink-600" />,
    category: 'action',
    defaultData: {
      type: 'switch',
      name: '설정 스위치',
      label: '설정 스위치',
      styles: { padding: '6px 0' },
    },
  },

  // 4. 데이터 & 카드 (Data & View)
  {
    type: 'list',
    title: '데이터 리스트',
    description: '행 단위 데이터 목록 표시',
    icon: <List className="w-4 h-4 text-teal-600" />,
    category: 'data',
    defaultData: {
      type: 'list',
      name: '아이템 목록',
      items: ['항목 1', '항목 2', '항목 3'],
      styles: { backgroundColor: '#ffffff', padding: '0px', borderRadius: '0px' },
    },
  },
  {
    type: 'card',
    title: '안내 카드',
    description: '상세 정보 컨테이너 블록',
    icon: <LayoutTemplate className="w-4 h-4 text-purple-600" />,
    category: 'data',
    defaultData: {
      type: 'card',
      name: '카드',
      label: '안내 카드',
      content: '카드 세부 내용입니다.',
      styles: { backgroundColor: '#ffffff', padding: '8px', borderRadius: '0px' },
    },
  },
];
