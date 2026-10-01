import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CommonPromptItem {
  id: string;
  title: string;
  description: string;
  iconName: 'trash' | 'edit' | 'drag' | 'menu' | 'link' | 'empty' | 'style';
  promptText: string;
}

export const DEFAULT_COMMON_PROMPTS: CommonPromptItem[] = [
  {
    id: 'prompt-delete',
    title: '삭제 확인 팝오버 (근접 팝업 & Enter)',
    description: '삭제 버튼 바로 근처 미니 팝오버 노출, Enter 즉시 삭제, Escape 취소',
    iconName: 'trash',
    promptText: `[삭제 인터랙션 규격 (필수)]:
1. 브라우저 기본 confirm() 창 사용 절대 금지.
2. 삭제 버튼 클릭 시, 화면 중앙이 아닌 클릭된 삭제 버튼의 바로 근처(getBoundingClientRect 기준 4px 밀착 오프셋)에 자체 미니 확인 팝오버(Delete Confirm Popover)를 띄워 마우스 이동을 최소화할 것.
3. 팝오버가 열리자마자 내부의 [삭제] 확인 버튼에 autoFocus를 부여하여, 사용자가 마우스 클릭 없이 Enter 키를 누르면 즉시 삭제가 실행되도록 할 것.
4. Escape 키를 누르거나 팝오버 바깥 영역 클릭 시 즉시 닫힘(취소).
5. 부모 컨테이너의 overflow: hidden / overflow-y: auto로 인해 팝오버가 잘리지 않도록 React Portal 또는 최상위 레이어로 렌더링할 것.`,
  },
  {
    id: 'prompt-inline-edit',
    title: '더블클릭 인라인 텍스트 편집',
    description: '더블클릭 또는 메뉴 클릭 시 인라인 input 전환, Enter/Blur 자동 저장',
    iconName: 'edit',
    promptText: `[인라인 텍스트 편집 규격]:
1. 텍스트 항목 더블클릭 또는 우측 3점 메뉴 [수정] 클릭 시 해당 영역이 즉시 인라인 input/textarea로 전환되어 즉각적인 편집을 지원할 것.
2. Enter 키 입력 또는 포커스 아웃(onBlur) 시 변경 내용이 자동 저장되고, Escape 키 입력 시 수정이 취소될 것.
3. 수정 모드 진입 시 전체 텍스트 자동 선택(autoFocus & select)으로 빠른 수정을 유도할 것.`,
  },
  {
    id: 'prompt-drag-reorder',
    title: '행 드래그 앤 드롭 정렬 (핸들리스)',
    description: '별도 드래그 핸들 없이 행 자체를 드래그하여 상하 순서 변경',
    iconName: 'drag',
    promptText: `[드래그 앤 드롭 정렬 규격]:
1. 불필요한 드래그 핸들 아이콘을 노출하지 않고, 행(Row/Card) 자체를 마우스로 드래그(HTML5 Drag & Drop)하여 상하 순서를 자유롭게 변경할 수 있도록 할 것.
2. 드래그 중인 항목은 반투명(opacity-40) 및 점선 테두리로 시각적 피드백을 제공할 것.
3. 드롭 위치에 정확히 항목이 삽입되고, 연동된 하위 데이터가 있는 경우 탭/그룹 데이터도 유실 없이 동기화 이동할 것.`,
  },
  {
    id: 'prompt-3dot-menu',
    title: '우측 3점 메뉴 표준 (수정·삭제·취소)',
    description: '각 항목 우측 [⋮] 메뉴를 통한 일관된 수정, 삭제, 취소 액션 드롭다운',
    iconName: 'menu',
    promptText: `[3점 메뉴([⋮]) 액션 규격]:
1. [배치 위치 및 여백 최소화 (필수)]:
   * 모든 컴포넌트(헤더, 리스트, 카드, 서브아이템 등)의 부모 컨테이너 우측 패딩을 0(pr-0)으로 설정할 것.
   * 3점 메뉴([⋮]) 버튼은 ml-auto mr-0 및 최소 버튼 패딩(p-0.5)을 적용하여, 해당 라인의 가장 우측 끝에 불필요한 여백 없이 완전히 밀착 배치할 것.
2. 3점 메뉴 클릭 시 드롭다운 팝업 노출:
   * [수정]: 해당 항목의 인라인 텍스트 편집 활성화
   * [삭제]: 삭제 확인 팝오버 트리거 또는 삭제 실행
   * [취소]: 3점 메뉴 닫기
3. 메뉴 외부 클릭 시 자동으로 드롭다운이 닫히도록 바깥 클릭 감지(onClickOutside)를 구현할 것.`,
  },
  {
    id: 'prompt-smart-link',
    title: '스마트 링크 자동 감지 (URL & SMS)',
    description: 'URL 하이퍼링크 자동 변환 및 휴대폰 번호 클릭 시 SMS 문자앱 연결',
    iconName: 'link',
    promptText: `[스마트 링크 감지 규격]:
1. 일반 텍스트 내에 URL(http:// 또는 https://)이 포함된 경우 클릭 가능한 하이퍼링크(<a> 태그, target="_blank")로 자동 변환할 것.
2. 휴대폰 번호 형식(010-XXXX-XXXX 또는 010XXXXXXXX)이 감지되면 클릭 시 모바일/OS의 SMS 문자 발송 앱(sms:010XXXXXXXX)으로 연결되도록 할 것.`,
  },
  {
    id: 'prompt-empty-state',
    title: '빈 상태(Empty State) 안내 뷰',
    description: '데이터나 하위 항목이 없을 때 점선 테두리 및 추가 안내 문구 제공',
    iconName: 'empty',
    promptText: `[빈 상태(Empty State) UI 규격]:
1. 하위 항목이나 리스트 데이터가 0개일 경우, 화면을 비워두지 않고 점선 테두리(border-dashed)와 은은한 배경색의 Empty State 카드를 노출할 것.
2. "등록된 항목이 없습니다. 상단에서 항목을 추가해보세요."와 같은 직관적인 안내 문구를 제공하여 사용자의 다음 행동을 유도할 것.`,
  },
  {
    id: 'prompt-compact-style',
    title: '슬림 & 컴팩트 비즈니스 스타일',
    description: 'text-xs 기반의 정밀하고 밀도 높은 비즈니스 생산성 도구 레이아웃',
    iconName: 'style',
    promptText: `[공통 디자인 & 스타일 규격]:
1. Tailwind CSS 기반으로 불필요한 여백(padding/margin)을 최소화하고 text-xs, text-[11px] 기반의 고밀도 컴팩트 비즈니스 툴 레이아웃을 유지할 것.
2. 얇고 정갈한 테두리(border-slate-200/300)와 은은한 음영(shadow-xs)을 적용하고, 조작 가능한 버튼/카드에 부드러운 hover 트랜지션을 제공할 것.`,
  },
];

interface GlobalSettingsStore {
  activeLeftTab: 'palette' | 'settings';
  setActiveLeftTab: (tab: 'palette' | 'settings') => void;

  promptItems: CommonPromptItem[];
  selectedPromptId: string;

  selectPromptItem: (id: string) => void;
  updatePromptItem: (id: string, updates: Partial<CommonPromptItem>) => void;
  addPromptItem: (title: string, description: string, promptText: string) => void;
  deletePromptItem: (id: string) => void;
  reorderPromptItems: (sourceId: string, targetId: string) => void;
  resetToDefaults: () => void;

  getAllAssembledPrompt: () => string;
}

export const useGlobalSettingsStore = create<GlobalSettingsStore>()(
  persist(
    (set, get) => ({
      activeLeftTab: 'palette',
      setActiveLeftTab: (tab) => set({ activeLeftTab: tab }),

      promptItems: DEFAULT_COMMON_PROMPTS,
      selectedPromptId: DEFAULT_COMMON_PROMPTS[0].id,

      selectPromptItem: (id) => set({ selectedPromptId: id }),

      updatePromptItem: (id, updates) => {
        set((state) => ({
          promptItems: state.promptItems.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },

      addPromptItem: (title, description, promptText) => {
        const newItem: CommonPromptItem = {
          id: `prompt-custom-${Date.now()}`,
          title: title.trim() || '새 공통 규격',
          description: description.trim() || '사용자 정의 공통 바이브 프롬프트',
          iconName: 'style',
          promptText: promptText.trim() || '[새 공통 규격 스펙]:\n- 상세 내용을 작성하세요.',
        };
        set((state) => ({
          promptItems: [...state.promptItems, newItem],
          selectedPromptId: newItem.id,
        }));
      },

      deletePromptItem: (id) => {
        const remaining = get().promptItems.filter((item) => item.id !== id);
        if (remaining.length === 0) return;
        set({
          promptItems: remaining,
          selectedPromptId: remaining[0].id,
        });
      },

      reorderPromptItems: (sourceId, targetId) => {
        if (sourceId === targetId) return;
        const current = [...get().promptItems];
        const sourceIndex = current.findIndex((item) => item.id === sourceId);
        const targetIndex = current.findIndex((item) => item.id === targetId);
        if (sourceIndex === -1 || targetIndex === -1) return;

        const [moved] = current.splice(sourceIndex, 1);
        current.splice(targetIndex, 0, moved);
        set({ promptItems: current });
      },

      resetToDefaults: () => {
        set({
          promptItems: DEFAULT_COMMON_PROMPTS,
          selectedPromptId: DEFAULT_COMMON_PROMPTS[0].id,
        });
      },

      getAllAssembledPrompt: () => {
        const { promptItems } = get();
        const header = [
          '# 프로젝트 공통 바이브코딩 UI/UX 가이드라인 (Global Guidelines)',
          '이 프로젝트의 모든 컴포넌트 구현 시 반드시 아래 공통 인터랙션 규격을 준수하세요.\n',
        ].join('\n');

        const body = promptItems
          .map((item, idx) => `## ${idx + 1}. ${item.title}\n${item.promptText}`)
          .join('\n\n');

        return `${header}\n\n${body}`;
      },
    }),
    {
      name: 'global-common-prompts-manager-v4',
    }
  )
);
