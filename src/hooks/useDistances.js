import { useMemo } from 'react';

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)} م`;
  return `${km.toFixed(1)} كم`;
}

export function formatDistanceEn(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export function formatWalkTime(km) {
  const mins = Math.round((km / 5) * 60); // 5 km/h walking speed
  if (mins < 1) return '< 1 دقيقة';
  return `~${mins} د`;
}

export function formatWalkTimeEn(km) {
  const mins = Math.round((km / 5) * 60);
  if (mins < 1) return '< 1 min';
  return `~${mins} min`;
}

export function formatDriveTime(km) {
  const mins = Math.round((km / 40) * 60); // 40 km/h city driving
  if (mins < 1) return '< 1 دقيقة';
  return `~${mins} د`;
}

export function formatDriveTimeEn(km) {
  const mins = Math.round((km / 40) * 60);
  if (mins < 1) return '< 1 min';
  return `~${mins} min`;
}

export function useDistances(shelters, userCoords) {
  return useMemo(() => {
    if (!userCoords) return shelters.map(s => ({ ...s, distance: null }));
    return shelters
      .map(s => ({
        ...s,
        distance: haversineDistance(userCoords.lat, userCoords.lng, s.lat, s.lng),
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [shelters, userCoords]);
}

export { haversineDistance };
