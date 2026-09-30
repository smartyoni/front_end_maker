import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GlobalUxSettings {
  // 1. 삭제 인터랙션 설정
  deleteConfirmStyle: 'nearPopover' | 'modal' | 'none';
  deleteEnterKeyConfirm: boolean;

  // 2. 편집 & 인터랙션 설정
  inlineEditTrigger: 'doubleClick' | 'menuOnly';
  autoLinkDetect: boolean;
  dragAndDropReorder: boolean;

  // 3. 사용자 정의 추가 공통 프롬프트
  customGlobalPrompt: string;
}

interface GlobalSettingsStore {
  activeLeftTab: 'palette' | 'settings';
  setActiveLeftTab: (tab: 'palette' | 'settings') => void;
  settings: GlobalUxSettings;
  updateSettings: (updates: Partial<GlobalUxSettings>) => void;
  resetSettings: () => void;
  getGeneratedGlobalPrompt: () => string;
}

export const DEFAULT_GLOBAL_SETTINGS: GlobalUxSettings = {
  deleteConfirmStyle: 'nearPopover',
  deleteEnterKeyConfirm: true,
  inlineEditTrigger: 'doubleClick',
  autoLinkDetect: true,
  dragAndDropReorder: true,
  customGlobalPrompt: '',
};

export const generateGlobalPromptText = (settings: GlobalUxSettings): string => {
  const sections: string[] = [
    '# 프로젝트 공통 바이브코딩 UI/UX 가이드라인 (Global Guidelines)',
    '이 프로젝트의 모든 컴포넌트 구현 시 반드시 아래 공통 인터랙션 규격을 준수하세요.',
  ];

  // 1. 삭제 인터랙션
  if (settings.deleteConfirmStyle === 'nearPopover') {
    sections.push(`
## 1. 삭제 인터랙션 규격 (필수)
- 브라우저 기본 confirm() 창 사용 절대 금지.
- 삭제 버튼 클릭 시, 화면 중앙이 아닌 **클릭된 삭제 버튼 바로 근처(getBoundingClientRect 기준 4px 밀착 팝업)**에 자체 미니 확인 팝오버(Delete Confirm Popover)를 띄워 마우스 이동을 최소화할 것.
${settings.deleteEnterKeyConfirm ? '- 팝오버 열림 즉시 [삭제] 버튼에 autoFocus를 부여하여, **마우스 클릭 없이 `Enter` 키 입력만으로 즉시 삭제가 실행**되도록 할 것.' : ''}
- Escape 키를 누르거나 팝오버 바깥 클릭 시 즉시 닫힘(취소).
- 부모 컨테이너(overflow: hidden/auto)에 잘리지 않도록 React Portal 또는 최상위 레이어 팝업으로 렌더링할 것.`);
  } else if (settings.deleteConfirmStyle === 'modal') {
    sections.push(`
## 1. 삭제 인터랙션 규격 (필수)
- 삭제 실행 전 중앙 확인 모달 팝업 노출.
${settings.deleteEnterKeyConfirm ? '- 모달 열림 즉시 Enter 키로 삭제 실행 가능.' : ''}
- Escape 키로 취소.`);
  } else {
    sections.push(`
## 1. 삭제 인터랙션 규격
- 별도 확인 팝업 없이 즉시 삭제 실행.`);
  }

  // 2. 편집 & 인터랙션
  sections.push(`
## 2. 인라인 편집 및 데이터 조작 규격
${settings.inlineEditTrigger === 'doubleClick' ? '- **텍스트 수정**: 항목 더블클릭 또는 우측 3점 메뉴 [수정] 클릭 시 인라인 input/textarea 활성화 (Enter 저장 / Escape 취소).' : '- **텍스트 수정**: 항목 우측 3점 메뉴 [수정]을 통해서만 인라인 편집 진입.'}
${settings.dragAndDropReorder ? '- **드래그 앤 드롭 정렬**: 마우스로 행 자체를 드래그(HTML5 Drag & Drop)하여 상하 순서를 자유롭게 변경할 수 있어야 함.' : ''}
${settings.autoLinkDetect ? '- **스마트 링크 자동 감지**: 텍스트 내 URL(http/https)은 하이퍼링크로 자동 변환하고, 휴대폰 번호(010 등)는 클릭 시 SMS 문자앱(sms:)으로 연결할 것.' : ''}`);

  // 3. 사용자 정의 추가 규칙
  if (settings.customGlobalPrompt.trim()) {
    sections.push(`
## 3. 프로젝트 추가 특별 규격
${settings.customGlobalPrompt.trim()}`);
  }

  return sections.join('\n');
};

export const useGlobalSettingsStore = create<GlobalSettingsStore>()(
  persist(
    (set, get) => ({
      activeLeftTab: 'palette',
      setActiveLeftTab: (tab) => set({ activeLeftTab: tab }),

      settings: DEFAULT_GLOBAL_SETTINGS,

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },

      resetSettings: () => {
        set({ settings: DEFAULT_GLOBAL_SETTINGS });
      },

      getGeneratedGlobalPrompt: () => {
        return generateGlobalPromptText(get().settings);
      },
    }),
    {
      name: 'global-vibe-ux-settings',
    }
  )
);
