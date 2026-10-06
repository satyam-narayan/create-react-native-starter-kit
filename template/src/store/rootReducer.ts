import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '@/redux/slice/auth.slice';
import userReducer from '@/redux/slice/user.slice';
import loaderReducer from '@/redux/slice/loader.slice';
import settingsReducer from '@/redux/slice/settings.slice';
import i18n from '@/i18n';

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  loader: loaderReducer,
  settings: settingsReducer,
});

export const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: any,
) => {
  if (action.type === 'auth/logout') {
    state = undefined;
    void i18n.changeLanguage('en');
  }
  return appReducer(state, action);
};

export type RootStoreState = ReturnType<typeof rootReducer>;
