import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useGeolocation } from './hooks/useGeolocation';
import { useDistances } from './hooks/useDistances';
import SplashScreen from './components/SplashScreen';
import Map from './components/Map';
import ShelterCard from './components/ShelterCard';
import ListView from './components/ListView';
import EmergencyContacts from './components/EmergencyContacts';
import PanicButton from './components/PanicButton';
import NavigationOverlay from './components/NavigationOverlay';
import LanguageSwitcher from './components/LanguageSwitcher';
import AreaPicker from './components/AreaPicker';
import AccessibilityToggle from './components/AccessibilityToggle';
import shelterData from './data/shelters.json';

export default function App() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [showSplash, setShowSplash] = useState(true);
  const [view, setView] = useState('map');
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [locationPromptShown, setLocationPromptShown] = useState(false);
  const [manualCoords, setManualCoords] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const mapRef = useRef(null);
  const { coords: gpsCoords, status: locationStatus, requestLocation } = useGeolocation();

  const userCoords = gpsCoords || manualCoords;
  const sheltersWithDist = useDistances(shelterData.shelters, userCoords);
  const nearestShelter = sheltersWithDist[0] || null;

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    const dir = isAr ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.body.dir = dir;
    document.documentElement.lang = isAr ? 'ar' : 'en';
  }, [isAr]);

  useEffect(() => {
    document.body.classList.toggle('high-contrast', highContrast);
    document.body.classList.toggle('large-text', largeText);
  }, [highContrast, largeText]);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    if (!showSplash && !locationPromptShown && locationStatus === 'idle') {
      setLocationPromptShown(true);
      requestLocation();
    }
  }, [showSplash, locationPromptShown, locationStatus, requestLocation]);

  const handleAreaSelect = useCallback((area) => {
    setManualCoords({ lat: area.lat, lng: area.lng });
    if (mapRef.current) {
      mapRef.current.setView([area.lat, area.lng], 13, { animate: true });
    }
  }, []);

  const handleShelterSelect = useCallback((shelter) => {
    setSelectedShelter(shelter);
    setView('map');
  }, []);

  const handleNavigate = useCallback(() => {
    setIsNavigating(nav => !nav);
  }, []);

  const handleStopNavigation = useCallback(() => {
    setIsNavigating(false);
  }, []);

  const handleInstall = useCallback(async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') {
        setShowInstallPrompt(false);
        setDeferredPrompt(null);
      }
    }
  }, [deferredPrompt]);

  const handleFindNearest = useCallback(() => {
    if (nearestShelter) {
      setSelectedShelter(nearestShelter);
      setView('map');
      if (mapRef.current) {
        mapRef.current.setView([nearestShelter.lat, nearestShelter.lng], 15, { animate: true });
      }
    }
  }, [nearestShelter]);

  const formatDistChip = (km) => {
    if (!km && km !== 0) return '';
    if (km < 1) return isAr ? ` · ${Math.round(km * 1000)} م` : ` · ${Math.round(km * 1000)} m`;
    return isAr ? ` · ${km.toFixed(1)} كم` : ` · ${km.toFixed(1)} km`;
  };

  if (showSplash) {
    return <SplashScreen onDismiss={() => setShowSplash(false)} />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#0A1628' }}>
      {/* Top Navbar */}
      <nav
        className="flex items-center justify-between px-3 py-2.5 shrink-0 z-50"
        style={{
          background: 'rgba(10,22,40,0.97)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          minHeight: '60px',
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.2)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#007A3D">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>
          <span className="text-white font-bold text-sm hidden sm:block" style={{ fontFamily: "'Cairo', sans-serif" }}>
            {t('app.nameShort')}
          </span>
        </div>

        <div className="flex-1 max-w-xs mx-3">
          <AreaPicker onAreaSelect={handleAreaSelect} compact />
        </div>

        <div className="flex items-center gap-2">
          <AccessibilityToggle
            highContrast={highContrast}
            largeText={largeText}
            onHighContrastChange={setHighContrast}
            onLargeTextChange={setLargeText}
          />
          <LanguageSwitcher compact />
        </div>
      </nav>

      {/* Location denied banner */}
      {locationStatus === 'denied' && (
        <div
          className="flex items-center gap-3 px-4 py-2 shrink-0"
          style={{ background: 'rgba(245,158,11,0.1)', borderBottom: '1px solid rgba(245,158,11,0.15)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#007A3D">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <span className="text-green-400 text-xs flex-1" style={{ fontFamily: "'Cairo', sans-serif" }}>
            {t('location.denied')}
          </span>
          <button onClick={requestLocation} className="text-green-400 text-xs font-semibold underline" style={{ fontFamily: "'Cairo', sans-serif" }}>
            {t('location.enableLocation')}
          </button>
        </div>
      )}

      {/* View tab bar */}
      <div className="flex shrink-0" style={{ background: 'rgba(10,22,40,0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {[
          { key: 'map', label: t('nav.map'), icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" /></svg> },
          { key: 'list', label: t('nav.list'), icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" /></svg> },
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setView(key)}
            className="flex-1 py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-1.5"
            style={{
              fontFamily: "'Cairo', sans-serif",
              color: view === key ? '#007A3D' : 'rgba(255,255,255,0.4)',
              borderBottom: `2px solid ${view === key ? '#007A3D' : 'transparent'}`,
              background: 'transparent',
            }}
          >
            {icon}{label}
          </button>
        ))}
        <button
          onClick={() => setShowEmergency(true)}
          className="px-4 py-2.5 text-sm font-semibold transition-all flex items-center gap-1.5"
          style={{ fontFamily: "'Cairo', sans-serif", color: '#F87171', borderBottom: '2px solid transparent', background: 'transparent' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
          {t('nav.emergency')}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 relative overflow-hidden">
        {/* Map view */}
        <div
          className="absolute inset-0"
          style={{ opacity: view === 'map' ? 1 : 0, pointerEvents: view === 'map' ? 'auto' : 'none', zIndex: view === 'map' ? 1 : 0 }}
        >
          <Map
            shelters={sheltersWithDist}
            userCoords={userCoords}
            nearestShelterId={nearestShelter?.id}
            selectedShelter={selectedShelter}
            onShelterClick={setSelectedShelter}
            isNavigating={isNavigating}
            mapRef={mapRef}
          />

          {/* Nearest shelter chip */}
          {nearestShelter && !selectedShelter && (
            <button
              onClick={handleFindNearest}
              className="absolute z-[800] animate-fade-in"
              style={{
                bottom: '130px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(10,22,40,0.95)',
                border: '1px solid rgba(245,158,11,0.5)',
                borderRadius: '50px',
                padding: '9px 18px',
                color: '#007A3D',
                fontFamily: "'Cairo', sans-serif",
                fontSize: '0.82rem',
                fontWeight: '700',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(10px)',
                whiteSpace: 'nowrap',
                maxWidth: '90vw',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              ★ {t('shelters.nearest')}: {isAr ? nearestShelter.nameAr : nearestShelter.nameEn}
              {nearestShelter.distance != null && formatDistChip(nearestShelter.distance)}
            </button>
          )}

          {/* Shelter card */}
          {selectedShelter && (
            <ShelterCard
              shelter={selectedShelter}
              onClose={() => { setSelectedShelter(null); setIsNavigating(false); }}
              onNavigate={handleNavigate}
              isNavigating={isNavigating}
              isMobile={isMobile}
              isNearest={selectedShelter.id === nearestShelter?.id}
            />
          )}

          {/* Navigation overlay */}
          {isNavigating && selectedShelter && (
            <NavigationOverlay
              shelter={selectedShelter}
              userCoords={userCoords}
              onStop={handleStopNavigation}
              mapRef={mapRef}
            />
          )}
        </div>

        {/* List view */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ opacity: view === 'list' ? 1 : 0, pointerEvents: view === 'list' ? 'auto' : 'none', zIndex: view === 'list' ? 1 : 0 }}
        >
          <ListView
            shelters={sheltersWithDist}
            nearestId={nearestShelter?.id}
            onShelterSelect={handleShelterSelect}
          />
        </div>
      </div>

      {/* Footer strip */}
      <div
        className="shrink-0 px-4 py-1 text-center"
        style={{ background: 'rgba(10,22,40,0.97)', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <p className="text-white/20 text-xs" style={{ fontFamily: "'Cairo', sans-serif" }}>
          {t('footer.lastUpdated')}: {shelterData.dataLastUpdated} · {t('footer.dataSource')}
        </p>
      </div>

      {/* Panic button */}
      <PanicButton userCoords={userCoords} />

      {/* Emergency modal */}
      {showEmergency && <EmergencyContacts onClose={() => setShowEmergency(false)} />}

      {/* PWA Install banner */}
      {showInstallPrompt && (
        <div
          className="fixed bottom-24 left-4 right-4 z-[800] p-4 rounded-2xl animate-slide-up"
          style={{ background: '#0d1f3c', border: '1px solid rgba(245,158,11,0.3)', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(245,158,11,0.15)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#007A3D">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
            </div>
            <p className="flex-1 text-white font-semibold text-sm" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {t('install.prompt')}
            </p>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setShowInstallPrompt(false)} className="px-3 py-2 rounded-lg text-sm text-white/40">
                {t('install.dismiss')}
              </button>
              <button onClick={handleInstall} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: '#007A3D', color: '#FFFFFF' }}>
                {t('install.install')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
