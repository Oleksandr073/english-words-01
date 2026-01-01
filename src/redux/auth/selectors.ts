import { RootState } from '@/redux/store';
import { selectWithError } from '@/utils';

const selectUserInfo = (state: RootState) => state.auth.user;
const selectUserInfoWithError = selectWithError(selectUserInfo, 'user info');
const selectIsUserLoggedIn = (state: RootState) =>
  state.auth.user !== undefined;
const selectIsUserFetching = (state: RootState) => state.auth.isUserFetching;

export const authSelectors = {
  selectUserInfo,
  selectUserInfoWithError,
  selectIsUserLoggedIn,
  selectIsUserFetching,
};
