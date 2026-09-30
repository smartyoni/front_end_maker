import React from 'react';
import {
  Trash2,
  Edit3,
  Terminal,
  Keyboard,
  ArrowRight,
} from 'lucide-react';
import { useGlobalSettingsStore } from '../../store/globalSettingsStore';

export const CommonSettingsTab: React.FC = () => {
  const { settings, updateSettings } = useGlobalSettingsStore();

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/50 text-slate-800">
      {/* 1. 삭제 인터랙션 설정 */}
      <div className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-xs space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-red-600">
          <Trash2 className="w-3.5 h-3.5" />
          <span>삭제 확인 및 팝오버 규격</span>
        </div>

        {/* 팝업 위치 옵션 */}
        <div className="space-y-1.5 pt-1">
          <label
            onClick={() => updateSettings({ deleteConfirmStyle: 'nearPopover' })}
            className={`flex items-start gap-2 p-2 rounded border cursor-pointer transition ${
              settings.deleteConfirmStyle === 'nearPopover'
                ? 'bg-blue-50/50 border-blue-400'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <input
              type="radio"
              name="deleteConfirmStyle"
              checked={settings.deleteConfirmStyle === 'nearPopover'}
              onChange={() => updateSettings({ deleteConfirmStyle: 'nearPopover' })}
              className="mt-0.5"
            />
            <div>
              <div className="text-xs font-semibold text-slate-800">
                버튼 근처 초근접 팝오버 (추천 ⭐)
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                삭제 버튼 바로 옆에 말풍선 형태로 떠 마우스 이동을 최소화합니다.
              </p>
            </div>
          </label>

          <label
            onClick={() => updateSettings({ deleteConfirmStyle: 'modal' })}
            className={`flex items-start gap-2 p-2 rounded border cursor-pointer transition ${
              settings.deleteConfirmStyle === 'modal'
                ? 'bg-blue-50/50 border-blue-400'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <input
              type="radio"
              name="deleteConfirmStyle"
              checked={settings.deleteConfirmStyle === 'modal'}
              onChange={() => updateSettings({ deleteConfirmStyle: 'modal' })}
              className="mt-0.5"
            />
            <div>
              <div className="text-xs font-semibold text-slate-800">화면 중앙 확인 모달</div>
              <p className="text-[10px] text-slate-500 leading-tight">
                화면 정중앙에 팝업되는 전통적인 확인 모달창입니다.
              </p>
            </div>
          </label>
        </div>

        {/* Enter 키 즉시 삭제 체크박스 */}
        <div className="pt-1 border-t border-slate-100">
          <label className="flex items-center gap-2 text-xs cursor-pointer select-none text-slate-700">
            <input
              type="checkbox"
              checked={settings.deleteEnterKeyConfirm}
              onChange={(e) => updateSettings({ deleteEnterKeyConfirm: e.target.checked })}
              className="rounded text-blue-600 focus:ring-0"
            />
            <span className="flex items-center gap-1 font-medium">
              <Keyboard className="w-3.5 h-3.5 text-slate-500" />
              <span>확인 팝업 시 `Enter` 키로 즉시 삭제</span>
            </span>
          </label>
        </div>
      </div>

      {/* 2. 편집 & 인터랙션 설정 */}
      <div className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-xs space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
          <span>편집 및 데이터 조작 규격</span>
        </div>

        <div className="space-y-1.5 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
            <input
              type="checkbox"
              checked={settings.inlineEditTrigger === 'doubleClick'}
              onChange={(e) =>
                updateSettings({
                  inlineEditTrigger: e.target.checked ? 'doubleClick' : 'menuOnly',
                })
              }
              className="rounded text-blue-600"
            />
            <span className="font-medium">더블클릭 인라인 텍스트 수정 허용</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
            <input
              type="checkbox"
              checked={settings.dragAndDropReorder}
              onChange={(e) => updateSettings({ dragAndDropReorder: e.target.checked })}
              className="rounded text-blue-600"
            />
            <span className="font-medium">행 자체 드래그 앤 드롭 정렬 (핸들 없이 드래그)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
            <input
              type="checkbox"
              checked={settings.autoLinkDetect}
              onChange={(e) => updateSettings({ autoLinkDetect: e.target.checked })}
              className="rounded text-blue-600"
            />
            <span className="font-medium">URL 하이퍼링크 및 휴대폰 번호 SMS 자동 연결</span>
          </label>
        </div>
      </div>

      {/* 3. 추가 공통 프롬프트 메모 */}
      <div className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-xs space-y-1.5">
        <div className="text-xs font-bold text-slate-800">추가 공통 프롬프트 메모</div>
        <textarea
          rows={3}
          value={settings.customGlobalPrompt}
          onChange={(e) => updateSettings({ customGlobalPrompt: e.target.value })}
          placeholder="모든 컴포넌트 프롬프트에 추가할 나만의 공통 규칙을 적어보세요..."
          className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white resize-none"
        />
      </div>

      {/* 4. 5번 패널 실시간 연동 안내 카드 */}
      <div className="p-2.5 bg-indigo-50/80 border border-indigo-200 rounded-lg text-xs space-y-1">
        <div className="flex items-center justify-between font-bold text-indigo-900">
          <div className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-indigo-600" />
            <span>프롬프트 박스 (5번 패널 연동)</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />
        </div>
        <p className="text-[11px] text-indigo-700 leading-tight">
          여기서 변경한 모든 설정이 우측 <strong>5번 패널(프롬프트 박스)</strong>에 실시간 자동 반영됩니다.
        </p>
      </div>
    </div>
  );
};
