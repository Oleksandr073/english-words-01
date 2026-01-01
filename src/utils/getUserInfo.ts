import { User, UserInfo } from 'firebase/auth';

export const getUserInfo = (user: User): UserInfo => {
  const { displayName, email, phoneNumber, photoURL, providerId, uid } = user;
  return { displayName, email, phoneNumber, photoURL, providerId, uid };
};
