'use client';

interface LogoProps {
  variant?: 'icon' | 'full' | 'wordmark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  sm: { icon: 24, text: 14 },
  md: { icon: 32, text: 18 },
  lg: { icon: 48, text: 24 },
  xl: { icon: 64, text: 32 },
};

export function Logo({ variant = 'full', size = 'md', className = '' }: LogoProps) {
  const { icon: iconSize, text: textSize } = sizes[size];

  const IconMark = () => (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      {/* Background gradient circle */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <linearGradient id="logoGradient2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>

      {/* Main shape - Abstract S with AI spark */}
      <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#logoGradient)" />

      {/* S letter path */}
      <path
        d="M28 16H20C17.7909 16 16 17.7909 16 20V20C16 22.2091 17.7909 24 20 24H28C30.2091 24 32 25.7909 32 28V28C32 30.2091 30.2091 32 28 32H20"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* AI dot/spark */}
      <circle cx="35" cy="13" r="4" fill="white" opacity="0.9" />
      <circle cx="35" cy="13" r="2" fill="url(#logoGradient)" />
    </svg>
  );

  const IconMarkAlt = () => (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>

      {/* Rounded square */}
      <rect x="4" y="4" width="40" height="40" rx="10" fill="url(#grad1)" />

      {/* Document lines */}
      <rect x="14" y="14" width="14" height="2" rx="1" fill="white" opacity="0.9" />
      <rect x="14" y="20" width="20" height="2" rx="1" fill="white" opacity="0.7" />
      <rect x="14" y="26" width="16" height="2" rx="1" fill="white" opacity="0.5" />

      {/* Checkmark */}
      <path
        d="M28 30L32 34L38 26"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );

  const Wordmark = () => (
    <span
      className="font-bold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
      style={{ fontSize: textSize }}
    >
      SollAI
    </span>
  );

  if (variant === 'icon') {
    return (
      <div className={className}>
        <IconMark />
      </div>
    );
  }

  if (variant === 'wordmark') {
    return (
      <div className={className}>
        <Wordmark />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <IconMark />
      <Wordmark />
    </div>
  );
}

// Alternative modern logo designs
export function LogoModern({ size = 'md', className = '' }: Omit<LogoProps, 'variant'>) {
  const { icon: iconSize, text: textSize } = sizes[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="modernGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0EA5E9" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
        </defs>

        {/* Hexagon shape */}
        <path
          d="M24 4L42 14V34L24 44L6 34V14L24 4Z"
          fill="url(#modernGrad)"
        />

        {/* Inner lightning bolt - representing speed/AI */}
        <path
          d="M26 14L18 26H24L22 34L30 22H24L26 14Z"
          fill="white"
        />
      </svg>

      <span
        className="font-bold tracking-tight"
        style={{ fontSize: textSize }}
      >
        <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
          Soll
        </span>
        <span className="text-foreground">AI</span>
      </span>
    </div>
  );
}

// Minimalist geometric logo
export function LogoMinimal({ size = 'md', className = '' }: Omit<LogoProps, 'variant'>) {
  const { icon: iconSize, text: textSize } = sizes[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="minimalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#000000" className="dark:stop-color-white" />
            <stop offset="100%" stopColor="#374151" className="dark:stop-color-gray-300" />
          </linearGradient>
        </defs>

        {/* Abstract S made of circles */}
        <circle cx="16" cy="16" r="10" className="fill-foreground" />
        <circle cx="32" cy="32" r="10" className="fill-foreground" />
        <rect x="16" y="16" width="16" height="16" className="fill-foreground" />

        {/* Cutouts */}
        <circle cx="16" cy="16" r="5" className="fill-background" />
        <circle cx="32" cy="32" r="5" className="fill-background" />
      </svg>

      <span
        className="font-semibold tracking-tight text-foreground"
        style={{ fontSize: textSize }}
      >
        SollAI
      </span>
    </div>
  );
}

// Animated gradient logo
export function LogoAnimated({ size = 'md', className = '' }: Omit<LogoProps, 'variant'>) {
  const { icon: iconSize, text: textSize } = sizes[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className="relative rounded-xl overflow-hidden"
        style={{ width: iconSize, height: iconSize }}
      >
        {/* Animated gradient background */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 animate-pulse"
          style={{ animationDuration: '3s' }}
        />

        {/* Icon overlay */}
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          {/* S shape */}
          <path
            d="M30 14H22C18.6863 14 16 16.6863 16 20C16 23.3137 18.6863 26 22 26H26C29.3137 26 32 28.6863 32 32C32 35.3137 29.3137 38 26 38H18"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />

          {/* Sparkle dots */}
          <circle cx="36" cy="12" r="3" fill="white" />
          <circle cx="12" cy="36" r="2" fill="white" opacity="0.6" />
        </svg>
      </div>

      <span
        className="font-bold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
        style={{ fontSize: textSize }}
      >
        SollAI
      </span>
    </div>
  );
}
