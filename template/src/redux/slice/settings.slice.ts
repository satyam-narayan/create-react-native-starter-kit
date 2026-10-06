import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import i18n from '@/i18n';

export type AppLanguage = 'en' | 'ru';

interface SettingsState {
  language: AppLanguage;
}

const initialState: SettingsState = {
  language: 'en',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<AppLanguage>) {
      state.language = action.payload;
      void i18n.changeLanguage(action.payload);
    },
  },
});

export const { setLanguage } = settingsSlice.actions;
export default settingsSlice.reducer;
