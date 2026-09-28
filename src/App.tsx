import { useState } from 'react';
import { TopBar } from './components/layout/TopBar';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { CanvasArea } from './components/canvas/CanvasArea';
import { RightSidebar } from './components/layout/RightSidebar';
import { CodeExportModal } from './components/layout/CodeExportModal';

export function App() {
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-800">
      {/* 상단 툴바 */}
      <TopBar onOpenExport={() => setIsExportOpen(true)} />

      {/* 3단 워크스페이스 레이아웃 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 좌측: 컴포넌트 도구함 & 레이어 트리 */}
        <LeftSidebar />

        {/* 중앙: 인터랙티브 캔버스 뷰포트 */}
        <CanvasArea />

        {/* 우측: 속성 & 액션 인스펙터 */}
        <RightSidebar />
      </div>

      {/* 코드 내보내기 모달 */}
      <CodeExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
}

export default App;
