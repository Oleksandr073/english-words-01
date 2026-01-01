import { Navigate } from 'react-router-dom';

import { authModel } from '@/redux/auth';
import { useAppSelector } from '@/redux/hooks';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isUserLoggedIn = useAppSelector(
    authModel.selectors.selectIsUserLoggedIn,
  );
  return isUserLoggedIn ? children : <Navigate to="/login" replace />;
};
