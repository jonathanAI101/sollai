'use client';

import { Logo, LogoModern, LogoMinimal, LogoAnimated } from '@/components/ui/Logo';
import { ThemeLanguageToggle } from '@/components/layout';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LogoPreviewPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <ThemeLanguageToggle />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2">Logo Options</h1>
        <p className="text-muted-foreground mb-12">Select your preferred logo design</p>

        <div className="space-y-16">
          {/* Option 1: Gradient with S */}
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">Option 1: Gradient S</h2>
              <p className="text-sm text-muted-foreground">Modern gradient with abstract S letter and AI spark</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-card border border-border flex flex-col items-center gap-4">
                <Logo variant="icon" size="xl" />
                <span className="text-xs text-muted-foreground">Icon XL</span>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border flex flex-col items-center gap-4">
                <Logo variant="icon" size="lg" />
                <span className="text-xs text-muted-foreground">Icon LG</span>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border flex flex-col items-center gap-4">
                <Logo variant="icon" size="md" />
                <span className="text-xs text-muted-foreground">Icon MD</span>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border flex flex-col items-center gap-4">
                <Logo variant="icon" size="sm" />
                <span className="text-xs text-muted-foreground">Icon SM</span>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-card border border-border flex items-center justify-center">
              <Logo variant="full" size="xl" />
            </div>

            {/* Dark preview */}
            <div className="p-8 rounded-2xl bg-zinc-900 flex items-center justify-center">
              <Logo variant="full" size="xl" />
            </div>
          </section>

          {/* Option 2: Hexagon Lightning */}
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">Option 2: Hexagon Lightning</h2>
              <p className="text-sm text-muted-foreground">Hexagonal shape with lightning bolt - represents speed and AI power</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 rounded-2xl bg-card border border-border flex items-center justify-center">
                <LogoModern size="xl" />
              </div>
              <div className="p-8 rounded-2xl bg-zinc-900 flex items-center justify-center">
                <LogoModern size="xl" />
              </div>
            </div>

            <div className="flex items-center gap-8 p-6 rounded-2xl bg-card border border-border justify-center">
              <LogoModern size="sm" />
              <LogoModern size="md" />
              <LogoModern size="lg" />
              <LogoModern size="xl" />
            </div>
          </section>

          {/* Option 3: Minimal Geometric */}
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">Option 3: Minimal Geometric</h2>
              <p className="text-sm text-muted-foreground">Clean, abstract S shape - professional and timeless</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 rounded-2xl bg-card border border-border flex items-center justify-center">
                <LogoMinimal size="xl" />
              </div>
              <div className="p-8 rounded-2xl bg-zinc-900 flex items-center justify-center">
                <LogoMinimal size="xl" />
              </div>
            </div>
          </section>

          {/* Option 4: Animated */}
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">Option 4: Animated Gradient</h2>
              <p className="text-sm text-muted-foreground">Subtle pulse animation with gradient - dynamic and modern</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 rounded-2xl bg-card border border-border flex items-center justify-center">
                <LogoAnimated size="xl" />
              </div>
              <div className="p-8 rounded-2xl bg-zinc-900 flex items-center justify-center">
                <LogoAnimated size="xl" />
              </div>
            </div>
          </section>

          {/* Usage Examples */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Usage Examples</h2>

            {/* Header mockup */}
            <div className="rounded-2xl border border-border overflow-hidden">
              <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
                <LogoModern size="md" />
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Features</span>
                  <span className="text-sm text-muted-foreground">Pricing</span>
                  <span className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg">Get Started</span>
                </div>
              </div>
              <div className="bg-secondary/30 h-48 flex items-center justify-center">
                <p className="text-muted-foreground">Page Content</p>
              </div>
            </div>

            {/* App icon mockup */}
            <div className="flex items-center gap-8 justify-center p-8">
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg mb-2">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path
                      d="M28 16H20C17.7909 16 16 17.7909 16 20V20C16 22.2091 17.7909 24 20 24H28C30.2091 24 32 25.7909 32 28V28C32 30.2091 30.2091 32 28 32H20"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <circle cx="35" cy="13" r="4" fill="white" opacity="0.9" />
                  </svg>
                </div>
                <span className="text-xs text-muted-foreground">iOS App Icon</span>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md mb-2">
                  <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
                    <path
                      d="M28 16H20C17.7909 16 16 17.7909 16 20V20C16 22.2091 17.7909 24 20 24H28C30.2091 24 32 25.7909 32 28V28C32 30.2091 30.2091 32 28 32H20"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <circle cx="35" cy="13" r="4" fill="white" opacity="0.9" />
                  </svg>
                </div>
                <span className="text-xs text-muted-foreground">Favicon</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
