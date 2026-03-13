import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LOGOS = [
  {
    key: 'moi',
    url: 'https://www.moi.gov.kw/images/logo.png',
    nameAr: 'وزارة الداخلية الكويتية',
    nameEn: 'Kuwait Ministry of Interior',
  },
  {
    key: 'cd',
    url: 'https://www.moi.gov.kw/images/cd-logo.png',
    nameAr: 'الدفاع المدني',
    nameEn: 'Kuwait Civil Defense',
  },
  {
    key: 'egov',
    url: 'https://www.e.gov.kw/sites/kgoenglish/PublishingImages/Logo.png',
    nameAr: 'بوابة الحكومة الإلكترونية',
    nameEn: 'Kuwait e-Government',
  },
];

function Logo({ logo }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="flex flex-col items-center gap-2">
      {!failed ? (
        <img
          src={logo.url}
          alt={logo.nameEn}
          className="h-14 object-contain filter brightness-0 invert opacity-80"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="text-amber-400 font-bold text-sm text-center px-3 py-2 border border-amber-400/30 rounded-lg bg-amber-400/5">
          {logo.nameAr}
        </div>
      )}
      <span className="text-white/50 text-xs text-center leading-tight hidden">
        {logo.nameAr}
      </span>
    </div>
  );
}

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
        background: 'linear-gradient(135deg, #0A1628 0%, #0d1f3c 50%, #0A1628 100%)',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.6s ease-out',
      }}
    >
      {/* Stars background effect */}
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
              opacity: Math.random() * 0.4 + 0.1,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-10 px-8 text-center animate-fade-in">
        {/* Dua */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="text-amber-400 font-bold leading-relaxed"
            style={{
              fontFamily: "'Cairo', serif",
              fontSize: 'clamp(1.6rem, 5vw, 2.8rem)',
              textShadow: '0 0 40px rgba(245, 158, 11, 0.3)',
              letterSpacing: '0.02em',
              lineHeight: '1.6',
              direction: 'rtl',
            }}
          >
            {t('splash.dua')}
          </div>
          <div
            className="w-24 h-0.5 rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent, #F59E0B, transparent)' }}
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

        {/* Logos */}
        <div className="flex items-center justify-center gap-8 flex-wrap mt-2">
          {LOGOS.map((logo) => (
            <Logo key={logo.key} logo={logo} />
          ))}
        </div>

        {/* Enter button */}
        <button
          onClick={handleDismiss}
          className="mt-4 px-10 py-3 rounded-full font-semibold text-navy transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            fontFamily: "'Cairo', sans-serif",
            fontSize: '1rem',
            color: '#0A1628',
            boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)',
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

      {/* Bottom glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(245,158,11,0.05), transparent)',
        }}
      />
    </div>
  );
}
