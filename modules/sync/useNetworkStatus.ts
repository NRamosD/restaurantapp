import { useState, useEffect, useCallback } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export interface NetworkStatus {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  type: string | null;
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isConnected: null,
    isInternetReachable: null,
    type: null,
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setStatus({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
      });
    });

    return () => unsubscribe();
  }, []);

  return status;
}

export function useOnlineEffect(callback: () => void | Promise<void>, enabled: boolean = true) {
  const { isConnected, isInternetReachable } = useNetworkStatus();
  const [hasSyncedSinceOnline, setHasSyncedSinceOnline] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    
    const isOnline = isConnected && isInternetReachable;
    
    if (isOnline && !hasSyncedSinceOnline) {
      callback();
      setHasSyncedSinceOnline(true);
    } else if (!isOnline) {
      setHasSyncedSinceOnline(false);
    }
  }, [isConnected, isInternetReachable, enabled, hasSyncedSinceOnline, callback]);

  return { isOnline: isConnected && isInternetReachable };
}

export function useAutoSync(
  syncCallback: () => void | Promise<void>,
  autoSyncEnabled: boolean
) {
  const { isOnline } = useOnlineEffect(syncCallback, autoSyncEnabled);

  useEffect(() => {
    if (autoSyncEnabled && isOnline) {
      console.log('[Sync] Auto-sync activando...');
      syncCallback();
    }
  }, [isOnline, autoSyncEnabled, syncCallback]);

  return { isAutoSyncing: autoSyncEnabled && isOnline };
}
