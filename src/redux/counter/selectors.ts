import { RootState } from '../store';

export const selectValue = (state: RootState) => state.counter.value;

export const counterSelectors = {
  selectValue,
};
