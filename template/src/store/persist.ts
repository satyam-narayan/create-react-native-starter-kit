import { PersistConfig, persistReducer } from 'redux-persist';
import { reduxStorage } from './mmkv';
import { rootReducer, RootStoreState } from './rootReducer';

const persistConfig: PersistConfig<RootStoreState> = {
  key: 'root',
  storage: reduxStorage,
};

export const persistedReducer = persistReducer(persistConfig, rootReducer);
