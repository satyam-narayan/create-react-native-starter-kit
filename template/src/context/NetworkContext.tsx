import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';
import { useTranslation } from 'react-i18next';
import { setupOnlineManager } from '@/services/network';
import { OfflineToast } from '@/services/toast';

type NetworkContextValue = {
  isConnected: boolean;
  isOffline: boolean;
  isHydrated: boolean;
  refresh: () => Promise<boolean>;
};

const NetworkContext = createContext<NetworkContextValue | null>(null);

const resolveOnline = (state: NetInfoState): boolean =>
  state.isConnected === true && state.isInternetReachable !== false;

type Props = {
  children: ReactNode;
};

export const NetworkProvider = ({ children }: Props) => {
  const { t } = useTranslation();
  const [isConnected, setIsConnected] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const previousOnlineRef = useRef<boolean | null>(null);
  const toastShownForOfflineRef = useRef(false);

  const applyState = useCallback(
    (state: NetInfoState) => {
      const online = resolveOnline(state);
      setIsConnected(online);
      setIsHydrated(true);

      const wasOnline = previousOnlineRef.current;
      previousOnlineRef.current = online;

      // Toast on cold-start offline, and again only when transitioning online → offline.
      const shouldToast =
        (!online && wasOnline === null) || (!online && wasOnline === true);

      if (shouldToast && !toastShownForOfflineRef.current) {
        toastShownForOfflineRef.current = true;
        OfflineToast({ message: t('network.unavailableMessage') });
      }

      if (online) {
        toastShownForOfflineRef.current = false;
      }
    },
    [t],
  );

  useEffect(() => {
    setupOnlineManager();
    const unsubscribeNetInfo = NetInfo.addEventListener(applyState);
    return () => {
      unsubscribeNetInfo();
    };
  }, [applyState]);

  // NetInfo.refresh() forces a new check and notifies listeners.
  const refresh = useCallback(async () => {
    const state = await NetInfo.refresh();
    return resolveOnline(state);
  }, []);

  const value = useMemo<NetworkContextValue>(
    () => ({
      isConnected,
      isOffline: !isConnected,
      isHydrated,
      refresh,
    }),
    [isConnected, isHydrated, refresh],
  );

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  );
};

export const useNetwork = (): NetworkContextValue => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within NetworkProvider');
  }
  return context;
};
