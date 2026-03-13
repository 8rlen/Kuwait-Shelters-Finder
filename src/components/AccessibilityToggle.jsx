import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function AccessibilityToggle({ highContrast, largeText, onHighContrastChange, onLargeTextChange }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          color: 'white',
        }}
        aria-label={t('accessibility.title')}
        title={t('accessibility.title')}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="4" r="2" />
          <path d="M15.89 8.11C15.5 7.72 14.83 7.5 14.27 7.5H9.73c-.56 0-1.23.22-1.62.61L5.28 10.9c-.78.78-.49 2.07.52 2.49L8 14.5V20h2v-5.5l-1.8-1.1 2.1-2.1 1.7 2.1V20h2v-6.1l1.7-2.1 2.1 2.1-1.8 1.1V20h2v-5.5l2.2-1.11c1.01-.42 1.3-1.71.52-2.49l-2.83-2.79z" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-12 z-50 p-4 rounded-xl shadow-2xl min-w-[220px]"
          style={{
            background: '#0d1f3c',
            border: '1px solid rgba(255,255,255,0.12)',
            right: document.documentElement.dir === 'rtl' ? 'auto' : '0',
            left: document.documentElement.dir === 'rtl' ? '0' : 'auto',
          }}
        >
          <h3
            className="text-white font-semibold mb-3 text-sm"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            {t('accessibility.title')}
          </h3>

          <label className="flex items-center justify-between gap-4 cursor-pointer mb-3">
            <span className="text-white/70 text-sm">{t('accessibility.highContrast')}</span>
            <div
              onClick={() => onHighContrastChange(!highContrast)}
              className="relative w-11 h-6 rounded-full transition-colors cursor-pointer"
              style={{ background: highContrast ? '#F59E0B' : 'rgba(255,255,255,0.15)' }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                style={{ transform: highContrast ? 'translateX(20px)' : 'translateX(2px)' }}
              />
            </div>
          </label>

          <label className="flex items-center justify-between gap-4 cursor-pointer">
            <span className="text-white/70 text-sm">{t('accessibility.largeText')}</span>
            <div
              onClick={() => onLargeTextChange(!largeText)}
              className="relative w-11 h-6 rounded-full transition-colors cursor-pointer"
              style={{ background: largeText ? '#F59E0B' : 'rgba(255,255,255,0.15)' }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                style={{ transform: largeText ? 'translateX(20px)' : 'translateX(2px)' }}
              />
            </div>
          </label>
        </div>
      )}
    </div>
  );
}
