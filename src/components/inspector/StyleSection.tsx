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
    <div className="space-y-3 pt-2">
      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">스타일 & 외형</h4>

      {/* 배경색 */}
      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1">배경 색상</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={styles.backgroundColor || '#ffffff'}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            className="w-7 h-7 rounded border border-slate-300 bg-transparent cursor-pointer"
          />
          <input
            type="text"
            value={styles.backgroundColor || ''}
            placeholder="#ffffff"
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
          />
        </div>
      </div>

      {/* 텍스트 색상 */}
      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1">텍스트 색상</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={styles.textColor || '#1e293b'}
            onChange={(e) => handleStyleChange('textColor', e.target.value)}
            className="w-7 h-7 rounded border border-slate-300 bg-transparent cursor-pointer"
          />
          <input
            type="text"
            value={styles.textColor || ''}
            placeholder="#1e293b"
            onChange={(e) => handleStyleChange('textColor', e.target.value)}
            className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
          />
        </div>
      </div>

      {/* 모서리 둥글기 */}
      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1">모서리 둥글기 (Border Radius)</label>
        <select
          value={styles.borderRadius || '8px'}
          onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
        >
          <option value="0px">직각 (0px)</option>
          <option value="6px">약간 둥글게 (6px)</option>
          <option value="12px">둥글게 (12px)</option>
          <option value="20px">매우 둥글게 (20px)</option>
          <option value="9999px">알약형 (Pill)</option>
        </select>
      </div>

      {/* 내부 여백 (Padding) */}
      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1">내부 여백 (Padding)</label>
        <input
          type="text"
          value={styles.padding || ''}
          placeholder="예: 12px 16px"
          onChange={(e) => handleStyleChange('padding', e.target.value)}
          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
        />
      </div>
    </div>
  );
};
