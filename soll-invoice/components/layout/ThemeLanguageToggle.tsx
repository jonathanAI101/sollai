'use client';

import { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export function ThemeLanguageToggle() {
  const { language, setLanguage } = useI18n();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-secondary transition-colors text-sm"
      >
        <Globe className="w-4 h-4 text-muted-foreground" />
        <span className="text-muted-foreground">{language === 'zh' ? '中' : 'EN'}</span>
        <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${showMenu ? 'rotate-180' : ''}`} />
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute left-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-50 w-36 py-2">
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
