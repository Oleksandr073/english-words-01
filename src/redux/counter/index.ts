import { counterSelectors } from './selectors';
import { counterSlice } from './slice';

const { actions, reducer } = counterSlice;

export const counterModel = {
  actions,
  reducer,
  selectors: counterSelectors,
};
