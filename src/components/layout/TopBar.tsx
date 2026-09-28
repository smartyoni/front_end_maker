import React from 'react';
import { Play, EyeOff, Code, Plus, Trash2, Undo2, Redo2 } from 'lucide-react';
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
    setPanelLayout,
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
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-20 shrink-0 shadow-sm">
      {/* 로고 & 화면 탭 */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
            UI
          </div>
          <span className="font-bold text-sm tracking-wide bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hidden sm:inline">
            AppCanvas
          </span>
        </div>

        <div className="h-5 w-px bg-slate-200" />

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
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                onClick={() => setActiveScreen(screen.id)}
              >
                <span>{screen.name}</span>
                {screens.length > 1 && (
                  <button
                    className="opacity-0 group-hover:opacity-100 hover:text-red-200 transition-opacity ml-1"
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
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-dashed border-slate-300 hover:border-slate-400"
            title="새 화면 추가"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden md:inline">화면 추가</span>
          </button>
        </div>
      </div>

      {/* 중앙: 패널 분할 레이아웃 선택 & Undo/Redo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            onClick={() => setPanelLayout('1-panel')}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold text-slate-700 hover:bg-white transition"
            title="1단 단일 패널 (전체 뷰)"
          >
            <span>1단 뷰</span>
          </button>
          <button
            onClick={() => setPanelLayout('2-panel')}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold text-slate-700 hover:bg-white transition"
            title="2단 분할 패널 (사이드바 + 메인)"
          >
            <span>2단 분할</span>
          </button>
          <button
            onClick={() => setPanelLayout('3-panel')}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-white text-blue-600 shadow-xs border border-slate-200 transition"
            title="3단 분할 패널 (사이드바 + 목록 + 상세)"
          >
            <span>3단 분할 (추천)</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={history.length === 0}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 disabled:opacity-30 transition"
            title="실행 취소"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={future.length === 0}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 disabled:opacity-30 transition"
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
              ? 'bg-amber-500 hover:bg-amber-600 text-white'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
          }`}
        >
          {isPreviewMode ? <EyeOff className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isPreviewMode ? '편집 모드' : '인터랙션 테스트'}</span>
        </button>

        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20 transition"
        >
          <Code className="w-3.5 h-3.5" />
          <span>코드 내보내기</span>
        </button>
      </div>
    </header>
  );
};
