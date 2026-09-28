import React from 'react';
import { Smartphone, Tablet, Monitor, Play, EyeOff, Code, Plus, Trash2, Undo2, Redo2 } from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';

interface TopBarProps {
  onOpenExport: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenExport }) => {
  const {
    screens,
    activeScreenId,
    setActiveScreen,
    addScreen,
    deleteScreen,
    viewportMode,
    setViewportMode,
    isPreviewMode,
    togglePreviewMode,
    undo,
    redo,
    history,
    future,
  } = useCanvasStore();

  const handleAddScreen = () => {
    const name = prompt('새 화면 이름을 입력하세요:', `화면 ${screens.length + 1}`);
    if (name && name.trim()) {
      addScreen(name.trim());
    }
  };

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-20 shrink-0">
      {/* 로고 & 화면 탭 */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
            UI
          </div>
          <span className="font-bold text-sm tracking-wide bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent hidden sm:inline">
            AppCanvas
          </span>
        </div>

        <div className="h-5 w-px bg-slate-800" />

        {/* 화면 탭 목록 */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-md py-1">
          {screens.map((screen) => {
            const isActive = screen.id === activeScreenId;
            return (
              <div
                key={screen.id}
                className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
                onClick={() => setActiveScreen(screen.id)}
              >
                <span>{screen.name}</span>
                {screens.length > 1 && (
                  <button
                    className="opacity-0 group-hover:opacity-100 hover:text-red-300 transition-opacity ml-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`'${screen.name}' 화면을 삭제하시겠습니까?`)) {
                        deleteScreen(screen.id);
                      }
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          <button
            onClick={handleAddScreen}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-dashed border-slate-700 hover:border-slate-500"
            title="새 화면 추가"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden md:inline">화면 추가</span>
          </button>
        </div>
      </div>

      {/* 중앙: 뷰포트 전환 & Undo/Redo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60">
          <button
            onClick={() => setViewportMode('mobile')}
            className={`p-1.5 rounded-md transition-colors ${
              viewportMode === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="모바일 뷰 (375px)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewportMode('tablet')}
            className={`p-1.5 rounded-md transition-colors ${
              viewportMode === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="태블릿 뷰 (768px)"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewportMode('desktop')}
            className={`p-1.5 rounded-md transition-colors ${
              viewportMode === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="데스크톱/웹 뷰 (1024px)"
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={history.length === 0}
            className="p-1.5 rounded-md text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition"
            title="실행 취소"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={future.length === 0}
            className="p-1.5 rounded-md text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition"
            title="다시 실행"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 우측: 미리보기 & 코드 내보내기 */}
      <div className="flex items-center gap-2">
        <button
          onClick={togglePreviewMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            isPreviewMode
              ? 'bg-amber-600 hover:bg-amber-500 text-white'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
        >
          {isPreviewMode ? <EyeOff className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isPreviewMode ? '편집 모드' : '인터랙션 테스트'}</span>
        </button>

        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-600/30 transition"
        >
          <Code className="w-3.5 h-3.5" />
          <span>코드 내보내기</span>
        </button>
      </div>
    </header>
  );
};
