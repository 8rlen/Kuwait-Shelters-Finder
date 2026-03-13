import { useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDistance, formatDistanceEn, formatWalkTime, formatWalkTimeEn, formatDriveTime, formatDriveTimeEn } from '../hooks/useDistances';

// Kuwait center
const KUWAIT_CENTER = [29.31166, 47.4818];
const KUWAIT_ZOOM = 11;

function createShieldIcon(L, isNearest, isSelected) {
  const color = isNearest ? '#007A3D' : isSelected ? '#60A5FA' : '#94a3b8';
  const size = isNearest ? 36 : 28;
  const pulseClass = isNearest ? 'pulse-nearest' : '';

  const svgIcon = `
    <div class="shelter-marker ${pulseClass}" style="width:${size}px;height:${size}px;border-radius:50%;background:rgba(10,22,40,0.9);border:2px solid ${color};display:flex;align-items:center;justify-content:center;transition:transform 0.2s;">
      <svg width="${size * 0.6}" height="${size * 0.6}" viewBox="0 0 24 24" fill="${color}">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    html: svgIcon,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    tooltipAnchor: [size / 2 + 4, 0],
  });
}

function createUserIcon(L) {
  const html = `
    <div class="user-location-marker pulse-user" style="width:20px;height:20px;background:#3B82F6;border:3px solid white;border-radius:50%;box-shadow:0 0 0 0 rgba(59,130,246,0.7);"></div>
  `;
  return L.divIcon({
    html,
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

export default function Map({
  shelters,
  userCoords,
  nearestShelterId,
  selectedShelter,
  onShelterClick,
  isNavigating,
  mapRef: externalMapRef,
}) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const userMarkerRef = useRef(null);
  const initializedRef = useRef(false);

  // Forward the map ref
  useEffect(() => {
    if (externalMapRef) {
      externalMapRef.current = mapRef.current;
    }
  }, [externalMapRef, mapRef.current]);

  const getLabel = useCallback((shelter) => {
    if (!shelter.distance) return isAr ? shelter.nameAr : shelter.nameEn;
    const dist = isAr ? formatDistance(shelter.distance) : formatDistanceEn(shelter.distance);
    const walk = isAr ? formatWalkTime(shelter.distance) : formatWalkTimeEn(shelter.distance);
    const drive = isAr ? formatDriveTime(shelter.distance) : formatDriveTimeEn(shelter.distance);
    return `${dist} · ${walk} 🚶 · ${drive} 🚗`;
  }, [isAr]);

  // Initialize map
  useEffect(() => {
    if (initializedRef.current || !containerRef.current) return;
    initializedRef.current = true;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      // Fix default icon paths
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(containerRef.current, {
        center: KUWAIT_CENTER,
        zoom: KUWAIT_ZOOM,
        zoomControl: false,
        attributionControl: true,
      });

      // CartoDB Light tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // Zoom control (custom position)
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapRef.current = map;
      if (externalMapRef) externalMapRef.current = map;

      // Add shelter markers
      shelters.forEach(shelter => {
        const isNearest = shelter.id === nearestShelterId;
        const icon = createShieldIcon(L, isNearest, false);
        const label = getLabel(shelter);

        const marker = L.marker([shelter.lat, shelter.lng], { icon })
          .addTo(map)
          .bindTooltip(label, { permanent: false, direction: 'top', offset: [0, -14] });

        marker.on('click', () => onShelterClick(shelter));
        markersRef.current[shelter.id] = marker;
      });
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = {};
        userMarkerRef.current = null;
        initializedRef.current = false;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update user location marker
  useEffect(() => {
    if (!mapRef.current || !userCoords) return;
    const initUserMarker = async () => {
      const L = (await import('leaflet')).default;
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([userCoords.lat, userCoords.lng]);
      } else {
        userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], {
          icon: createUserIcon(L),
          zIndexOffset: 1000,
        }).addTo(mapRef.current);
      }
      mapRef.current.setView([userCoords.lat, userCoords.lng], 13, { animate: true });
    };
    initUserMarker();
  }, [userCoords]);

  // Update markers when nearest / selected changes
  useEffect(() => {
    if (!mapRef.current) return;
    const updateMarkers = async () => {
      const L = (await import('leaflet')).default;
      Object.entries(markersRef.current).forEach(([id, marker]) => {
        const shelter = shelters.find(s => s.id === id);
        if (!shelter) return;
        const isNearest = id === nearestShelterId;
        const isSelected = selectedShelter?.id === id;
        const icon = createShieldIcon(L, isNearest, isSelected);
        marker.setIcon(icon);
        const label = getLabel(shelter);
        marker.setTooltipContent(label);
      });

      // Pan to nearest
      if (nearestShelterId && markersRef.current[nearestShelterId] && !selectedShelter) {
        const shelter = shelters.find(s => s.id === nearestShelterId);
        if (shelter) {
          setTimeout(() => {
            mapRef.current?.panTo([shelter.lat, shelter.lng], { animate: true });
          }, 500);
        }
      }
    };
    updateMarkers();
  }, [nearestShelterId, selectedShelter, shelters, getLabel]);

  // Pan to selected shelter
  useEffect(() => {
    if (!mapRef.current || !selectedShelter) return;
    mapRef.current.panTo([selectedShelter.lat, selectedShelter.lng], { animate: true });
  }, [selectedShelter]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
  );
}
