import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDistance, formatDistanceEn, formatWalkTime, formatWalkTimeEn } from '../hooks/useDistances';

const GOV_ORDER_AR = ['محافظة العاصمة','محافظة حولي','محافظة الفروانية','محافظة مبارك الكبير','محافظة الأحمدي','محافظة الجهراء'];
const GOV_ORDER_EN = ['Capital Governorate','Hawalli Governorate','Farwaniya Governorate','Mubarak Al-Kabeer Governorate','Ahmadi Governorate','Jahra Governorate'];

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
      className="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all active:scale-[0.98]"
      style={{
        background: isNearest ? 'rgba(0,122,61,0.1)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${isNearest ? 'rgba(0,122,61,0.3)' : 'rgba(255,255,255,0.06)'}`,
        marginBottom: '6px',
      }}
      onClick={() => onSelect(shelter)}
    >
      {/* Shield icon */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{
          background: isNearest ? 'rgba(0,122,61,0.25)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${isNearest ? 'rgba(0,122,61,0.4)' : 'rgba(255,255,255,0.08)'}`,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill={isNearest ? '#4DB87A' : 'rgba(255,255,255,0.35)'}>
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
        </svg>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
          {isNearest && (
            <span
              className="text-xs font-bold px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(0,122,61,0.2)', color: '#4DB87A', fontSize: '0.65rem' }}
            >
              ★ {t('shelters.nearest')}
            </span>
          )}
          <span
            className={`text-xs px-1.5 py-0.5 rounded font-semibold ${shelter.status === 'open' ? 'badge-open' : 'badge-unknown'}`}
            style={{ fontSize: '0.65rem' }}
          >
            {t(`shelters.status.${shelter.status}`)}
          </span>
        </div>
        <div
          className="text-white font-semibold text-sm leading-snug"
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
          <div className="font-bold text-sm" style={{ color: '#4DB87A' }}>{dist}</div>
          <div className="text-white/35 text-xs">🚶 {walk}</div>
        </div>
      )}

      {/* Arrow */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
        style={{ background: isNearest ? 'rgba(0,122,61,0.3)' : 'rgba(255,255,255,0.06)' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill={isNearest ? '#4DB87A' : 'rgba(255,255,255,0.4)'}>
          <path d={isAr ? 'M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z' : 'M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z'} />
        </svg>
      </div>
    </div>
  );
}

function GovernorateSection({ govName, shelters, nearestId, onSelect, t, isAr }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="mb-2">
      <button
        className="w-full flex items-center justify-between px-1 py-2 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 rounded-full" style={{ background: '#007A3D' }} />
          <span className="text-white/70 font-semibold text-xs" style={{ fontFamily: "'Cairo', sans-serif" }}>
            {govName}
          </span>
          <span
            className="text-xs px-1.5 py-0.5 rounded-full"
            style={{ background: 'rgba(0,122,61,0.15)', color: '#4DB87A', fontSize: '0.65rem' }}
          >
            {shelters.length}
          </span>
        </div>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.3)"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
        >
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
        </svg>
      </button>
      {expanded && shelters.map(shelter => (
        <ShelterListItem
          key={shelter.id}
          shelter={shelter}
          isNearest={shelter.id === nearestId}
          onSelect={onSelect}
          t={t}
          isAr={isAr}
        />
      ))}
    </div>
  );
}

export default function ListView({ shelters, nearestId, onShelterSelect }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [search, setSearch] = useState('');
  const [groupByGov, setGroupByGov] = useState(false);

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

  const grouped = useMemo(() => {
    if (!groupByGov) return null;
    const order = isAr ? GOV_ORDER_AR : GOV_ORDER_EN;
    const map = {};
    filtered.forEach(s => {
      const key = isAr ? s.governorateAr : s.governorateEn;
      if (!map[key]) map[key] = [];
      map[key].push(s);
    });
    return order.filter(g => map[g]).map(g => ({ name: g, shelters: map[g] }));
  }, [filtered, groupByGov, isAr]);

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: '#0A1628' }}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Search + controls */}
      <div className="p-4 pb-2 shrink-0">
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.35)">
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
            <button onClick={() => setSearch('')} className="text-white/30 hover:text-white/60">✕</button>
          )}
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between mt-2 px-1">
          <p className="text-white/30 text-xs" style={{ fontFamily: "'Cairo', sans-serif" }}>
            {filtered.length} {t('shelters.allShelters')}
          </p>
          <button
            onClick={() => setGroupByGov(g => !g)}
            className="text-xs px-2.5 py-1 rounded-full transition-all"
            style={{
              background: groupByGov ? 'rgba(0,122,61,0.2)' : 'rgba(255,255,255,0.06)',
              color: groupByGov ? '#4DB87A' : 'rgba(255,255,255,0.4)',
              border: `1px solid ${groupByGov ? 'rgba(0,122,61,0.35)' : 'rgba(255,255,255,0.1)'}`,
              fontFamily: "'Cairo', sans-serif",
            }}
          >
            {isAr ? 'تجميع بالمحافظة' : 'Group by Gov.'}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-white/30">
            <div className="text-4xl mb-3">🔍</div>
            <p style={{ fontFamily: "'Cairo', sans-serif" }}>{t('shelters.noShelters')}</p>
          </div>
        ) : groupByGov && grouped ? (
          grouped.map(({ name, shelters: govShelters }) => (
            <GovernorateSection
              key={name}
              govName={name}
              shelters={govShelters}
              nearestId={nearestId}
              onSelect={onShelterSelect}
              t={t}
              isAr={isAr}
            />
          ))
        ) : (
          filtered.map(shelter => (
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
