import React, { useState } from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { useCustomComponentStore } from '../../store/customComponentStore';
import {
  PALETTE_CATEGORIES,
  PALETTE_ITEMS,
  PaletteCategory,
} from './paletteData';
import { CustomPaletteView } from './CustomPaletteView';
import { Plus, Sparkles, Box } from 'lucide-react';

export const ComponentPalette: React.FC = () => {
  const { addComponent, screens, activeScreenId, selectedPanelId } = useCanvasStore();
  const { customPresets } = useCustomComponentStore();
  
  const [activeTab, setActiveTab] = useState<'builtIn' | 'custom'>('builtIn');
  const [selectedCategory, setSelectedCategory] = useState<PaletteCategory>('all');

  const currentScreen = screens.find((s) => s.id === activeScreenId);
  const targetPanel =
    currentScreen?.panels.find((p) => p.id === selectedPanelId) || currentScreen?.panels[0];

  const filteredItems =
    selectedCategory === 'all'
      ? PALETTE_ITEMS
      : PALETTE_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <div className="flex-1 overflow-y-auto p-2.5 space-y-3">
      {/* 부착 대상 패널 안내 */}
      <div className="p-2 bg-blue-50/80 border border-blue-200 text-xs text-blue-900">
        <span className="font-semibold block text-[10px] text-blue-700 uppercase tracking-wider">
          부착 대상 패널
        </span>
        <span className="font-bold truncate block">📍 {targetPanel?.title || '패널 없음'}</span>
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
                    className={`px-2 py-1 text-xs font-semibold border transition ${
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

          {/* 컴포넌트 목록 그리드 */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>
                {selectedCategory === 'all'
                  ? '전체 컴포넌트'
                  : PALETTE_CATEGORIES.find((c) => c.id === selectedCategory)?.name}{' '}
                ({filteredItems.length})
              </span>
              <span className="text-[10px] text-slate-400 font-normal">클릭 시 패널에 추가</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {filteredItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => addComponent(item.defaultData)}
                  className="flex flex-col items-start p-2.5 bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition text-left group relative"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <div className="p-1.5 border border-slate-200 bg-slate-50 group-hover:bg-white transition">
                      {item.icon}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-blue-600">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-800 block truncate w-full">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-400 block line-clamp-1 mt-0.5">
                    {item.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
