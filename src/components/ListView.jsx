import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDistance, formatDistanceEn, formatWalkTime, formatWalkTimeEn } from '../hooks/useDistances';

function ShelterListItem({ shelter, isNearest, onSelect, t, isAr }) {
  const name = isAr ? shelter.nameAr : shelter.nameEn;
  const region = isAr ? shelter.regionAr : shelter.regionEn;
  const dist = shelter.distance != null
    ? (isAr ? formatDistance(shelter.distance) : formatDistanceEn(shelter.distance))
    : null;
  const walk = shelter.distance != null
    ? (isAr ? formatWalkTime(shelter.distance) : formatWalkTimeEn(shelter.distance))
    : null;

  return (
    <div
      className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all active:scale-98"
      style={{
        background: isNearest ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${isNearest ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.06)'}`,
        marginBottom: '8px',
      }}
      onClick={() => onSelect(shelter)}
    >
      {/* Shield icon */}
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
        style={{
          background: isNearest ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill={isNearest ? '#F59E0B' : 'rgba(255,255,255,0.4)'}>
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
        </svg>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {isNearest && (
            <span
              className="text-xs font-semibold px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(245,158,11,0.2)', color: '#F59E0B' }}
            >
              ★
            </span>
          )}
          <span
            className={`text-xs px-1.5 py-0.5 rounded font-semibold ${shelter.status === 'open' ? 'badge-open' : 'badge-unknown'}`}
          >
            {t(`shelters.status.${shelter.status}`)}
          </span>
        </div>
        <div
          className="text-white font-semibold text-sm mt-0.5 truncate"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          {name}
        </div>
        <div className="text-white/40 text-xs mt-0.5" style={{ fontFamily: "'Cairo', sans-serif" }}>
          {region}
        </div>
      </div>

      {/* Distance */}
      {dist && (
        <div className="shrink-0 text-right" style={{ direction: 'ltr' }}>
          <div className="text-amber-400 font-bold text-sm">{dist}</div>
          <div className="text-white/40 text-xs">🚶 {walk}</div>
        </div>
      )}

      {/* Go arrow */}
      <button
        onClick={(e) => { e.stopPropagation(); onSelect(shelter); }}
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all hover:scale-110"
        style={{ background: isNearest ? '#F59E0B' : 'rgba(255,255,255,0.08)', color: isNearest ? '#0A1628' : 'white' }}
        aria-label={t('actions.go')}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d={isAr ? 'M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z' : 'M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z'} />
        </svg>
      </button>
    </div>
  );
}

export default function ListView({ shelters, nearestId, onShelterSelect }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return shelters;
    const q = search.toLowerCase();
    return shelters.filter(s =>
      s.nameAr.includes(q) ||
      s.nameEn.toLowerCase().includes(q) ||
      s.regionAr.includes(q) ||
      s.regionEn.toLowerCase().includes(q) ||
      s.governorateAr.includes(q) ||
      s.governorateEn.toLowerCase().includes(q)
    );
  }, [shelters, search]);

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: '#0A1628' }}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Search */}
      <div className="p-4 pb-2">
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.4)">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('shelters.searchPlaceholder')}
            className="flex-1 bg-transparent outline-none text-white text-sm placeholder-white/30"
            style={{ fontFamily: "'Cairo', sans-serif", direction: isAr ? 'rtl' : 'ltr' }}
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-white/30 hover:text-white/60">
              ✕
            </button>
          )}
        </div>

        {/* Count */}
        <p className="text-white/30 text-xs mt-2 px-1" style={{ fontFamily: "'Cairo', sans-serif" }}>
          {filtered.length} {t('shelters.allShelters')}
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-white/30">
            <div className="text-4xl mb-3">🔍</div>
            <p style={{ fontFamily: "'Cairo', sans-serif" }}>{t('shelters.noShelters')}</p>
          </div>
        ) : (
          filtered.map((shelter) => (
            <ShelterListItem
              key={shelter.id}
              shelter={shelter}
              isNearest={shelter.id === nearestId}
              onSelect={onShelterSelect}
              t={t}
              isAr={isAr}
            />
          ))
        )}
      </div>
    </div>
  );
}
