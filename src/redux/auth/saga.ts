import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import { EventChannel, eventChannel } from 'redux-saga';
import { call, fork, put, take, takeEvery } from 'redux-saga/effects';

import { auth, provider } from '@/config';
import { ensureUserProfileExists } from '@/requests';
import { getUserInfo } from '@/utils';

import { authModel } from '.';

type EmitterType = {
  user: User | null;
};
function createAuthStateChangeChannel() {
  return eventChannel<EmitterType>((emitter) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      emitter({ user });
    });
    return unsubscribe;
  });
}

function* signInWithPopupWorker() {
  try {
    yield signInWithPopup(auth, provider);
  } catch (error) {
    console.error(error);
  }
}
function* handleLoggedOut() {
  yield takeEvery(authModel.actions.signInWithPopup, signInWithPopupWorker);
}

function* logOutWorker() {
  try {
    yield call(signOut, auth);
  } catch (error) {
    console.error(error);
  }
}
function* handleLoggedIn() {
  yield takeEvery(authModel.actions.logOut, logOutWorker);
}

export function* authStateWatcher() {
  const authStateChannel: EventChannel<EmitterType> = yield call(
    createAuthStateChangeChannel,
  );

  yield put(authModel.actions.setIsUserFetching(true));
  while (true) {
    const { user }: EmitterType = yield take(authStateChannel);
    if (user) {
      try {
        yield call(ensureUserProfileExists, user.uid);
        const userInfo = getUserInfo(user);
        yield put(authModel.actions.setUserInfo(userInfo));
        yield put(authModel.actions.setIsUserFetching(false));
        yield fork(handleLoggedIn);
      } catch (error) {
        console.error(error);
        yield call(logOutWorker);
      }
    } else {
      yield put(authModel.actions.setUserInfo(undefined));
      yield put(authModel.actions.setIsUserFetching(false));
      yield fork(handleLoggedOut);
    }
  }
}
