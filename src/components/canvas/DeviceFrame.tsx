import React from 'react';
import { ViewportMode } from '../../types/builder';
import { Wifi, Battery, Signal } from 'lucide-react';

interface DeviceFrameProps {
  mode: ViewportMode;
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ mode, children }) => {
  // 모드별 가로 크기 및 외형 설정
  if (mode === 'mobile') {
    return (
      <div className="relative w-[380px] h-[780px] bg-slate-950 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700/80 flex flex-col ring-1 ring-slate-800">
        {/* 모바일 상단 다이나믹 아일랜드 / 노치 */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 ml-auto mr-2" />
        </div>

        {/* 상태바 */}
        <div className="h-6 px-6 pt-1 flex items-center justify-between text-[11px] font-semibold text-slate-300 z-20 shrink-0">
          <span>9:41</span>
          <div className="flex items-center gap-1.5 opacity-80">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 앱 뷰포트 스크린 */}
        <div className="flex-1 bg-slate-900 rounded-[34px] overflow-hidden flex flex-col relative mt-1 border border-slate-800/80">
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3">{children}</div>

          {/* 모바일 하단 홈 인디케이터 바 */}
          <div className="h-4 flex items-center justify-center shrink-0">
            <div className="w-32 h-1 bg-slate-600 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'tablet') {
    return (
      <div className="relative w-[720px] h-[820px] bg-slate-950 rounded-[32px] p-3.5 shadow-2xl border-4 border-slate-700/80 flex flex-col ring-1 ring-slate-800">
        {/* 태블릿 상단 카메라 홀 */}
        <div className="h-5 flex items-center justify-center shrink-0">
          <div className="w-2 h-2 rounded-full bg-slate-800 border border-slate-700" />
        </div>

        {/* 스크린 */}
        <div className="flex-1 bg-slate-900 rounded-[24px] overflow-hidden flex flex-col border border-slate-800/80">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">{children}</div>
        </div>
      </div>
    );
  }

  // 데스크톱 / 웹 브라우저 창 모드
  return (
    <div className="relative w-[1000px] h-[820px] bg-slate-950 rounded-2xl shadow-2xl border border-slate-700/80 flex flex-col overflow-hidden ring-1 ring-slate-800">
      {/* 웹 브라우저 상단 탭 & 주소창 */}
      <div className="h-10 bg-slate-900 px-4 flex items-center gap-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>
        <div className="flex-1 max-w-sm mx-auto h-6 bg-slate-950 rounded-md border border-slate-800 px-3 flex items-center text-[11px] text-slate-400">
          https://myapp.design/preview
        </div>
      </div>

      {/* 웹 뷰포트 내부 컨텐츠 */}
      <div className="flex-1 overflow-y-auto p-8 space-y-4 bg-slate-900">{children}</div>
    </div>
  );
};
