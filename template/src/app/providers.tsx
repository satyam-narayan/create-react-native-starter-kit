import { NetworkProvider } from '@/context/NetworkContext';
import { ThemeProvider } from '@/context/ThemeContext';
import i18n from '@/i18n';
import { persistor, store } from '@/store';
import '@/services/api/axios';
import { queryClient } from '@/services/query/queryClient';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

type Props = {
  children: ReactNode;
};

const applyPersistedLanguage = async (): Promise<void> => {
  const language = store.getState().settings?.language || 'en';
  await i18n.changeLanguage(language);
};

export const AppProviders = ({ children }: Props) => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate
          loading={null}
          persistor={persistor}
          onBeforeLift={applyPersistedLanguage}
        >
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <NetworkProvider>
                <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
              </NetworkProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};
