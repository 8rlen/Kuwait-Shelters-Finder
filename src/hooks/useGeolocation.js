import { useState, useEffect, useCallback } from 'react';

export function useGeolocation() {
  const [state, setState] = useState({
    coords: null,
    status: 'idle', // idle | requesting | granted | denied | error
    error: null,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(s => ({ ...s, status: 'error', error: 'Geolocation not supported' }));
      return;
    }
    setState(s => ({ ...s, status: 'requesting' }));
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          },
          status: 'granted',
          error: null,
        });
      },
      (err) => {
        setState({
          coords: null,
          status: err.code === 1 ? 'denied' : 'error',
          error: err.message,
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  }, []);

  return { ...state, requestLocation };
}
