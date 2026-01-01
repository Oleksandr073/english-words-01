import { RootState } from '@/redux/store';

export const selectWithError =
  <T>(
    selector: (state: RootState) => T | undefined | null,
    selectorTarget: string,
  ) =>
  (state: RootState) => {
    const selectedState = selector(state);
    if (selectedState === undefined || selectedState === null) {
      throw new Error(`${selectorTarget} is undefined or null`);
    }
    return selectedState;
  };
