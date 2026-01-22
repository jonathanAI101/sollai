'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Globe, Users, Search, BarChart3, FileText, Handshake, DollarSign, Calendar, Zap } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { ThemeLanguageToggle } from '@/components/layout';
import { LogoSnake3 } from '@/components/ui/Logo';

export default function LandingPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/">
            <LogoSnake3 size="md" />
          </Link>
          <div className="flex items-center gap-4">
            <ThemeLanguageToggle />
            <Link
              href="/invoice"
              className="hidden sm:inline-flex text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('landing.login')}
            </Link>
            <Link
              href="/invoice"
              className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              {t('landing.cta.start')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            {t('landing.badge')}
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight leading-[1.1]">
            {t('landing.hero.title')}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('landing.hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/invoice"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all hover:scale-[1.02]"
            >
              {t('landing.cta.start')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-foreground font-medium rounded-xl hover:bg-secondary/80 transition-colors"
            >
              {t('landing.cta.learn')}
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              {t('landing.trust.ai')}
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-green-500" />
              {t('landing.trust.global')}
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              {t('landing.trust.fast')}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 px-6 border-t border-border bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm text-muted-foreground mb-6">{t('landing.social.title')}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-foreground">50+</p>
              <p className="text-sm text-muted-foreground mt-1">{t('landing.social.brands')}</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-foreground">1K+</p>
              <p className="text-sm text-muted-foreground mt-1">{t('landing.social.campaigns')}</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-foreground">50+</p>
              <p className="text-sm text-muted-foreground mt-1">{t('landing.social.countries')}</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-foreground">200%</p>
              <p className="text-sm text-muted-foreground mt-1">{t('landing.social.roi')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {t('landing.features.title')}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Feature 1 - Find Creators */}
            <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t('landing.feature1.title')}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('landing.feature1.desc')}
              </p>
            </div>

            {/* Feature 2 - Manage */}
            <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                <Handshake className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t('landing.feature2.title')}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('landing.feature2.desc')}
              </p>
            </div>

            {/* Feature 3 - Track */}
            <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t('landing.feature3.title')}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('landing.feature3.desc')}
              </p>
            </div>

            {/* Feature 4 - Offline Events */}
            <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t('landing.feature4.title')}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('landing.feature4.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 border-t border-border bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {t('landing.howItWorks.title')}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{t('landing.step1.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('landing.step1.desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{t('landing.step2.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('landing.step2.desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{t('landing.step3.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('landing.step3.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            {t('landing.cta.title')}
          </h2>
          <p className="text-muted-foreground mb-8">
            {t('landing.cta.subtitle')}
          </p>
          <Link
            href="/invoice"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all hover:scale-[1.02]"
          >
            {t('landing.cta.start')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <LogoSnake3 size="sm" />
          <p className="text-xs text-muted-foreground">
            {t('landing.footer.privacy')}
          </p>
        </div>
      </footer>
    </div>
  );
}
