import { authSelectors } from './selectors';
import { authSlice } from './slice';

const { actions, reducer } = authSlice;

export const authModel = {
  actions,
  reducer,
  selectors: authSelectors,
};
