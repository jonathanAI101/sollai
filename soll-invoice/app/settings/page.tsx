'use client';

import { Layout, Header } from '@/components/layout';
import { CompanyList } from '@/components/settings';
import { Download, Upload, Building2 } from 'lucide-react';
import { exportAllData, importAllData } from '@/lib/db';
import { useI18n } from '@/lib/i18n';

export default function SettingsPage() {
  const { t } = useI18n();

  const handleExport = async () => {
    try {
      const data = await exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sollai-invoice-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('导出失败，请重试');
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
        await importAllData(data);
        alert('导入成功！请刷新页面查看数据。');
        window.location.reload();
      } catch (error) {
        console.error('Import failed:', error);
        alert('导入失败，请检查文件格式');
      }
    };
    input.click();
  };

  return (
    <Layout>
      <Header title={t('settings.title')} />

      <div className="p-4 md:p-6 space-y-6">
        {/* Company List Section */}
        <section>
          <CompanyList />
        </section>

        {/* Data Management Section */}
        <section>
          <h2 className="text-base font-semibold text-foreground mb-4">{t('data.title')}</h2>
          <div className="bg-card rounded-lg border border-border divide-y divide-border">
            <button
              onClick={handleExport}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Upload className="w-5 h-5 text-green-600 dark:text-green-400" />
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
                <p className="text-sm font-semibold text-foreground">SollAI Invoice</p>
                <p className="text-xs text-muted-foreground">{t('about.version')} 1.0.0</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {t('about.description')}
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
}
