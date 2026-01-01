import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInfo } from 'firebase/auth';

type State = {
  user: UserInfo | undefined;
  isUserFetching: boolean;
};

const initialState: State = {
  user: undefined,
  isUserFetching: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserInfo(
      state: State,
      { payload: user }: PayloadAction<UserInfo | undefined>,
    ) {
      state.user = user;
    },
    setIsUserFetching(
      state: State,
      { payload: isUserFetching }: PayloadAction<boolean>,
    ) {
      state.isUserFetching = isUserFetching;
    },
    signInWithPopup() {},
    logOut() {},
  },
});
