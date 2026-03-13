import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDistance, formatDistanceEn } from '../hooks/useDistances';

export default function NavigationOverlay({ shelter, userCoords, onStop, mapRef }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const routingRef = useRef(null);

  const name = isAr ? shelter.nameAr : shelter.nameEn;

  useEffect(() => {
    if (!mapRef?.current || !userCoords) return;

    const map = mapRef.current;

    // Dynamically load Leaflet Routing Machine
    const initRouting = async () => {
      try {
        const L = (await import('leaflet')).default;
        await import('leaflet-routing-machine');

        // Clean up existing
        if (routingRef.current) {
          try { map.removeControl(routingRef.current); } catch {}
          routingRef.current = null;
        }

        const waypoints = [
          L.latLng(userCoords.lat, userCoords.lng),
          L.latLng(shelter.lat, shelter.lng),
        ];

        const control = L.Routing.control({
          waypoints,
          routeWhileDragging: false,
          show: false,
          addWaypoints: false,
          fitSelectedRoutes: true,
          lineOptions: {
            styles: [{ color: '#007A3D', weight: 5, opacity: 0.85 }],
            extendToWaypoints: true,
            missingRouteTolerance: 0,
          },
          router: L.Routing.osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1',
          }),
          createMarker: () => null,
        });

        control.addTo(map);
        routingRef.current = control;
      } catch (err) {
        console.error('Routing error:', err);
      }
    };

    initRouting();

    return () => {
      if (routingRef.current && mapRef.current) {
        try { mapRef.current.removeControl(routingRef.current); } catch {}
        routingRef.current = null;
      }
    };
  }, [shelter, userCoords, mapRef]);

  const distRemaining = userCoords && shelter.distance != null
    ? (isAr ? formatDistance(shelter.distance) : formatDistanceEn(shelter.distance))
    : null;

  return (
    <div
      className="fixed top-20 left-1/2 z-[900] -translate-x-1/2 animate-fade-in"
      style={{
        background: 'rgba(10,22,40,0.95)',
        border: '1px solid rgba(245,158,11,0.4)',
        borderRadius: '16px',
        boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(10px)',
        padding: '12px 20px',
        minWidth: '280px',
        maxWidth: '90vw',
      }}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 animate-pulse"
          style={{ background: 'rgba(245,158,11,0.2)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#007A3D">
            <path d="M21.71 11.29l-9-9c-.39-.39-1.02-.39-1.41 0l-9 9c-.39.39-.39 1.02 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9c.39-.38.39-1.02 0-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-green-400 text-xs font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
            {t('navigation.title')}
          </p>
          <p className="text-white font-bold text-sm truncate" style={{ fontFamily: "'Cairo', sans-serif" }}>
            {name}
          </p>
          {distRemaining && (
            <p className="text-white/50 text-xs">
              {t('navigation.distanceRemaining')}: {distRemaining}
            </p>
          )}
        </div>
        <button
          onClick={onStop}
          className="shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-all active:scale-95"
          style={{
            background: 'rgba(220,38,38,0.2)',
            border: '1px solid rgba(220,38,38,0.3)',
            color: '#F87171',
            fontFamily: "'Cairo', sans-serif",
          }}
        >
          {t('actions.stopNavigation')}
        </button>
      </div>
    </div>
  );
}
