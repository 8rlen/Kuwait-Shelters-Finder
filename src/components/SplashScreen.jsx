import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function SplashScreen({ onDismiss }) {
  const { t } = useTranslation();
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => handleDismiss(), 3500);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setFading(true);
    setTimeout(onDismiss, 600);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(160deg, #0A1628 0%, #0d1f3c 60%, #071020 100%)',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.6s ease-out',
      }}
    >
      {/* Kuwait flag stripe accent - top */}
      <div className="absolute top-0 left-0 right-0 flex h-1.5">
        <div className="flex-1" style={{ background: '#007A3D' }} />
        <div className="flex-1" style={{ background: '#FFFFFF' }} />
        <div className="flex-1" style={{ background: '#CE1126' }} />
        <div className="w-12" style={{ background: '#000000' }} />
      </div>

      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.35 + 0.05,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-10 px-8 text-center animate-fade-in">

        {/* Shield icon */}
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 80,
            height: 80,
            background: 'linear-gradient(135deg, rgba(0,122,61,0.2), rgba(0,122,61,0.05))',
            border: '1px solid rgba(0,122,61,0.4)',
            boxShadow: '0 0 40px rgba(0,122,61,0.15)',
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"
              fill="rgba(0,122,61,0.3)"
              stroke="#007A3D"
              strokeWidth="1.5"
            />
            <path d="M9 12l2 2 4-4" stroke="#007A3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Dua */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="font-bold leading-relaxed"
            style={{
              fontFamily: "'Cairo', serif",
              fontSize: 'clamp(1.5rem, 4.5vw, 2.6rem)',
              color: '#7FD4A8',
              textShadow: '0 0 40px rgba(0,122,61,0.3)',
              letterSpacing: '0.02em',
              lineHeight: '1.65',
              direction: 'rtl',
            }}
          >
            {t('splash.dua')}
          </div>
          <div
            className="w-24 h-0.5 rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent, #007A3D, transparent)' }}
          />
        </div>

        {/* App name */}
        <div className="flex flex-col items-center gap-1">
          <h1
            className="text-white font-bold"
            style={{
              fontFamily: "'Cairo', sans-serif",
              fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
            }}
          >
            {t('app.name')}
          </h1>
          <p className="text-white/40 text-sm">{t('app.tagline')}</p>
        </div>

        {/* Enter button */}
        <button
          onClick={handleDismiss}
          className="mt-2 px-10 py-3 rounded-full font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #007A3D, #005C2E)',
            fontFamily: "'Cairo', sans-serif",
            fontSize: '1rem',
            color: '#FFFFFF',
            boxShadow: '0 4px 24px rgba(0,122,61,0.45)',
            border: '1px solid rgba(0,122,61,0.6)',
          }}
        >
          {t('splash.enter')}
        </button>

        {/* Attribution */}
        <p
          className="text-white/25 text-xs mt-2"
          style={{ direction: 'rtl' }}
        >
          {t('footer.dataSource')}
        </p>
      </div>

      {/* Bottom flag stripe */}
      <div className="absolute bottom-0 left-0 right-0 flex h-1">
        <div className="flex-1" style={{ background: '#007A3D' }} />
        <div className="flex-1" style={{ background: '#FFFFFF' }} />
        <div className="flex-1" style={{ background: '#CE1126' }} />
        <div className="w-12" style={{ background: '#000000' }} />
      </div>
    </div>
  );
}
