import React from 'react';
import { ComponentItem } from '../../types/builder';

interface StyleSectionProps {
  component: ComponentItem;
  onUpdate: (updates: Partial<ComponentItem>) => void;
}

export const StyleSection: React.FC<StyleSectionProps> = ({ component, onUpdate }) => {
  const styles = component.styles || {};

  const handleStyleChange = (key: string, value: any) => {
    onUpdate({
      styles: {
        ...styles,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-2.5 pt-2">
      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">스타일 색상 (직각 / 여백 0)</h4>

      {/* 배경색과 텍스트 색상을 하나의 라인(2열)에 나란히 배치 */}
      <div className="grid grid-cols-2 gap-2">
        {/* 배경색 */}
        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">배경색</label>
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={styles.backgroundColor || '#ffffff'}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="w-6 h-6 border border-slate-300 bg-transparent cursor-pointer shrink-0"
            />
            <input
              type="text"
              value={styles.backgroundColor || ''}
              placeholder="#ffffff"
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="w-full px-2 py-1 bg-slate-50 border border-slate-300 text-xs text-slate-800"
            />
          </div>
        </div>

        {/* 텍스트 색상 */}
        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">글자색</label>
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={styles.textColor || '#1e293b'}
              onChange={(e) => handleStyleChange('textColor', e.target.value)}
              className="w-6 h-6 border border-slate-300 bg-transparent cursor-pointer shrink-0"
            />
            <input
              type="text"
              value={styles.textColor || ''}
              placeholder="#1e293b"
              onChange={(e) => handleStyleChange('textColor', e.target.value)}
              className="w-full px-2 py-1 bg-slate-50 border border-slate-300 text-xs text-slate-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
