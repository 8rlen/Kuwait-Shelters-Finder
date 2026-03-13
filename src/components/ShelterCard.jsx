import { useTranslation } from 'react-i18next';
import { formatDistance, formatDistanceEn, formatWalkTime, formatWalkTimeEn, formatDriveTime, formatDriveTimeEn } from '../hooks/useDistances';

const REPORT_EMAIL = 'shelters.report@example.com';
const REPORT_WHATSAPP = '96500000000'; // configurable

function ActionButton({ onClick, href, children, variant = 'default', icon }) {
  const base = "flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 w-full";

  const styles = {
    primary: { background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#0A1628' },
    google: { background: 'rgba(66,133,244,0.15)', border: '1px solid rgba(66,133,244,0.3)', color: '#4285F4' },
    waze: { background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.25)', color: '#00D4FF' },
    share: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' },
    report: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' },
    default: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' },
  };

  const style = { ...styles[variant], fontFamily: "'Cairo', sans-serif" };

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={base} style={style}>
        {icon && <span>{icon}</span>}
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={base} style={style}>
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}

export default function ShelterCard({ shelter, onClose, onNavigate, isNavigating, isMobile, isNearest }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const name = isAr ? shelter.nameAr : shelter.nameEn;
  const region = isAr ? shelter.regionAr : shelter.regionEn;
  const governorate = isAr ? shelter.governorateAr : shelter.governorateEn;

  const distText = shelter.distance != null
    ? (isAr ? formatDistance(shelter.distance) : formatDistanceEn(shelter.distance))
    : null;
  const walkText = shelter.distance != null
    ? (isAr ? formatWalkTime(shelter.distance) : formatWalkTimeEn(shelter.distance))
    : null;
  const driveText = shelter.distance != null
    ? (isAr ? formatDriveTime(shelter.distance) : formatDriveTimeEn(shelter.distance))
    : null;

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${shelter.lat},${shelter.lng}&travelmode=driving`;
  const wazeUrl = `https://waze.com/ul?ll=${shelter.lat},${shelter.lng}&navigate=yes`;
  const shareUrl = `${window.location.origin}?shelter=${shelter.id}&lat=${shelter.lat}&lng=${shelter.lng}`;

  const handleShare = async () => {
    const text = isAr
      ? `ملجأ: ${shelter.nameAr}\nالموقع: https://maps.google.com/maps?q=${shelter.lat},${shelter.lng}`
      : `Shelter: ${shelter.nameEn}\nLocation: https://maps.google.com/maps?q=${shelter.lat},${shelter.lng}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: name, text, url: shareUrl });
      } catch {}
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert(t('actions.copied'));
    }
  };

  const handleReport = () => {
    const subject = encodeURIComponent(t('report.subject'));
    const body = encodeURIComponent(
      t('report.body').replace('{name}', name).replace('{id}', shelter.id)
    );
    const waMsg = encodeURIComponent(
      `${t('report.subject')}\n${t('shelters.shelter')}: ${name}\nID: ${shelter.id}\n`
    );
    window.open(`https://wa.me/${REPORT_WHATSAPP}?text=${waMsg}`, '_blank');
  };

  const cardStyle = isMobile
    ? {
        background: 'linear-gradient(180deg, #0d1f3c 0%, #0A1628 100%)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }
    : {
        background: 'linear-gradient(180deg, #0d1f3c 0%, #0A1628 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      };

  return (
    <div
      className={isMobile ? 'shelter-card-mobile' : 'shelter-panel-desktop'}
      style={cardStyle}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Drag handle on mobile */}
      {isMobile && (
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {isNearest && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(245,158,11,0.2)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }}
              >
                ★ {t('shelters.nearest')}
              </span>
            )}
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${shelter.status === 'open' ? 'badge-open' : 'badge-unknown'}`}
            >
              {t(`shelters.status.${shelter.status}`)}
            </span>
            {shelter.coordinateAccuracy === 'approximate' && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(251,191,36,0.1)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.2)' }}
              >
                ⚠ {t('shelters.dataQuality.approximate')}
              </span>
            )}
          </div>
          <h2
            className="text-white font-bold text-lg leading-tight"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            {name}
          </h2>
          <p className="text-white/50 text-sm mt-0.5" style={{ fontFamily: "'Cairo', sans-serif" }}>
            {region} · {governorate}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center text-white/50 hover:text-white shrink-0 ms-3"
          style={{ background: 'rgba(255,255,255,0.06)' }}
          aria-label={t('actions.close')}
        >
          ✕
        </button>
      </div>

      {/* Distance info */}
      {distText && (
        <div
          className="mx-4 mb-3 p-3 rounded-xl flex items-center gap-4"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}
        >
          <div className="flex-1 text-center">
            <div className="text-amber-400 font-bold text-xl">{distText}</div>
            <div className="text-white/40 text-xs">{t('distance.away')}</div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="flex-1 text-center">
            <div className="text-white font-semibold text-base">🚶 {walkText}</div>
            <div className="text-white/40 text-xs">{t('distance.walk')}</div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="flex-1 text-center">
            <div className="text-white font-semibold text-base">🚗 {driveText}</div>
            <div className="text-white/40 text-xs">{t('distance.drive')}</div>
          </div>
        </div>
      )}

      {/* Details */}
      <div className="mx-4 mb-3 flex flex-col gap-1.5">
        {shelter.capacity && (
          <div className="flex items-center gap-2 text-sm text-white/60">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 opacity-60">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
            {t('shelters.capacity')}: {shelter.capacity.toLocaleString()} {t('shelters.persons')}
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-white/50">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 opacity-60">
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm.5 17v-2h-1v2C8 18.75 5.25 16 4.75 12.5H7v-1H4.75C5.25 8 8 5.25 11.5 4.75V7h1V4.75C16 5.25 18.75 8 19.25 11.5H17v1h2.25C18.75 16 16 18.75 12.5 19z" />
          </svg>
          {t('shelters.lastVerified')}: {shelter.lastVerified}
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-4 pb-4 flex flex-col gap-2">
        {/* Primary: Navigate in App */}
        <ActionButton
          onClick={onNavigate}
          variant="primary"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21.71 11.29l-9-9c-.39-.39-1.02-.39-1.41 0l-9 9c-.39.39-.39 1.02 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9c.39-.38.39-1.02 0-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z" /></svg>}
        >
          {isNavigating ? t('actions.stopNavigation') : t('actions.navigateInApp')}
        </ActionButton>

        {/* Secondary row */}
        <div className="grid grid-cols-2 gap-2">
          <ActionButton href={googleMapsUrl} variant="google" icon="🗺">
            {t('actions.openGoogleMaps')}
          </ActionButton>
          <ActionButton href={wazeUrl} variant="waze" icon="🚗">
            {t('actions.openWaze')}
          </ActionButton>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <ActionButton onClick={handleShare} variant="share" icon="↗">
            {t('actions.share')}
          </ActionButton>
          <ActionButton onClick={handleReport} variant="report" icon="⚠">
            {t('actions.reportLocation')}
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
