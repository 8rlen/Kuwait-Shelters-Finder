import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher({ compact = false }) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const toggle = () => {
    const next = isAr ? 'en' : 'ar';
    i18n.changeLanguage(next);
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
    document.body.dir = next === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = next;
  };

  if (compact) {
    return (
      <button
        onClick={toggle}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
        style={{
          background: 'rgba(245,158,11,0.12)',
          border: '1px solid rgba(245,158,11,0.25)',
          color: '#F59E0B',
        }}
        aria-label="Switch language"
      >
        {isAr ? 'EN' : 'ع'}
      </button>
    );
  }

  return (
    <div
      className="flex rounded-lg overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.15)' }}
    >
      <button
        onClick={() => { if (!isAr) toggle(); }}
        className="px-4 py-2 text-sm font-semibold transition-all"
        style={{
          background: isAr ? 'rgba(245,158,11,0.2)' : 'transparent',
          color: isAr ? '#F59E0B' : 'rgba(255,255,255,0.5)',
          fontFamily: "'Cairo', sans-serif",
        }}
      >
        العربية
      </button>
      <button
        onClick={() => { if (isAr) toggle(); }}
        className="px-4 py-2 text-sm font-semibold transition-all"
        style={{
          background: !isAr ? 'rgba(245,158,11,0.2)' : 'transparent',
          color: !isAr ? '#F59E0B' : 'rgba(255,255,255,0.5)',
        }}
      >
        English
      </button>
    </div>
  );
}
