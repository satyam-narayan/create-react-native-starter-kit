import { configureStore } from '@reduxjs/toolkit';
import { persistedReducer } from './persist';
import { persistStore } from 'redux-persist';

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
