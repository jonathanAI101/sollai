'use client';

import { useState, useEffect } from 'react';
import { Layout, Header } from '@/components/layout';
import { Download, Upload, Building2, Globe, FileText } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { db } from '@/lib/supabase/hooks';

export default function SettingsPage() {
  const { t, language, setLanguage } = useI18n();
  const [invoicePrefix, setInvoicePrefix] = useState('INV');
  const [invoicePadding, setInvoicePadding] = useState(4);
  const [invoiceFormat, setInvoiceFormat] = useState('{prefix}-{year}-{number}');
  const [previewNumber, setPreviewNumber] = useState('');

  useEffect(() => {
    db.invoices.previewNextNumber(invoicePrefix)
      .then(setPreviewNumber)
      .catch(() => {
        // Generate local preview if DB not ready
        const year = new Date().getFullYear();
        const num = '1'.padStart(invoicePadding, '0');
        setPreviewNumber(invoiceFormat.replace('{prefix}', invoicePrefix).replace('{year}', String(year)).replace('{number}', num));
      });
  }, [invoicePrefix, invoicePadding, invoiceFormat]);

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

        {/* Invoice Number Settings */}
        <section>
          <h2 className="text-base font-semibold text-foreground mb-4">
            {language === 'zh' ? '发票编号格式' : 'Invoice Number Format'}
          </h2>
          <div className="bg-card rounded-lg border border-border p-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  {language === 'zh' ? '前缀' : 'Prefix'}
                </label>
                <input
                  type="text"
                  value={invoicePrefix}
                  onChange={(e) => setInvoicePrefix(e.target.value.toUpperCase())}
                  maxLength={10}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="INV"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  {language === 'zh' ? '编号位数' : 'Padding'}
                </label>
                <select
                  value={invoicePadding}
                  onChange={(e) => setInvoicePadding(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={3}>3 (001)</option>
                  <option value={4}>4 (0001)</option>
                  <option value={5}>5 (00001)</option>
                  <option value={6}>6 (000001)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  {language === 'zh' ? '格式' : 'Format'}
                </label>
                <select
                  value={invoiceFormat}
                  onChange={(e) => setInvoiceFormat(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="{prefix}-{year}-{number}">{invoicePrefix}-2026-0001</option>
                  <option value="{prefix}{year}{number}">{invoicePrefix}20260001</option>
                  <option value="{prefix}-{number}">{invoicePrefix}-0001</option>
                  <option value="{year}-{prefix}-{number}">2026-{invoicePrefix}-0001</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
              <FileText className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">
                  {language === 'zh' ? '下一个发票编号预览' : 'Next invoice number preview'}
                </p>
                <p className="text-sm font-mono font-medium text-foreground">{previewNumber}</p>
              </div>
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
