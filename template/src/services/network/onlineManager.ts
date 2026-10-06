import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';

/**
 * Standard TanStack Query + NetInfo wiring.
 * When offline, queries with networkMode: 'online' pause
 * and do not hit the network. Cached data remains available.
 *
 * `setEventListener` returns void; the listener callback itself returns
 * the NetInfo unsubscribe that Query owns internally.
 */
export const setupOnlineManager = (): void => {
  onlineManager.setEventListener(setOnline => {
    return NetInfo.addEventListener(state => {
      const online =
        state.isConnected === true && state.isInternetReachable !== false;
      setOnline(online);
    });
  });
};

export const isDeviceOnline = (): boolean => onlineManager.isOnline();
