import React, { ReactNode } from 'react';

export default function TooltipComponent(props: { children: ReactNode; text: string; className?: string }) {
  const { children, text, className } = props;

  return (
    <div className={`${className} relative group/tooltip`}>
      {children}
      <p className="z-10 absolute right-1/2 translate-x-1/2 bg-slate-900/70 scale-0 rounded-lg group-hover/tooltip:scale-100 p-2 my-2 text-white transition-all w-max">
        {text}
      </p>
    </div>
  );
}
