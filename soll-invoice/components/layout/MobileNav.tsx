'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Users, Package, Clock, Settings } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const navItems = [
  { href: '/invoice', labelKey: 'nav.invoice', icon: FileText },
  { href: '/customers', labelKey: 'nav.customers', icon: Users },
  { href: '/products', labelKey: 'nav.products', icon: Package },
  { href: '/history', labelKey: 'nav.history', icon: Clock },
  { href: '/settings', labelKey: 'nav.settings', icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors
                ${isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'}
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </div>
      {/* Safe area for iOS */}
      <div className="h-safe-area-inset-bottom bg-card" />
    </nav>
  );
}
