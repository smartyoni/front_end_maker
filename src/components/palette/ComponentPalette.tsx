import React, { useState } from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { useCustomComponentStore } from '../../store/customComponentStore';
import { usePaletteStore } from '../../store/paletteStore';
import {
  PALETTE_CATEGORIES,
  PaletteCategory,
} from './paletteData';
import { CustomPaletteView } from './CustomPaletteView';
import { Plus, Sparkles, Box } from 'lucide-react';

export const ComponentPalette: React.FC = () => {
  const { addComponent, screens, activeScreenId, selectedPanelId } = useCanvasStore();
  const { customPresets } = useCustomComponentStore();
  const { getOrderedItems, reorderItems } = usePaletteStore();
  
  const [activeTab, setActiveTab] = useState<'builtIn' | 'custom'>('builtIn');
  const [selectedCategory, setSelectedCategory] = useState<PaletteCategory>('all');
  const [draggedTitle, setDraggedTitle] = useState<string | null>(null);
  const [dragOverTitle, setDragOverTitle] = useState<string | null>(null);

  const currentScreen = screens.find((s) => s.id === activeScreenId);
  const targetPanel =
    currentScreen?.panels.find((p) => p.id === selectedPanelId) || currentScreen?.panels[0];

  const filteredItems = getOrderedItems(selectedCategory);

  const handleDragStart = (title: string, e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', title);
    setDraggedTitle(title);
  };

  const handleDragOver = (title: string, e: React.DragEvent) => {
    e.preventDefault();
    if (dragOverTitle !== title) {
      setDragOverTitle(title);
    }
  };

  const handleDrop = (targetTitle: string) => {
    if (draggedTitle && draggedTitle !== targetTitle) {
      reorderItems(draggedTitle, targetTitle);
    }
    setDraggedTitle(null);
    setDragOverTitle(null);
  };

  const handleDragEnd = () => {
    setDraggedTitle(null);
    setDragOverTitle(null);
  };

  return (
    <div className="flex-1 overflow-y-auto p-2.5 space-y-3">
      {/* 부착 대상 패널 안내 */}
      <div className="px-2 py-1.5 bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
        <span className="font-semibold text-[10px] text-blue-700 uppercase tracking-wider">
          부착 대상 패널
        </span>
        <span className="font-bold truncate max-w-[160px] text-right">
          {targetPanel?.title || '패널 없음'}
        </span>
      </div>

      {/* 메인 탭: 기본 도구 vs 내 컴포넌트 */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('builtIn')}
          className={`flex-1 py-1.5 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition ${
            activeTab === 'builtIn'
              ? 'border-blue-600 text-blue-600 bg-blue-50/30'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>기본 도구함</span>
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`flex-1 py-1.5 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition ${
            activeTab === 'custom'
              ? 'border-blue-600 text-blue-600 bg-blue-50/30'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>내 컴포넌트</span>
          <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-200 text-slate-700">
            {customPresets.length}
          </span>
        </button>
      </div>

      {activeTab === 'custom' ? (
        <CustomPaletteView />
      ) : (
        <>
          {/* 세분화 카테고리 필터 탭 */}
          <div>
            <div className="flex flex-wrap gap-1">
              {PALETTE_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2 py-0.5 text-[11px] font-semibold border transition ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 컴포넌트 목록 (1열 컴팩트 리스트, 드래그 핸들 없이 행 자체 드래그 지원) */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between pb-0.5">
              <span>
                {selectedCategory === 'all'
                  ? '전체 컴포넌트'
                  : PALETTE_CATEGORIES.find((c) => c.id === selectedCategory)?.name}{' '}
                ({filteredItems.length})
              </span>
              <span className="text-[10px] text-slate-400 font-normal">드래그: 순서 이동</span>
            </div>

            <div className="space-y-1">
              {filteredItems.map((item) => {
                const isDragging = draggedTitle === item.title;
                const isDragOver = dragOverTitle === item.title && !isDragging;

                return (
                  <div
                    key={item.title}
                    draggable
                    onDragStart={(e) => handleDragStart(item.title, e)}
                    onDragOver={(e) => handleDragOver(item.title, e)}
                    onDrop={() => handleDrop(item.title)}
                    onDragEnd={handleDragEnd}
                    onClick={() => addComponent(item.defaultData)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 bg-white border cursor-pointer select-none transition group ${
                      isDragging
                        ? 'opacity-30 border-dashed border-blue-500 bg-blue-50/40'
                        : isDragOver
                        ? 'border-blue-500 ring-2 ring-blue-400 ring-offset-1 bg-blue-50/20'
                        : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'
                    }`}
                    title="클릭: 캔버스에 추가 / 드래그: 순서 이동"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-1 border border-slate-200 bg-slate-50 group-hover:bg-white transition shrink-0">
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-800 block truncate leading-tight">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate leading-tight mt-0.5">
                          {item.description}
                        </span>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-blue-600 shrink-0">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
