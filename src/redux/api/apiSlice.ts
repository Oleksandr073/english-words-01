import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

import { ApiTagTypesEnum } from './ApiTagTypesEnum';

export const apiSlice = createApi({
  baseQuery: fakeBaseQuery(),
  refetchOnReconnect: true,
  refetchOnFocus: true,
  tagTypes: Object.values(ApiTagTypesEnum),
  endpoints: () => ({}),
});
