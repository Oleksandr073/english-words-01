import { type PayloadAction } from '@reduxjs/toolkit';
import {
  delay,
  type Effect,
  type ForkEffect,
  put,
  takeEvery,
} from 'redux-saga/effects';

import { counterModel } from '.';

export function* watchIncrementAsync(): Generator<Effect, void> {
  yield delay(1000);
  yield put(counterModel.actions.increment());
}

export function* watchDecrementAsync(): Generator<Effect, void> {
  yield delay(1000);
  yield put(counterModel.actions.decrement());
}

export function* watchIncrementByAmountAsync(
  action: PayloadAction<number | undefined>,
): Generator<Effect, void> {
  try {
    if (typeof action.payload !== 'number') {
      throw new Error('Invalid parameter');
    }
    yield delay(1000);
    yield put(counterModel.actions.incrementByAmount(action.payload));
    yield put(counterModel.actions.incrementByAmountAsyncSuccess());
  } catch {
    yield put(counterModel.actions.incrementByAmountAsyncFailure());
  }
}

export function* watchCounterSagas(): Generator<ForkEffect, void> {
  yield takeEvery(counterModel.actions.incrementAsync, watchIncrementAsync);
  yield takeEvery(counterModel.actions.decrementAsync, watchDecrementAsync);
  yield takeEvery(
    counterModel.actions.incrementByAmountAsync,
    watchIncrementByAmountAsync,
  );
}

export const counterSagas = watchCounterSagas;
