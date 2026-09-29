import React from 'react';
import { ComponentItem, ActionType } from '../../types/builder';
import { useCanvasStore } from '../../store/canvasStore';
import { Zap } from 'lucide-react';

interface ActionSectionProps {
  component: ComponentItem;
  onUpdate: (updates: Partial<ComponentItem>) => void;
}

export const ActionSection: React.FC<ActionSectionProps> = ({ component, onUpdate }) => {
  const { screens } = useCanvasStore();
  const action = component.action || { type: 'none' };

  const handleActionTypeChange = (type: ActionType) => {
    onUpdate({
      action: {
        ...action,
        type,
        targetScreenId: type === 'navigate' ? screens[0]?.id : undefined,
      },
    });
  };

  const handleTargetChange = (targetScreenId: string) => {
    onUpdate({
      action: {
        ...action,
        targetScreenId,
      },
    });
  };

  const handleToastMsgChange = (toastMessage: string) => {
    onUpdate({
      action: {
        ...action,
        toastMessage,
      },
    });
  };

  return (
    <div className="space-y-3 pt-3 border-t border-slate-200">
      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-600">
        <Zap className="w-3.5 h-3.5" />
        <span>기능 & 메뉴 인터랙션</span>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1">클릭/터치 시 동작</label>
        <select
          value={action.type || 'none'}
          onChange={(e) => handleActionTypeChange(e.target.value as ActionType)}
          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
        >
          <option value="none">동작 없음 (기본 UI)</option>
          <option value="navigate">화면 이동 (Route/Menu)</option>
          <option value="toast">알림 메시지 띄우기 (Toast)</option>
        </select>
      </div>

      {action.type === 'navigate' && (
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-2">
          <label className="text-xs text-slate-700 font-semibold block">이동할 대상 화면</label>
          <select
            value={action.targetScreenId || ''}
            onChange={(e) => handleTargetChange(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800"
          >
            {screens.map((scr) => (
              <option key={scr.id} value={scr.id}>
                {scr.name}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500">
            상단 '인터랙션 테스트'를 켜고 컴포넌트를 클릭하면 대상 화면으로 즉시 전환됩니다.
          </p>
        </div>
      )}

      {action.type === 'toast' && (
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-2">
          <label className="text-xs text-slate-700 font-semibold block">알림 메시지 내용</label>
          <input
            type="text"
            value={action.toastMessage || ''}
            onChange={(e) => handleToastMsgChange(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800"
          />
        </div>
      )}
    </div>
  );
};
