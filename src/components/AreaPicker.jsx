import { useTranslation } from 'react-i18next';

const AREAS = [
  { labelAr: 'محافظة العاصمة - مدينة الكويت', labelEn: 'Capital - Kuwait City', lat: 29.3697, lng: 47.9783 },
  { labelAr: 'الصالحية', labelEn: 'Salhiya', lat: 29.3741, lng: 47.9823 },
  { labelAr: 'الشرق', labelEn: 'Sharq', lat: 29.3773, lng: 48.001 },
  { labelAr: 'الشويخ', labelEn: 'Shuwaikh', lat: 29.3504, lng: 47.9427 },
  { labelAr: 'السالمية', labelEn: 'Salmiya', lat: 29.3375, lng: 48.0742 },
  { labelAr: 'حولي', labelEn: 'Hawalli', lat: 29.3322, lng: 48.0283 },
  { labelAr: 'الرميثية', labelEn: 'Rumaithiya', lat: 29.3204, lng: 48.0832 },
  { labelAr: 'بيان', labelEn: 'Bayan', lat: 29.2963, lng: 48.0763 },
  { labelAr: 'الجابرية', labelEn: 'Jabriya', lat: 29.3148, lng: 48.0516 },
  { labelAr: 'الشعب البحري', labelEn: 'Shaab Bahri', lat: 29.3521, lng: 48.0871 },
  { labelAr: 'الفروانية', labelEn: 'Farwaniya', lat: 29.2772, lng: 47.9588 },
  { labelAr: 'خيطان', labelEn: 'Khaitan', lat: 29.2997, lng: 47.9766 },
  { labelAr: 'الجليب', labelEn: 'Jleeb Al-Shuyoukh', lat: 29.2844, lng: 47.9823 },
  { labelAr: 'العارضية', labelEn: 'Ardiya', lat: 29.3126, lng: 47.9429 },
  { labelAr: 'الأندلس', labelEn: 'Andalus', lat: 29.3311, lng: 47.9647 },
  { labelAr: 'الأحمدي', labelEn: 'Ahmadi', lat: 29.0768, lng: 48.0836 },
  { labelAr: 'الفنطاس', labelEn: 'Fintas', lat: 29.1694, lng: 48.1147 },
  { labelAr: 'المنقف', labelEn: 'Mangaf', lat: 29.1119, lng: 48.1022 },
  { labelAr: 'المهبولة', labelEn: 'Mahboula', lat: 29.1928, lng: 48.1361 },
  { labelAr: 'الوفرة', labelEn: 'Wafra', lat: 28.6233, lng: 47.9317 },
  { labelAr: 'الجهراء', labelEn: 'Jahra', lat: 29.3378, lng: 47.6581 },
  { labelAr: 'الصليبية', labelEn: 'Sulaibiya', lat: 29.2889, lng: 47.8266 },
  { labelAr: 'الصبية', labelEn: 'Sabiya', lat: 29.5688, lng: 47.9812 },
  { labelAr: 'مبارك الكبير', labelEn: 'Mubarak Al-Kabeer', lat: 29.2138, lng: 48.0571 },
  { labelAr: 'أبو فطيرة', labelEn: 'Abu Futaira', lat: 29.2233, lng: 48.0683 },
  { labelAr: 'القرين', labelEn: 'Qurain', lat: 29.2052, lng: 48.0441 },
  { labelAr: 'العدان', labelEn: 'Adan', lat: 29.2369, lng: 48.0862 },
];

export default function AreaPicker({ onAreaSelect, compact = false }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const handleChange = (e) => {
    const idx = parseInt(e.target.value);
    if (idx >= 0) {
      onAreaSelect(AREAS[idx]);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="#F59E0B"
        className="shrink-0"
      >
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
      <select
        onChange={handleChange}
        defaultValue="-1"
        className="flex-1 text-sm rounded-lg px-3 py-2 outline-none cursor-pointer"
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          color: 'white',
          fontFamily: "'Cairo', sans-serif",
          direction: isAr ? 'rtl' : 'ltr',
          minWidth: compact ? '160px' : '200px',
        }}
      >
        <option value="-1" disabled style={{ background: '#0d1f3c' }}>
          {t('areaPicker.placeholder')}
        </option>
        {AREAS.map((area, idx) => (
          <option key={idx} value={idx} style={{ background: '#0d1f3c' }}>
            {isAr ? area.labelAr : area.labelEn}
          </option>
        ))}
      </select>
    </div>
  );
}
