import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CustomComponentPreset, ComponentItem } from '../types/builder';

export interface CustomComponentStore {
  customPresets: CustomComponentPreset[];
  addPreset: (preset: {
    name: string;
    description?: string;
    category?: string;
    component: Omit<ComponentItem, 'id'>;
  }) => CustomComponentPreset;
  updatePreset: (id: string, updates: Partial<Omit<CustomComponentPreset, 'id' | 'createdAt'>>) => void;
  deletePreset: (id: string) => void;
  importPresets: (presets: CustomComponentPreset[]) => void;
  resetToDefaults: () => void;
}

const DEFAULT_CUSTOM_PRESETS: CustomComponentPreset[] = [
  {
    id: 'preset-sample-1',
    name: '업무 알림 메모 박스',
    description: '상단 보라색 바와 불릿 리스트가 있는 메모 블록',
    category: '메모·업무',
    component: {
      type: 'colorBlock',
      name: '업무 체크 메모',
      label: '주간 주요 점검 사항',
      headerColor: '#8b5cf6',
      content: '1. 신규 컴포넌트 규격 검토\n2. 사용자 피드백 반영 및 배포\n3. 인스펙터 연동 테스트',
      functionNote: '사용자가 자유롭게 메모를 남기고 화면 설계 의도를 공유하는 블록',
      styles: { backgroundColor: '#ffffff', borderRadius: '4px', padding: '12px' },
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'preset-sample-2',
    name: '빠른 필터 칩 그리드 (4열)',
    description: '상태별 필터 선택이 가능한 4열 버튼 그리드',
    category: '네비·메뉴',
    component: {
      type: 'chipGroup',
      name: '상태 필터 그리드',
      label: '진행 상태 선택',
      columns: 4,
      items: ['전체', '대기중', '진행중', '완료'],
      functionNote: '클릭 시 해당 상태의 데이터만 그리드에 필터링하여 노출하는 네비게이션 컨트롤',
      styles: { backgroundColor: '#f8fafc', borderRadius: '6px', padding: '8px' },
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export const useCustomComponentStore = create<CustomComponentStore>()(
  persist(
    (set) => ({
      customPresets: DEFAULT_CUSTOM_PRESETS,

      addPreset: ({ name, description = '', category = '사용자 정의', component }) => {
        const newPreset: CustomComponentPreset = {
          id: `preset-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name,
          description,
          category: category.trim() || '사용자 정의',
          component: JSON.parse(JSON.stringify(component)),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({
          customPresets: [newPreset, ...state.customPresets],
        }));
        return newPreset;
      },

      updatePreset: (id, updates) => {
        set((state) => ({
          customPresets: state.customPresets.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...updates,
                  component: updates.component ? JSON.parse(JSON.stringify(updates.component)) : p.component,
                  updatedAt: Date.now(),
                }
              : p
          ),
        }));
      },

      deletePreset: (id) => {
        set((state) => ({
          customPresets: state.customPresets.filter((p) => p.id !== id),
        }));
      },

      importPresets: (incoming) => {
        if (!Array.isArray(incoming)) return;
        const valid = incoming.filter((p) => p && p.name && p.component && p.component.type);
        set((state) => {
          const existingIds = new Set(state.customPresets.map((p) => p.id));
          const newOnes = valid.map((p) => ({
            ...p,
            id: existingIds.has(p.id) ? `preset-${Date.now()}-${Math.random().toString(36).substring(2, 6)}` : p.id,
            createdAt: p.createdAt || Date.now(),
            updatedAt: Date.now(),
          }));
          return { customPresets: [...newOnes, ...state.customPresets] };
        });
      },

      resetToDefaults: () => {
        set({ customPresets: DEFAULT_CUSTOM_PRESETS });
      },
    }),
    {
      name: 'smart-yoni-custom-components-storage',
    }
  )
);
