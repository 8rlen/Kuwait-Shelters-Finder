import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const REPORT_EMAIL = 'shelters@example.com'; // configurable

export default function PanicButton({ userCoords }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const getLocationUrl = () => {
    if (!userCoords) return window.location.href;
    return `https://maps.google.com/maps?q=${userCoords.lat},${userCoords.lng}`;
  };

  const getShareMessage = () => {
    const url = getLocationUrl();
    return `${t('panic.shareMessage')}${url}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getLocationUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = getLocationUrl();
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(getShareMessage());
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const handleSMS = () => {
    const msg = encodeURIComponent(getShareMessage());
    window.open(`sms:?body=${msg}`, '_blank');
  };

  return (
    <>
      {/* Panic button — always visible */}
      <button
        onClick={() => setOpen(true)}
        className="panic-button"
        aria-label={t('panic.button')}
      >
        <span className="flex items-center gap-2 justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          {t('panic.button')}
        </span>
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[1200] flex items-end sm:items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div
            className="w-full max-w-sm rounded-2xl shadow-2xl animate-slide-up"
            style={{ background: '#0d1f3c', border: '1px solid rgba(220,38,38,0.3)' }}
          >
            {/* Header */}
            <div
              className="p-5 rounded-t-2xl text-center"
              style={{ background: 'rgba(220,38,38,0.15)', borderBottom: '1px solid rgba(220,38,38,0.2)' }}
            >
              <div className="text-3xl mb-2">📍</div>
              <h2
                className="text-white font-bold text-lg"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                {t('panic.title')}
              </h2>
              <p className="text-white/60 text-sm mt-1" style={{ fontFamily: "'Cairo', sans-serif" }}>
                {t('panic.description')}
              </p>
            </div>

            {/* Location preview */}
            {userCoords && (
              <div
                className="mx-4 mt-4 p-3 rounded-xl text-center"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <p className="text-green-400 text-xs font-mono">
                  {userCoords.lat.toFixed(6)}, {userCoords.lng.toFixed(6)}
                </p>
                <a
                  href={getLocationUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 text-xs mt-1 block truncate hover:text-white/60"
                >
                  {getLocationUrl()}
                </a>
              </div>
            )}

            {/* Buttons */}
            <div className="p-4 flex flex-col gap-3">
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-3 py-3 rounded-xl font-semibold transition-all active:scale-95"
                style={{
                  background: copied ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)',
                  border: `1px solid ${copied ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.12)'}`,
                  color: copied ? '#10B981' : 'white',
                  fontFamily: "'Cairo', sans-serif",
                }}
              >
                {copied ? '✓ ' + t('actions.copied') : t('actions.copy')}
              </button>

              <button
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-3 py-3 rounded-xl font-semibold transition-all active:scale-95"
                style={{
                  background: 'rgba(37,211,102,0.15)',
                  border: '1px solid rgba(37,211,102,0.3)',
                  color: '#25D366',
                  fontFamily: "'Cairo', sans-serif",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t('actions.shareWhatsApp')}
              </button>

              <button
                onClick={handleSMS}
                className="flex items-center justify-center gap-3 py-3 rounded-xl font-semibold transition-all active:scale-95"
                style={{
                  background: 'rgba(59,130,246,0.12)',
                  border: '1px solid rgba(59,130,246,0.25)',
                  color: '#60A5FA',
                  fontFamily: "'Cairo', sans-serif",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
                {t('actions.shareSMS')}
              </button>
            </div>

            {/* Close */}
            <div className="px-4 pb-5">
              <button
                onClick={() => setOpen(false)}
                className="w-full py-3 rounded-xl text-white/50 font-semibold text-sm transition-all hover:text-white/70"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                {t('actions.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
