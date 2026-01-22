'use client';

import { Sun, Moon, Monitor, Globe } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { useI18n } from '@/lib/i18n';

export function ThemeLanguageSettings() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useI18n();

  const themeOptions = [
    { value: 'light', label: t('theme.light'), icon: Sun },
    { value: 'dark', label: t('theme.dark'), icon: Moon },
    { value: 'system', label: t('theme.system'), icon: Monitor },
  ] as const;

  const languageOptions = [
    { value: 'zh', label: '中文' },
    { value: 'en', label: 'English' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Theme Settings */}
      <section>
        <h2 className="text-base font-semibold text-foreground mb-4">{t('theme.title')}</h2>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex gap-2">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isActive = theme === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`
                    flex-1 flex flex-col items-center gap-2 p-3 rounded-lg transition-colors
                    ${isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Language Settings */}
      <section>
        <h2 className="text-base font-semibold text-foreground mb-4">{t('language.title')}</h2>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-muted-foreground" />
            <div className="flex gap-2 flex-1">
              {languageOptions.map((option) => {
                const isActive = language === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setLanguage(option.value)}
                    className={`
                      flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors
                      ${isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}
                    `}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
