'use client';

import { cn } from '@/lib/utils';

interface SidebarProps {
  children: React.ReactNode;
  side: 'left' | 'right';
  isOpen: boolean;
  className?: string;
}

export function Sidebar({ children, side, isOpen, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed lg:static inset-y-0 z-40 w-80 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out',
        side === 'left' ? 'left-0 border-r' : 'right-0 border-l',
        side === 'left'
          ? isOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
          : isOpen
            ? 'translate-x-0'
            : 'translate-x-full lg:translate-x-0',
        'lg:translate-x-0',
        className
      )}
    >
      <div className="h-full overflow-y-auto p-4 pt-20 lg:pt-4">
        {children}
      </div>
    </aside>
  );
}
