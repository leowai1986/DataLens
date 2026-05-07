import { useState, type ReactNode } from 'react';
import { cn } from '@shared/utils/cn';

interface Props {
  content: string;
  children: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip = ({ content, children, side = 'top' }: Props) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div
          className={cn(
            'absolute z-50 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white shadow-lg',
            side === 'top' && 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
            side === 'bottom' && 'top-full left-1/2 -translate-x-1/2 mt-1.5',
          )}
        >
          {content}
          <div
            className={cn(
              'absolute h-1.5 w-1.5 rotate-45 bg-slate-900',
              side === 'top' && '-bottom-0.5 left-1/2 -translate-x-1/2',
              side === 'bottom' && '-top-0.5 left-1/2 -translate-x-1/2',
            )}
          />
        </div>
      )}
    </div>
  );
};
