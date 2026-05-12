import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useMapStore } from '../store/mapStore';

interface GeoState {
  position: [number, number] | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({
    position: null,
    loading: false,
    error: null,
  });
  const setUserPosition = useMapStore((s) => s.setUserPosition);
  const centerOn = useMapStore((s) => s.centerOn);

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('Géolocalisation non supportée par ce navigateur');
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos: [number, number] = [coords.latitude, coords.longitude];
        setState({ position: pos, loading: false, error: null });
        setUserPosition(pos);
        centerOn(pos);
      },
      (err) => {
        const msg =
          err.code === GeolocationPositionError.PERMISSION_DENIED
            ? 'Localisation refusée'
            : 'Erreur de localisation';
        setState({ position: null, loading: false, error: msg });
        toast.error(msg);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [setUserPosition, centerOn]);

  return { ...state, request };
}
