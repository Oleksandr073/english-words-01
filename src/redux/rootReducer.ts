import { combineReducers } from '@reduxjs/toolkit';

import { apiSlice } from './api/apiSlice';
import { authSlice } from './auth/slice';

export const rootReducer = combineReducers({
  auth: authSlice.reducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});
