'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Users, Package, Clock, Settings } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { ThemeLanguageToggle } from './ThemeLanguageToggle';

const navItems = [
  { href: '/invoice', labelKey: 'nav.invoice', icon: FileText },
  { href: '/customers', labelKey: 'nav.customers', icon: Users },
  { href: '/products', labelKey: 'nav.products', icon: Package },
  { href: '/history', labelKey: 'nav.history', icon: Clock },
  { href: '/settings', labelKey: 'nav.settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <aside className="hidden md:flex md:w-56 md:flex-col md:fixed md:inset-y-0 bg-card border-r border-border">
      <div className="flex flex-col flex-1 min-h-0">
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">SollAI</span>
          </Link>
          <ThemeLanguageToggle />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}
                `}
              >
                <Icon className="w-5 h-5" />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            SollAI Invoice v1.0
          </p>
        </div>
      </div>
    </aside>
  );
}
