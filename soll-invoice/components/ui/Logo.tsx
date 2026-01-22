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

// Minimalist geometric logo - Refined version
export function LogoMinimal({ size = 'md', className = '' }: Omit<LogoProps, 'variant'>) {
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
        {/* Rounded square container */}
        <rect x="4" y="4" width="40" height="40" rx="12" className="fill-foreground" />

        {/* Elegant S path - negative space */}
        <path
          d="M28 14H18C15.2386 14 13 16.2386 13 19C13 21.7614 15.2386 24 18 24H30C32.7614 24 35 26.2386 35 29C35 31.7614 32.7614 34 30 34H20"
          className="stroke-background"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Accent dot */}
        <circle cx="37" cy="11" r="4" className="fill-background" />
      </svg>

      <div className="flex items-baseline">
        <span
          className="font-bold tracking-tight text-foreground"
          style={{ fontSize: textSize }}
        >
          Soll
        </span>
        <span
          className="font-bold tracking-tight text-foreground/60"
          style={{ fontSize: textSize }}
        >
          AI
        </span>
      </div>
    </div>
  );
}

// Ultra minimal - just lettermark
export function LogoUltraMinimal({ size = 'md', className = '' }: Omit<LogoProps, 'variant'>) {
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
        {/* Clean rounded square */}
        <rect x="4" y="4" width="40" height="40" rx="10" className="fill-foreground" />

        {/* Bold S */}
        <text
          x="24"
          y="33"
          textAnchor="middle"
          className="fill-background"
          style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'system-ui' }}
        >
          S
        </text>
      </svg>

      <span
        className="font-bold tracking-tight text-foreground"
        style={{ fontSize: textSize }}
      >
        SollAI
      </span>
    </div>
  );
}

// Outline style - modern & light
export function LogoOutline({ size = 'md', className = '' }: Omit<LogoProps, 'variant'>) {
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
        {/* Outline square */}
        <rect
          x="6"
          y="6"
          width="36"
          height="36"
          rx="10"
          className="stroke-foreground"
          strokeWidth="2.5"
          fill="none"
        />

        {/* S path */}
        <path
          d="M27 15H21C18.7909 15 17 16.7909 17 19C17 21.2091 18.7909 23 21 23H27C29.2091 23 31 24.7909 31 27C31 29.2091 29.2091 31 27 31H21"
          className="stroke-foreground"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Dot accent */}
        <circle cx="35" cy="13" r="3" className="fill-foreground" />
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

// Split style - two-tone modern
export function LogoSplit({ size = 'md', className = '' }: Omit<LogoProps, 'variant'>) {
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
        {/* Left half - dark */}
        <path
          d="M8 14C8 10.6863 10.6863 8 14 8H24V40H14C10.6863 40 8 37.3137 8 34V14Z"
          className="fill-foreground"
        />

        {/* Right half - accent */}
        <path
          d="M24 8H34C37.3137 8 40 10.6863 40 14V34C40 37.3137 37.3137 40 34 40H24V8Z"
          className="fill-foreground/30"
        />

        {/* S spanning both */}
        <path
          d="M28 16H20C17.7909 16 16 17.7909 16 20C16 22.2091 17.7909 24 20 24H28C30.2091 24 32 25.7909 32 28C32 30.2091 30.2091 32 28 32H20"
          stroke="white"
          className="stroke-background"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      <span
        className="font-bold tracking-tight text-foreground"
        style={{ fontSize: textSize }}
      >
        SollAI
      </span>
    </div>
  );
}

// Snake eating dot - 贪吃蛇风格
export function LogoSnake({ size = 'md', className = '' }: Omit<LogoProps, 'variant'>) {
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
        {/* Background */}
        <rect x="4" y="4" width="40" height="40" rx="12" className="fill-foreground" />

        {/* Snake body - S curve with gradient segments */}
        <path
          d="M14 14C14 14 14 20 20 20C26 20 26 24 26 24C26 24 26 28 32 28C38 28 38 34 38 34"
          className="stroke-background"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Snake head - slightly larger, facing the dot */}
        <circle cx="38" cy="34" r="5" className="fill-background" />

        {/* Snake eye */}
        <circle cx="39.5" cy="32.5" r="1.5" className="fill-foreground" />

        {/* Food dot - the target */}
        <circle cx="38" cy="42" r="3" className="fill-background animate-pulse" />
      </svg>

      <span
        className="font-bold tracking-tight text-foreground"
        style={{ fontSize: textSize }}
      >
        SollAI
      </span>
    </div>
  );
}

// Snake V2 - more playful with tongue
export function LogoSnake2({ size = 'md', className = '' }: Omit<LogoProps, 'variant'>) {
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
          <linearGradient id="snakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#snakeGrad)" />

        {/* Snake S body */}
        <path
          d="M12 12H24C28 12 30 14 30 18C30 22 28 24 24 24C20 24 18 26 18 30C18 34 20 36 24 36H30"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Snake head */}
        <circle cx="34" cy="36" r="5" fill="white" />

        {/* Eyes */}
        <circle cx="35" cy="34.5" r="1.5" fill="#059669" />

        {/* Target dot */}
        <circle cx="42" cy="36" r="3" fill="white" opacity="0.7" />
      </svg>

      <span
        className="font-bold tracking-tight"
        style={{ fontSize: textSize }}
      >
        <span className="text-emerald-500">Soll</span>
        <span className="text-foreground">AI</span>
      </span>
    </div>
  );
}

// Snake V3 - minimal black/white, classic snake game feel - ANIMATED
export function LogoSnake3({ size = 'md', className = '' }: Omit<LogoProps, 'variant'>) {
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
        <style>
          {`
            @keyframes snakeMove1 { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
            @keyframes snakeMove2 { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; } }
            @keyframes snakeMove3 { 0%, 100% { opacity: 0.6; } 50% { opacity: 0.9; } }
            @keyframes snakeMove4 { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
            @keyframes snakeMove5 { 0%, 100% { opacity: 0.9; } 50% { opacity: 0.6; } }
            @keyframes headBob { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(1px, -1px); } }
            @keyframes foodPulse { 0%, 100% { r: 4; opacity: 1; } 50% { r: 3; opacity: 0.6; } }
            @keyframes eyeBlink { 0%, 90%, 100% { opacity: 1; } 95% { opacity: 0; } }
            .seg1 { animation: snakeMove1 1.5s ease-in-out infinite; }
            .seg2 { animation: snakeMove2 1.5s ease-in-out infinite 0.1s; }
            .seg3 { animation: snakeMove3 1.5s ease-in-out infinite 0.2s; }
            .seg4 { animation: snakeMove4 1.5s ease-in-out infinite 0.3s; }
            .seg5 { animation: snakeMove5 1.5s ease-in-out infinite 0.4s; }
            .head { animation: headBob 0.8s ease-in-out infinite; }
            .food { animation: foodPulse 1.2s ease-in-out infinite; }
            .eye { animation: eyeBlink 3s ease-in-out infinite; }
          `}
        </style>

        {/* Clean background */}
        <rect x="4" y="4" width="40" height="40" rx="10" className="fill-foreground" />

        {/* Pixel-style snake body segments - animated sequentially */}
        <rect x="10" y="10" width="8" height="8" rx="2" className="fill-background seg1" />
        <rect x="16" y="14" width="8" height="8" rx="2" className="fill-background seg2" />
        <rect x="20" y="20" width="8" height="8" rx="2" className="fill-background seg3" />
        <rect x="18" y="26" width="8" height="8" rx="2" className="fill-background seg4" />
        <rect x="24" y="30" width="8" height="8" rx="2" className="fill-background seg5" />

        {/* Snake head - bobbing */}
        <g className="head">
          <rect x="30" y="30" width="10" height="10" rx="3" className="fill-background" />
          <circle cx="37" cy="33" r="2" className="fill-foreground eye" />
        </g>

        {/* Food dot - pulsing */}
        <circle cx="38" cy="14" r="4" className="fill-background food" />
      </svg>

      <span
        className="font-bold tracking-tight text-foreground"
        style={{ fontSize: textSize }}
      >
        SollAI
      </span>
    </div>
  );
}

// Snake V4 - smooth flowing S with chasing dot
export function LogoSnake4({ size = 'md', className = '' }: Omit<LogoProps, 'variant'>) {
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
        {/* Soft background */}
        <rect x="4" y="4" width="40" height="40" rx="12" className="fill-foreground" />

        {/* Smooth snake S - tapered body */}
        <path
          d="M30 10C30 10 36 10 36 16C36 22 30 22 24 22C18 22 12 22 12 28C12 34 18 38 24 38"
          className="stroke-background"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Tail - thinner */}
        <path
          d="M30 10L34 8"
          className="stroke-background"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Head - larger end */}
        <circle cx="28" cy="38" r="5" className="fill-background" />

        {/* Eye */}
        <circle cx="30" cy="36.5" r="1.5" className="fill-foreground" />

        {/* Target food - about to be eaten! */}
        <circle cx="36" cy="38" r="3.5" className="fill-background opacity-60" />
      </svg>

      <span
        className="font-bold tracking-tight text-foreground"
        style={{ fontSize: textSize }}
      >
        SollAI
      </span>
    </div>
  );
}

// Snake V5 - abstract elegant, S eating O
export function LogoSnakeEat({ size = 'md', className = '' }: Omit<LogoProps, 'variant'>) {
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
          <linearGradient id="snakeEatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#snakeEatGrad)" />

        {/* S-shaped snake with open mouth */}
        <path
          d="M12 14C12 14 12 14 18 14C24 14 28 14 28 20C28 26 24 26 20 26C16 26 12 26 12 32C12 38 18 38 24 38"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Open mouth shape */}
        <path
          d="M24 38C24 38 30 36 32 38C34 40 30 42 24 42"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Target ball being eaten */}
        <circle cx="38" cy="38" r="4" fill="white" />

        {/* Eye on the curve */}
        <circle cx="26" cy="18" r="2" fill="white" />
        <circle cx="26.5" cy="17.5" r="1" fill="#3B82F6" />
      </svg>

      <span
        className="font-bold tracking-tight"
        style={{ fontSize: textSize }}
      >
        <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Soll</span>
        <span className="text-foreground">AI</span>
      </span>
    </div>
  );
}

// Stacked/Badge style
export function LogoBadge({ size = 'md', className = '' }: Omit<LogoProps, 'variant'>) {
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
        {/* Outer ring */}
        <circle cx="24" cy="24" r="20" className="stroke-foreground" strokeWidth="2" fill="none" />

        {/* Inner filled circle */}
        <circle cx="24" cy="24" r="14" className="fill-foreground" />

        {/* S letter */}
        <path
          d="M27 18H22C20.3431 18 19 19.3431 19 21C19 22.6569 20.3431 24 22 24H26C27.6569 24 29 25.3431 29 27C29 28.6569 27.6569 30 26 30H21"
          className="stroke-background"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      <span
        className="font-bold tracking-tight text-foreground"
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
