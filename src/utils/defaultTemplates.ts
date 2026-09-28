import { Screen } from '../types/builder';

export const INITIAL_SCREENS: Screen[] = [
  {
    id: 'screen-home',
    name: '홈 (Home)',
    components: [
      {
        id: 'comp-header-1',
        type: 'header',
        name: '상단 네비게이션 바',
        label: 'My Awesome App',
        variant: 'primary',
        styles: {
          backgroundColor: '#0f172a',
          textColor: '#f8fafc',
          padding: '16px',
          fontWeight: 'bold',
          fontSize: '18px',
        },
      },
      {
        id: 'comp-card-1',
        type: 'card',
        name: '프로모션 배너 카드',
        label: '지금 가입하고 웰컴 혜택 받기 🎉',
        content: '웹과 모바일에서 모두 완벽하게 작동하는 모던 UI를 손쉽게 배치하세요.',
        styles: {
          backgroundColor: '#1e293b',
          textColor: '#e2e8f0',
          padding: '20px',
          borderRadius: '16px',
          margin: '16px 0',
        },
      },
      {
        id: 'comp-button-1',
        type: 'button',
        name: '상세보기 버튼',
        label: '상세 화면으로 이동',
        variant: 'primary',
        action: {
          type: 'navigate',
          targetScreenId: 'screen-detail',
        },
        styles: {
          backgroundColor: '#3b82f6',
          textColor: '#ffffff',
          padding: '12px 20px',
          borderRadius: '10px',
          fullWidth: true,
          fontWeight: '600',
        },
      },
      {
        id: 'comp-list-1',
        type: 'list',
        name: '최근 활동 목록',
        label: '최근 활동',
        items: ['알림 설정 완료', '신규 프로필 등록', '보안 인증 완료'],
        styles: {
          backgroundColor: '#1e293b',
          textColor: '#cbd5e1',
          padding: '12px',
          borderRadius: '12px',
          margin: '12px 0',
        },
      },
      {
        id: 'comp-bottom-1',
        type: 'bottomNav',
        name: '하단 탭바',
        items: ['홈', '검색', '피드', '마이페이지'],
        styles: {
          backgroundColor: '#0f172a',
          textColor: '#94a3b8',
          padding: '12px',
        },
      },
    ],
  },
  {
    id: 'screen-detail',
    name: '상세 페이지 (Detail)',
    components: [
      {
        id: 'comp-header-2',
        type: 'header',
        name: '상세 화면 헤더',
        label: '상세 정보',
        styles: {
          backgroundColor: '#0f172a',
          textColor: '#f8fafc',
          padding: '16px',
          fontWeight: 'bold',
          fontSize: '18px',
        },
      },
      {
        id: 'comp-card-2',
        type: 'card',
        name: '상세 설명 카드',
        label: '인터랙션 연동 완료!',
        content: '홈 화면 버튼 클릭 시 이 화면으로 즉시 전환되도록 설정되어 있습니다.',
        styles: {
          backgroundColor: '#1e293b',
          textColor: '#e2e8f0',
          padding: '20px',
          borderRadius: '16px',
          margin: '16px 0',
        },
      },
      {
        id: 'comp-btn-back',
        type: 'button',
        name: '뒤로가기 버튼',
        label: '홈으로 돌아가기',
        variant: 'secondary',
        action: {
          type: 'navigate',
          targetScreenId: 'screen-home',
        },
        styles: {
          backgroundColor: '#334155',
          textColor: '#ffffff',
          padding: '12px 20px',
          borderRadius: '10px',
          fullWidth: true,
        },
      },
    ],
  },
];
