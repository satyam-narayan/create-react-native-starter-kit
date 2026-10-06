import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string | null;
  isProfileSetup: boolean;
}

const initialState: UserState = {
  id: null,
  isProfileSetup: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.id = action.payload.id;
      state.isProfileSetup = action.payload.isProfileSetup;
    },
  },
});

export const { setUser: setUserAction } = userSlice.actions;
export default userSlice.reducer;
