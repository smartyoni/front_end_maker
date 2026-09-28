import React from 'react';
import { ComponentItem } from '../../types/builder';
import { useCanvasStore } from '../../store/canvasStore';

interface CanvasItemRendererProps {
  component: ComponentItem;
  isSelected: boolean;
  onSelect: () => void;
}

export const CanvasItemRenderer: React.FC<CanvasItemRendererProps> = ({
  component,
  isSelected,
  onSelect,
}) => {
  const { isPreviewMode, setActiveScreen } = useCanvasStore();
  const styles = component.styles || {};

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPreviewMode) {
      if (component.action?.type === 'navigate' && component.action.targetScreenId) {
        setActiveScreen(component.action.targetScreenId);
      } else if (component.action?.type === 'toast') {
        alert(component.action.toastMessage || '알림 메시지입니다.');
      }
    } else {
      onSelect();
    }
  };

  const wrapperBorder = !isPreviewMode && isSelected
    ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900'
    : !isPreviewMode
    ? 'hover:ring-1 hover:ring-blue-400/50'
    : '';

  return (
    <div
      onClick={handleClick}
      className={`relative transition-all cursor-pointer select-none ${wrapperBorder}`}
      style={{
        backgroundColor: styles.backgroundColor,
        color: styles.textColor,
        padding: styles.padding,
        margin: styles.margin,
        borderRadius: styles.borderRadius,
      }}
    >
      {renderComponentContent(component)}
    </div>
  );
};

function renderComponentContent(comp: ComponentItem) {
  switch (comp.type) {
    case 'header':
      return (
        <div className="flex items-center justify-between">
          <span className="font-bold text-base">{comp.label || 'Header'}</span>
          <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-[10px] text-slate-700">
            ☰
          </div>
        </div>
      );

    case 'button':
      return (
        <button
          className={`w-full py-2.5 px-4 text-center font-semibold rounded-lg transition ${
            comp.variant === 'primary' ? 'shadow-md shadow-blue-500/20' : ''
          }`}
          style={{
            backgroundColor: comp.styles?.backgroundColor || '#2563eb',
            color: comp.styles?.textColor || '#ffffff',
          }}
        >
          {comp.label || '버튼'}
        </button>
      );

    case 'input':
      return (
        <div className="space-y-1 w-full">
          {comp.label && <div className="text-xs font-semibold text-slate-700">{comp.label}</div>}
          <div className="px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-400 shadow-sm">
            {comp.placeholder || '입력하세요...'}
          </div>
        </div>
      );

    case 'card':
      return (
        <div className="space-y-1.5">
          <h4 className="font-bold text-sm text-slate-800">{comp.label || '카드 제목'}</h4>
          <p className="text-xs text-slate-600 leading-relaxed">{comp.content || '카드 설명 내용입니다.'}</p>
        </div>
      );

    case 'tabs':
      return (
        <div className="flex border-b border-slate-200 text-xs">
          {(comp.items || ['탭 1', '탭 2']).map((tab, idx) => (
            <div
              key={idx}
              className={`flex-1 py-2 text-center font-semibold ${
                idx === 0 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'
              }`}
            >
              {tab}
            </div>
          ))}
        </div>
      );

    case 'list':
      return (
        <div className="divide-y divide-slate-200">
          {(comp.items || ['항목 1', '항목 2']).map((item, idx) => (
            <div key={idx} className="py-2.5 px-2 text-xs flex items-center justify-between text-slate-700">
              <span className="font-medium">{item}</span>
              <span className="text-slate-400">›</span>
            </div>
          ))}
        </div>
      );

    case 'bottomNav':
      return (
        <div className="flex items-center justify-around text-[11px] text-slate-500 pt-1">
          {(comp.items || ['홈', '검색', '설정']).map((item, idx) => (
            <div key={idx} className={`flex flex-col items-center ${idx === 0 ? 'text-blue-600 font-bold' : ''}`}>
              <span className="w-1.5 h-1.5 rounded-full mb-1 bg-current" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      );

    case 'switch':
      return (
        <div className="flex items-center justify-between py-1">
          <span className="text-xs font-semibold text-slate-700">{comp.label || '스위치 설정'}</span>
          <div className="w-9 h-5 bg-blue-600 rounded-full flex items-center px-0.5 justify-end">
            <div className="w-4 h-4 bg-white rounded-full shadow" />
          </div>
        </div>
      );

    default:
      return <div className="p-2 text-xs text-slate-700">{comp.label || comp.name}</div>;
  }
}
