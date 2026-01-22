'use client';

import { Layout, Header } from '@/components/layout';
import { Download, Upload, Building2, Globe } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function SettingsPage() {
  const { t, language, setLanguage } = useI18n();

  const handleExport = async () => {
    try {
      const data = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        settings: {
          language,
        },
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sollai-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert(language === 'zh' ? '导出失败，请重试' : 'Export failed, please try again');
    }
  };

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data.settings?.language) {
          setLanguage(data.settings.language);
        }
        alert(language === 'zh' ? '导入成功！' : 'Import successful!');
      } catch (error) {
        console.error('Import failed:', error);
        alert(language === 'zh' ? '导入失败，请检查文件格式' : 'Import failed, please check file format');
      }
    };
    input.click();
  };

  return (
    <Layout>
      <Header title={t('settings.title')} />

      <div className="p-4 md:p-6 space-y-6">
        {/* Language Settings */}
        <section>
          <h2 className="text-base font-semibold text-foreground mb-4">{t('language.title')}</h2>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setLanguage('zh')}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                  language === 'zh'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Globe className={`w-5 h-5 ${language === 'zh' ? 'text-primary' : 'text-muted-foreground'}`} />
                <div className="text-left">
                  <p className={`text-sm font-medium ${language === 'zh' ? 'text-primary' : 'text-foreground'}`}>
                    中文
                  </p>
                  <p className="text-xs text-muted-foreground">Chinese</p>
                </div>
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                  language === 'en'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Globe className={`w-5 h-5 ${language === 'en' ? 'text-primary' : 'text-muted-foreground'}`} />
                <div className="text-left">
                  <p className={`text-sm font-medium ${language === 'en' ? 'text-primary' : 'text-foreground'}`}>
                    English
                  </p>
                  <p className="text-xs text-muted-foreground">英文</p>
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* Data Management Section */}
        <section>
          <h2 className="text-base font-semibold text-foreground mb-4">{t('data.title')}</h2>
          <div className="bg-card rounded-lg border border-border divide-y divide-border">
            <button
              onClick={handleExport}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-900/30 flex items-center justify-center">
                <Download className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{t('data.export')}</p>
                <p className="text-xs text-muted-foreground">{t('data.exportHint')}</p>
              </div>
            </button>
            <button
              onClick={handleImport}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-green-900/30 flex items-center justify-center">
                <Upload className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{t('data.import')}</p>
                <p className="text-xs text-muted-foreground">{t('data.importHint')}</p>
              </div>
            </button>
          </div>
        </section>

        {/* About Section */}
        <section>
          <h2 className="text-base font-semibold text-foreground mb-4">{t('about.title')}</h2>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">SollAI</p>
                <p className="text-xs text-muted-foreground">{t('about.version')} 1.0.0</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {language === 'zh'
                ? 'AI 驱动的全球达人营销平台，帮助品牌连接全球创作者，实现营销目标。'
                : 'AI-powered global creator marketing platform, helping brands connect with creators worldwide to achieve marketing goals.'}
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
}
