'use client';

import { FileText } from 'lucide-react';

interface HeaderProps {
  title: string;
  action?: React.ReactNode;
}

export function Header({ title, action }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Mobile Logo (hidden on desktop) */}
        <div className="flex items-center gap-3 md:hidden">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="font-semibold text-foreground">{title}</h1>
        </div>

        {/* Desktop Title */}
        <h1 className="hidden md:block font-semibold text-lg text-foreground">
          {title}
        </h1>

        {/* Action Button */}
        {action && <div>{action}</div>}
      </div>
    </header>
  );
}
