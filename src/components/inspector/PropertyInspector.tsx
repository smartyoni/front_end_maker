import React, { useState } from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { useCustomComponentStore } from '../../store/customComponentStore';
import { usePaletteStore } from '../../store/paletteStore';
import { PALETTE_ITEMS } from '../palette/paletteData';
import { Trash2, Sliders, BookmarkPlus, Plus, Terminal } from 'lucide-react';
import { CustomComponentModal } from '../palette/CustomComponentModal';
import { VibePromptSection } from './VibePromptSection';
import { ComponentConfigSection } from './ComponentConfigSection';
import { CanvasItemRenderer } from '../canvas/CanvasItemRenderer';
import { ComponentItem } from '../../types/builder';

export const PropertyInspector: React.FC = () => {
  const { screens, activeScreenId, selectedComponentId, updateComponent, deleteComponent, addComponent } = useCanvasStore();
  const { selectedPaletteTitle } = usePaletteStore();
  const { addPreset } = useCustomComponentStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'prompt'>('settings');

  const currentScreen = screens.find((s) => s.id === activeScreenId);
  const allComponents = currentScreen?.panels.flatMap((p) => p.components) || [];
  const selectedComponent = allComponents.find((c) => c.id === selectedComponentId);
  const paletteItem = PALETTE_ITEMS.find((it) => it.title === selectedPaletteTitle);

  // 1. 캔버스에서 선택된 컴포넌트가 없을 때
  if (!selectedComponent) {
    // 1-1. 도구함에서도 선택된 아이템이 없는 경우
    if (!paletteItem) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500">
          <Sliders className="w-8 h-8 mb-2 opacity-50" />
          <p className="text-xs font-semibold">선택된 컴포넌트가 없습니다.</p>
          <p className="text-[11px] text-slate-600 mt-1">
            1번 패널에서 컴포넌트를 클릭해 설정을 확인하거나,<br />
            캔버스에서 컴포넌트를 클릭해 편집하세요.
          </p>
        </div>
      );
    }

    // 1-2. 도구함 컴포넌트 설정 미리보기 모드
    const previewComponent: ComponentItem = {
      ...(paletteItem.defaultData as any),
      id: 'palette-preview',
    };

    return (
      <div className="h-full flex flex-col overflow-hidden bg-white">
        {/* 상단 타이틀 바: 도구함 미리보기 배지 + 컴포넌트명 + 캔버스 배치 버튼 */}
        <div className="p-3 pb-2 flex items-center justify-between border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-1.5 truncate flex-1 mr-2">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-bold shrink-0">
              도구함 미리보기
            </span>
            <h3 className="text-xs font-bold text-slate-800 truncate" title={paletteItem.title}>
              {paletteItem.title}
            </h3>
          </div>
          <button
            onClick={() => addComponent(paletteItem.defaultData)}
            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 transition shadow-xs shrink-0"
            title="선택된 패널에 컴포넌트 추가 (+)"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>배치</span>
          </button>
        </div>

        {/* 탭 헤더: [설정] vs [프롬프트] */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition ${
              activeTab === 'settings'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>설정</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('prompt')}
            className={`flex-1 py-2 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition ${
              activeTab === 'prompt'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-blue-600" />
            <span>프롬프트</span>
          </button>
        </div>

        {/* 탭 본문 영역 */}
        <div className="flex-1 overflow-y-auto p-3 min-h-0">
          {activeTab === 'settings' ? (
            <div className="space-y-3">
              {/* 실제 배치될 컴포넌트 실물 라이브 렌더링 */}
              <div className="p-2 bg-slate-100/80 border border-slate-200 rounded-lg shadow-inner">
                <CanvasItemRenderer
                  component={previewComponent}
                  isSelected={false}
                  onSelect={() => {}}
                />
              </div>

              {/* 기본 스펙 및 설명 */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs space-y-1.5">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">컴포넌트 설명</span>
                  <p className="text-xs text-slate-700 leading-relaxed">{paletteItem.description}</p>
                </div>
                {paletteItem.defaultData.label && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">기본 라벨</span>
                    <span className="text-xs text-slate-800 font-bold">{paletteItem.defaultData.label}</span>
                  </div>
                )}
              </div>

              {/* 캔버스 배치 액션 카드 */}
              <div className="p-3 border border-dashed border-blue-300 rounded-lg bg-blue-50/40 text-center">
                <p className="text-xs text-blue-800 font-medium mb-2">이 컴포넌트를 캔버스 패널에 배치합니다.</p>
                <button
                  type="button"
                  onClick={() => addComponent(paletteItem.defaultData)}
                  className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>캔버스에 컴포넌트 배치</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col min-h-0">
              <VibePromptSection component={previewComponent} onUpdate={() => {}} />
            </div>
          )}
        </div>
      </div>
    );
  }

  const handleUpdate = (updates: any) => {
    updateComponent(selectedComponent.id, updates);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      {/* 1. 최상단 타이틀 헤더 */}
      <div className="p-3 pb-2 flex items-center justify-between border-b border-slate-200 shrink-0">
        <h3 className="text-xs font-bold text-slate-800 truncate flex-1 mr-2" title={selectedComponent.name || selectedComponent.label}>
          {selectedComponent.name || selectedComponent.label || '컴포넌트'}
        </h3>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1 rounded text-blue-600 hover:bg-blue-50 transition border border-blue-200"
            title="이 설정을 내 도구함에 등록"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => deleteComponent(selectedComponent.id)}
            className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-slate-100 transition"
            title="컴포넌트 삭제"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. 탭 헤더: [설정] vs [프롬프트] */}
      <div className="flex border-b border-slate-200 bg-slate-50/50 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition ${
            activeTab === 'settings'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>설정</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('prompt')}
          className={`flex-1 py-2 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition ${
            activeTab === 'prompt'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-blue-600" />
          <span>프롬프트</span>
        </button>
      </div>

      {/* 3. 탭 본문 영역 */}
      <div className="flex-1 overflow-y-auto p-3 min-h-0">
        {activeTab === 'settings' ? (
          <div className="space-y-3.5">
            {/* 실제 배치된 컴포넌트 실물 라이브 렌더링 */}
            <div className="p-2.5 bg-slate-100/80 border border-slate-200 rounded-lg shadow-inner">
              <CanvasItemRenderer
                component={selectedComponent}
                isSelected={false}
                onSelect={() => {}}
              />
            </div>

            {/* 컴포넌트 커스텀 설정 컨트롤 */}
            <div className="pt-1 border-t border-slate-100">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                컴포넌트 커스텀 설정
              </div>
              <ComponentConfigSection component={selectedComponent} onUpdate={handleUpdate} />
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col min-h-0">
            <VibePromptSection component={selectedComponent} onUpdate={handleUpdate} />
          </div>
        )}
      </div>

      {/* 내 컴포넌트 등록 모달 */}
      <CustomComponentModal
        isOpen={isModalOpen}
        mode="create"
        initialData={{
          name: selectedComponent.name || selectedComponent.label || '내 컴포넌트',
          component: selectedComponent,
        }}
        onClose={() => setIsModalOpen(false)}
        onSave={(presetData) => {
          addPreset(presetData);
          alert(`'${presetData.name}' 컴포넌트가 도구함에 등록되었습니다.`);
        }}
      />
    </div>
  );
};
