import { Screen } from '../types/builder';

export const INITIAL_SCREENS: Screen[] = [
  {
    id: 'screen-app',
    name: '업무 메모 대시보드',
    panels: [
      {
        id: 'panel-nav',
        title: '좌측 사이드바',
        width: '260px',
        components: [
          {
            id: 'comp-profile',
            type: 'header',
            name: '사용자 프로필 바',
            label: '관리자 (admin@site.com)',
            styles: {
              backgroundColor: '#f8fafc',
              textColor: '#0f172a',
              padding: '12px 14px',
              fontSize: '13px',
              fontWeight: '600',
              borderRadius: '8px',
            },
          },
          {
            id: 'comp-chips',
            type: 'chipGroup',
            name: '바로가기 메뉴 칩',
            columns: 4,
            items: ['일정관리', '블로그', '인쇄판', '굿뷰', '계약', '계약자료', '광고', '매출장', '고객'],
            styles: {
              padding: '10px 4px',
            },
          },
          {
            id: 'comp-cats',
            type: 'categoryList',
            name: '카테고리 트리',
            label: '카테고리 (15)',
            items: [
              '계약진행현황 [4]',
              '계약서작성예정호실 [0]',
              '미완료 업무 남은호실 [1]',
              '잔금예정 호실 [0]',
              '완료된 계약 보관함 [0]',
              '가계약 [0]',
              '계약서작성 [5]',
              '잔금 [1]',
            ],
            styles: {
              backgroundColor: '#ffffff',
              padding: '10px',
              borderRadius: '10px',
            },
          },
        ],
      },
      {
        id: 'panel-list',
        title: '중간 서브 목록',
        width: '320px',
        components: [
          {
            id: 'comp-sub-head',
            type: 'header',
            name: '목록 타이틀',
            label: '20.계약서작성 (4)',
            styles: {
              backgroundColor: '#ffffff',
              textColor: '#0f172a',
              padding: '12px 14px',
              fontSize: '14px',
              fontWeight: 'bold',
              borderRadius: '8px',
            },
          },
          {
            id: 'comp-quick-add',
            type: 'quickInput',
            name: '체크리스트 추가바',
            placeholder: '새 체크리스트 항목 입력... (Ctrl+Enter)',
            label: '+ 항목 추가',
            styles: {
              padding: '8px 0',
            },
          },
          {
            id: 'comp-items',
            type: 'list',
            name: '서브 항목 리스트',
            items: [
              '계약서작성 후 안내문',
              '계약서작성_준비사항',
              '계약서작성시 주의사항',
              '계약서 확인일 사입',
            ],
            styles: {
              backgroundColor: '#ffffff',
              padding: '8px',
              borderRadius: '8px',
            },
          },
        ],
      },
      {
        id: 'panel-detail',
        title: '우측 상세 워크스페이스',
        width: 'flex-1',
        components: [
          {
            id: 'comp-detail-title',
            type: 'header',
            name: '문서 제목 & 툴바',
            label: '계약서작성 후 안내문',
            styles: {
              backgroundColor: '#ffffff',
              textColor: '#0f172a',
              padding: '14px 16px',
              fontSize: '18px',
              fontWeight: 'bold',
              borderRadius: '10px',
            },
          },
          {
            id: 'comp-memo-block',
            type: 'colorBlock',
            name: '보라색 안내문 메모 블록',
            label: '기본 내용 [계약서작성 후 확인]',
            headerColor: '#9333ea', // 보라색
            content:
              '• 확정일자/주택임대차신고하기: 가양1동 주민센터 (계약서 작성 후 바로 하실수 있습니다)\n• 지방세 체납내역, 국세일자무미현황/전입세대확인 가능\n• 잔금일 전 입주지원센터에 입주증 발급 신청하기\n• 관리실에서 입주자가이드 작성',
            styles: {
              backgroundColor: '#ffffff',
              borderRadius: '8px',
            },
          },
          {
            id: 'comp-check-block',
            type: 'checklist',
            name: '초록색 체크리스트 블록',
            label: '체크리스트 (항목별 확인)',
            headerColor: '#16a34a', // 초록색
            items: ['신분증 및 계약서 원본 지참', '중도금 대출 승계 신청서 제출', '선수관리비 납부 영수증 확인'],
            styles: {
              backgroundColor: '#ffffff',
              borderRadius: '12px',
            },
          },
        ],
      },
    ],
  },
];
