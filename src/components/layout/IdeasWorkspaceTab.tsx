import React from 'react';
import { Sparkles, LayoutGrid, BookmarkCheck, Palette } from 'lucide-react';

export const IdeasWorkspaceTab: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 text-slate-700">
      <div className="p-3 bg-indigo-50/60 border border-indigo-200 text-xs rounded-none space-y-1.5">
        <div className="flex items-center gap-1.5 text-indigo-700 font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>새로운 도구 구상함</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          레이어 트리를 대체할 새로운 기능을 구상하기 위한 준비 공간입니다.
        </p>
      </div>

      <div className="space-y-2">
        <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">추천 후보 아이디어</h4>
        
        <div className="space-y-1.5">
          <div className="p-2.5 bg-slate-50 border border-slate-200 hover:bg-white transition text-xs space-y-0.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <LayoutGrid className="w-3.5 h-3.5 text-blue-600" />
              <span>완성형 화면 템플릿</span>
            </div>
            <p className="text-[11px] text-slate-500">
              로그인, 계약서 대시보드 등 원클릭 전체 패널 프리셋
            </p>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 hover:bg-white transition text-xs space-y-0.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>내 컴포넌트 프리셋 보관함</span>
            </div>
            <p className="text-[11px] text-slate-500">
              자주 쓰는 컬러/텍스트/바로가기 조합을 저장해두고 재사용
            </p>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 hover:bg-white transition text-xs space-y-0.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Palette className="w-3.5 h-3.5 text-purple-600" />
              <span>전역 컬러/테마 관리자</span>
            </div>
            <p className="text-[11px] text-slate-500">
              앱 전체의 메인 보라색, 초록색, 회색 톤을 한 번에 일괄 변경
            </p>
          </div>
        </div>
      </div>

      <div className="p-2.5 bg-amber-50/60 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
        💡 이 탭에 넣고 싶은 구상이 정리되면 언제든 말씀해주세요! 바로 구현해 드립니다.
      </div>
    </div>
  );
};
