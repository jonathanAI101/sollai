'use client';

import { useState } from 'react';
import { Sun, Moon, Monitor, Globe, ChevronDown } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { useI18n } from '@/lib/i18n';

export function ThemeLanguageToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { language, setLanguage } = useI18n();
  const [showMenu, setShowMenu] = useState(false);

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

  const ThemeIcon = themeIcons[theme];

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-secondary transition-colors text-sm"
      >
        <ThemeIcon className="w-4 h-4 text-muted-foreground" />
        <span className="text-muted-foreground">{language === 'zh' ? '中' : 'EN'}</span>
        <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${showMenu ? 'rotate-180' : ''}`} />
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute left-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-50 w-48 py-2">
            {/* Theme Section */}
            <div className="px-3 py-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Theme</p>
            </div>
            <div className="px-2 pb-2 flex gap-1">
              {(['light', 'dark', 'system'] as const).map((t) => {
                const Icon = themeIcons[t];
                const isActive = theme === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`flex-1 flex items-center justify-center p-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-secondary text-muted-foreground'
                    }`}
                    title={t.charAt(0).toUpperCase() + t.slice(1)}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>

            <div className="border-t border-border my-1" />

            {/* Language Section */}
            <div className="px-3 py-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Language</p>
            </div>
            <div className="px-2">
              <button
                onClick={() => {
                  setLanguage('en');
                  setShowMenu(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  language === 'en'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary'
                }`}
              >
                English
              </button>
              <button
                onClick={() => {
                  setLanguage('zh');
                  setShowMenu(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  language === 'zh'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary'
                }`}
              >
                中文
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
