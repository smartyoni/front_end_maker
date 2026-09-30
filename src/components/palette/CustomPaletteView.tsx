import React, { useState, useRef } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Download,
  Upload,
  Sparkles,
  FileText,
  Square,
  Columns,
  List,
  FormInput,
  FolderTree,
} from 'lucide-react';
import { CustomComponentPreset, ComponentType } from '../../types/builder';
import { useCustomComponentStore } from '../../store/customComponentStore';
import { useCanvasStore } from '../../store/canvasStore';
import { CustomComponentModal } from './CustomComponentModal';

export const CustomPaletteView: React.FC = () => {
  const { customPresets, addPreset, updatePreset, deletePreset, importPresets } = useCustomComponentStore();
  const { addComponent } = useCanvasStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    preset?: CustomComponentPreset;
  }>({ isOpen: false, mode: 'create' });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 카테고리 목록 추출
  const categories = ['all', ...Array.from(new Set(customPresets.map((p) => p.category)))];

  const filteredPresets =
    selectedCategory === 'all'
      ? customPresets
      : customPresets.filter((p) => p.category === selectedCategory);

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(customPresets, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `my-components-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        importPresets(parsed);
        alert('컴포넌트 설정을 성공적으로 불러왔습니다.');
      } catch (err) {
        alert('유효하지 않은 JSON 파일입니다.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getTypeIcon = (type: ComponentType) => {
    switch (type) {
      case 'colorBlock':
        return <FileText className="w-4 h-4 text-purple-600" />;
      case 'chipGroup':
        return <Columns className="w-4 h-4 text-emerald-600" />;
      case 'button':
        return <Square className="w-4 h-4 text-blue-600" />;
      case 'checklist':
      case 'list':
        return <List className="w-4 h-4 text-amber-600" />;
      case 'quickInput':
      case 'input':
        return <FormInput className="w-4 h-4 text-indigo-600" />;
      default:
        return <FolderTree className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-3">
      {/* 상단 액션 바: 신규 등록 & 백업/가져오기 */}
      <div className="flex items-center justify-between gap-1.5 pt-1">
        <button
          onClick={() => setModalState({ isOpen: true, mode: 'create' })}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>새 컴포넌트 직접 정의</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={handleExport}
            title="내 컴포넌트 JSON 내보내기"
            className="p-1.5 border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            title="JSON 불러오기"
            className="p-1.5 border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>

      {/* 카테고리 필터 태그 */}
      {categories.length > 2 && (
        <div className="flex flex-wrap gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-0.5 text-[11px] font-semibold border transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? '전체' : cat}
            </button>
          ))}
        </div>
      )}

      {/* 컴포넌트 카드 목록 */}
      <div className="space-y-1.5">
        {filteredPresets.length === 0 ? (
          <div className="p-5 border border-dashed border-slate-200 text-center text-slate-400 text-xs">
            <Sparkles className="w-6 h-6 mx-auto mb-2 text-slate-300" />
            <p>등록된 컴포넌트가 없습니다.</p>
            <p className="text-[10px] mt-1 text-slate-400">
              상단의 버튼이나 우측 속성 패널에서 <br />자주 쓰는 컴포넌트를 등록해보세요!
            </p>
          </div>
        ) : (
          filteredPresets.map((preset) => (
            <div
              key={preset.id}
              className="p-2.5 bg-white border border-slate-200 hover:border-blue-400 transition group relative"
            >
              <div className="flex items-start justify-between gap-2">
                <div
                  onClick={() => addComponent(preset.component)}
                  className="flex items-start gap-2 flex-1 cursor-pointer"
                >
                  <div className="p-1.5 bg-slate-50 border border-slate-200 mt-0.5">
                    {getTypeIcon(preset.component.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {preset.name}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 bg-blue-50 text-blue-700 border border-blue-200">
                        {preset.category}
                      </span>
                    </div>
                    {preset.description && (
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                        {preset.description}
                      </p>
                    )}
                    {preset.component.functionNote && (
                      <div className="mt-1 text-[10px] text-amber-800 bg-amber-50/80 px-1.5 py-0.5 border border-amber-200/80 truncate">
                        💡 {preset.component.functionNote}
                      </div>
                    )}
                  </div>
                </div>

                {/* 우측 호버 액션 */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() =>
                      setModalState({
                        isOpen: true,
                        mode: 'edit',
                        preset,
                      })
                    }
                    className="p-1 hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition"
                    title="설정 수정"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`'${preset.name}' 컴포넌트를 삭제하시겠습니까?`)) {
                        deletePreset(preset.id);
                      }
                    }}
                    className="p-1 hover:bg-slate-100 text-slate-400 hover:text-red-500 transition"
                    title="삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 등록 및 수정 모달 */}
      <CustomComponentModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        initialData={modalState.preset}
        onClose={() => setModalState({ isOpen: false, mode: 'create' })}
        onSave={(data) => {
          if (modalState.mode === 'create') {
            addPreset(data);
          } else if (modalState.preset) {
            updatePreset(modalState.preset.id, data);
          }
        }}
      />
    </div>
  );
};
