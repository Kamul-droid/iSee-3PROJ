import React, { useState } from 'react';

export default function CollapsibleTextComponent(props: {
  text: string;
  charsThreshold?: number;
  linesThreshold?: number;
  fadeColor?: string;
  className?: string;
}) {
  const { text, charsThreshold, linesThreshold, fadeColor, className } = props;

  const isOverflown =
    text.length > (charsThreshold || 500) || (text.match(/\n/g)?.length ?? 0) > (linesThreshold || 10);

  const [isExpanded, setExpanded] = useState(false);

  return (
    <>
      <div className={`${!isExpanded && 'max-h-20'} overflow-hidden relative ${className}`}>
        <p className="break-words">{text}</p>
        {!isExpanded && isOverflown && (
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent ${
              fadeColor || 'to-white'
            }`}
          />
        )}
      </div>
      {isOverflown && (
        <button className="text-gray-400 py-1" onClick={() => setExpanded(!isExpanded)}>
          Show {isExpanded ? 'less' : 'more'}...
        </button>
      )}
    </>
  );
}
