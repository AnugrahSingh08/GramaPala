import { useEffect, useState } from 'react';

const SIMULATED_OFFLINE_KEY = 'gramapala_simulated_offline';

export function useOnlineStatus() {
  const [isBrowserOnline, setIsBrowserOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SIMULATED_OFFLINE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsBrowserOnline(true);
      window.dispatchEvent(new CustomEvent('gramapala:network_online'));
    };

    const handleOffline = () => {
      setIsBrowserOnline(false);
      window.dispatchEvent(new CustomEvent('gramapala:network_offline'));
    };

    const handleSimulatedChange = () => {
      try {
        setIsSimulatedOffline(localStorage.getItem(SIMULATED_OFFLINE_KEY) === 'true');
      } catch {
        // ignore
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('gramapala:simulated_offline_change', handleSimulatedChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('gramapala:simulated_offline_change', handleSimulatedChange);
    };
  }, []);

  const toggleSimulatedOffline = (forceState?: boolean) => {
    const nextState = forceState !== undefined ? forceState : !isSimulatedOffline;
    try {
      localStorage.setItem(SIMULATED_OFFLINE_KEY, String(nextState));
    } catch {
      // ignore
    }
    setIsSimulatedOffline(nextState);
    window.dispatchEvent(new CustomEvent('gramapala:simulated_offline_change', { detail: { isSimulatedOffline: nextState } }));
    if (!nextState && isBrowserOnline) {
      window.dispatchEvent(new CustomEvent('gramapala:network_online'));
    }
  };

  const isEffectiveOnline = isBrowserOnline && !isSimulatedOffline;

  return {
    isOnline: isEffectiveOnline,
    isBrowserOnline,
    isSimulatedOffline,
    toggleSimulatedOffline,
  };
}
