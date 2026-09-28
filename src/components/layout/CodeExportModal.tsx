import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { generateReactCode } from '../../utils/codeGenerator';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({ isOpen, onClose }) => {
  const { screens, activeScreenId } = useCanvasStore();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentScreen = screens.find((s) => s.id === activeScreenId) || screens[0];
  const generatedCode = generateReactCode(currentScreen);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('코드 복사에 실패했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white">React + Tailwind 코드 내보내기</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              현재 <span className="text-blue-400 font-semibold">{currentScreen.name}</span> 화면을 클린 코드로 변환했습니다.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 코드 프리뷰 */}
        <div className="relative flex-1 p-4 overflow-auto bg-slate-950 font-mono text-xs text-slate-300">
          <pre className="whitespace-pre overflow-x-auto leading-relaxed">{generatedCode}</pre>
        </div>

        {/* 모달 풋터 */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 border-t border-slate-800">
          <span className="text-xs text-slate-400">
            복사한 코드를 React 프로젝트의 컴포넌트로 바로 사용하실 수 있습니다.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
            >
              닫기
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '복사 완료!' : '코드 복사'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
