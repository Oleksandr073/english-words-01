import { counterSlice } from './counter/slice';

export const rootReducer = {
  counter: counterSlice.reducer,
};
