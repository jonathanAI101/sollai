'use client';

import Link from 'next/link';
import { FileText, Shield, Zap, Download, ArrowRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { ThemeLanguageToggle } from '@/components/layout';

export default function LandingPage() {
  const { t } = useI18n();

  const features = [
    {
      icon: Zap,
      titleKey: 'landing.feature1.title',
      descKey: 'landing.feature1.desc',
    },
    {
      icon: Shield,
      titleKey: 'landing.feature2.title',
      descKey: 'landing.feature2.desc',
    },
    {
      icon: Download,
      titleKey: 'landing.feature3.title',
      descKey: 'landing.feature3.desc',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">SollAI</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeLanguageToggle />
            <Link
              href="/invoice"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('landing.login')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight">
            {t('landing.hero.title')}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {t('landing.hero.subtitle')}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/invoice"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              {t('landing.cta.start')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center md:text-left">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto md:mx-0 mb-4">
                    <Icon className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(feature.descKey)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Simple CTA Section */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {t('landing.cta.title')}
          </h2>
          <p className="text-muted-foreground mb-8">
            {t('landing.cta.subtitle')}
          </p>
          <Link
            href="/invoice"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            {t('landing.cta.start')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="w-4 h-4" />
            <span>SollAI Invoice</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {t('landing.footer.privacy')}
          </p>
        </div>
      </footer>
    </div>
  );
}
