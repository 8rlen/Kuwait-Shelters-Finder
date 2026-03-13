import { useTranslation } from 'react-i18next';

const CONTACTS = [
  { key: 'general', icon: '🆘', color: '#DC2626', bgColor: 'rgba(220,38,38,0.15)' },
  { key: 'civilDefense', icon: '🛡️', color: '#007A3D', bgColor: 'rgba(0,122,61,0.15)' },
  { key: 'police', icon: '👮', color: '#3B82F6', bgColor: 'rgba(59,130,246,0.15)' },
  { key: 'ambulance', icon: '🚑', color: '#10B981', bgColor: 'rgba(16,185,129,0.15)' },
  { key: 'moiHotline', icon: '📞', color: '#8B5CF6', bgColor: 'rgba(139,92,246,0.15)', labelOverride: 'MOI Hotline' },
];

function ContactCard({ contact, t }) {
  const number = t(`emergency.numbers.${contact.key}`);
  const label = contact.labelOverride
    ? (document.documentElement.dir === 'rtl' ? 'خط وزارة الداخلية' : contact.labelOverride)
    : t(`emergency.${contact.key === 'moiHotline' ? 'moi' : contact.key}`);

  return (
    <a
      href={`tel:${number}`}
      className="flex items-center gap-4 p-4 rounded-xl transition-all active:scale-95"
      style={{
        background: contact.bgColor,
        border: `1px solid ${contact.color}30`,
        textDecoration: 'none',
      }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0"
        style={{ background: `${contact.color}20` }}
      >
        {contact.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div
          className="font-semibold text-white text-sm"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          {label}
        </div>
        <div
          className="font-bold mt-0.5"
          style={{ color: contact.color, fontSize: '1.4rem', direction: 'ltr', fontFamily: 'Inter, monospace' }}
        >
          {number}
        </div>
      </div>
      <svg width="20" height="20" viewBox="0 0 24 24" fill={contact.color} className="shrink-0 opacity-60">
        <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
      </svg>
    </a>
  );
}

export default function EmergencyContacts({ onClose }) {
  const { t } = useTranslation();

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl animate-slide-up sm:animate-fade-in"
        style={{ background: '#0d1f3c', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2
            className="text-white font-bold text-lg"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            {t('emergency.title')}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)' }}
            aria-label={t('actions.close')}
          >
            ✕
          </button>
        </div>

        {/* Contacts */}
        <div className="p-4 flex flex-col gap-3">
          {CONTACTS.map((c) => (
            <ContactCard key={c.key} contact={c} t={t} />
          ))}
        </div>

        {/* Note */}
        <div className="px-4 pb-4">
          <p
            className="text-white/30 text-xs text-center"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            {document.documentElement.dir === 'rtl'
              ? 'اضغط على الرقم للاتصال مباشرة'
              : 'Tap a number to call directly'}
          </p>
        </div>
      </div>
    </div>
  );
}
