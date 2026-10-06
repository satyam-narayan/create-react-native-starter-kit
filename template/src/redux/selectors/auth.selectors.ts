import { RootStoreState } from '@/store/rootReducer';

export const selectIsAuthenticated = (state: RootStoreState) =>
  !!state.auth.access_token;
