import React, { useState, useRef, useEffect } from 'react';

interface RichTextItemProps {
  text: string;
  onChange: (val: string) => void;
  placeholder?: string;
  isChecked?: boolean;
  isEditing?: boolean;
  onStartEdit?: () => void;
  onEndEdit?: () => void;
}

// URL 및 한국 휴대폰 번호(010, 011, 016, 017, 018, 019) 정규식
const COMBINED_REGEX = /((?:https?:\/\/|www\.)[^\s]+|(?:01[016789])[-.\s]?\d{3,4}[-.\s]?\d{4})/g;
const PHONE_REGEX = /^(?:01[016789])[-.\s]?\d{3,4}[-.\s]?\d{4}$/;

export const RichTextItem: React.FC<RichTextItemProps> = ({
  text,
  onChange,
  placeholder = '(빈 블록)',
  isChecked = false,
  isEditing: externalIsEditing,
  onStartEdit,
  onEndEdit,
}) => {
  const [internalEditing, setInternalEditing] = useState(false);
  const isEditing = externalIsEditing !== undefined ? externalIsEditing : internalEditing;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // textarea 내용에 따라 높이 자동 조절
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(28, textareaRef.current.scrollHeight)}px`;
    }
  }, [isEditing, text]);

  // 텍스트를 URL과 휴대폰 번호로 파싱하여 렌더링
  const renderFormattedText = (content: string) => {
    if (!content.trim()) {
      return <span className="text-slate-400 italic">{placeholder}</span>;
    }

    const parts = content.split(COMBINED_REGEX);

    return parts.map((part, i) => {
      if (!part) return null;

      // 1. 휴대폰 번호 감지 -> sms: 프로토콜 연결
      if (PHONE_REGEX.test(part.trim())) {
        const cleanNumber = part.replace(/[-.\s]/g, '');
        return (
          <a
            key={i}
            href={`sms:${cleanNumber}`}
            onClick={(e) => e.stopPropagation()}
            className="text-emerald-700 underline font-semibold hover:text-emerald-900 transition mx-0.5 cursor-pointer"
            title={`${part} 번호로 문자(SMS) 보내기`}
          >
            {part}
          </a>
        );
      }

      // 2. URL 감지 -> 새 탭 하이퍼링크 연결
      if (part.startsWith('http://') || part.startsWith('https://') || part.startsWith('www.')) {
        const href = part.startsWith('www.') ? `https://${part}` : part;
        return (
          <a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-blue-600 underline hover:text-blue-800 transition mx-0.5 break-all cursor-pointer"
            title={`${href} 바로가기`}
          >
            {part}
          </a>
        );
      }

      // 일반 텍스트 (줄바꿈 유지)
      return <span key={i}>{part}</span>;
    });
  };

  if (isEditing) {
    return (
      <textarea
        ref={textareaRef}
        value={text}
        autoFocus
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.max(28, textareaRef.current.scrollHeight)}px`;
          }
        }}
        onBlur={() => {
          setInternalEditing(false);
          onEndEdit?.();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setInternalEditing(false);
            onEndEdit?.();
          }
        }}
        className="w-full text-xs bg-white border border-blue-400 p-1.5 rounded outline-none text-slate-800 resize-none leading-relaxed"
        rows={1}
      />
    );
  }

  return (
    <div
      onClick={() => {
        setInternalEditing(true);
        onStartEdit?.();
      }}
      className={`w-full text-xs py-1 px-1 rounded hover:bg-white/80 cursor-text whitespace-pre-wrap leading-relaxed select-text min-h-[24px] ${
        isChecked ? 'line-through text-slate-400' : 'text-slate-800'
      }`}
      title="클릭하여 줄바꿈 및 내용 수정"
    >
      {renderFormattedText(text)}
    </div>
  );
};
