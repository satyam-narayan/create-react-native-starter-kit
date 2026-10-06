import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  access_token: string | null;
}

const initialState: AuthState = {
  access_token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<AuthState>) {
      state.access_token = action.payload.access_token;
    },
    logout() {},
  },
});

export const { login: loginAction, logout: logoutAction } = authSlice.actions;
export default authSlice.reducer;
