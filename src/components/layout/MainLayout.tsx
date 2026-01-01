import { Outlet } from 'react-router-dom';

import { NavBar } from '@/components/blocks/NavBar';
import { Header, Toaster } from '@/components/ui';
import { authModel } from '@/redux/auth';
import { useAppSelector } from '@/redux/hooks';

export const MainLayout = () => {
  const isUserLoggedIn = useAppSelector(
    authModel.selectors.selectIsUserLoggedIn,
  );
  const isUserFetching = useAppSelector(
    authModel.selectors.selectIsUserFetching,
  );
  const showNavBar = !isUserFetching && isUserLoggedIn;

  return (
    <>
      <Header />
      {/* Header height is 60px and NavBar height is 75px */}
      <main className="max-w-[360px] mx-auto mt-[60px] mb-[75px]">
        {isUserFetching ? (
          <div className="absolute top-1/2 left-1/2">Loading...</div>
        ) : (
          <Outlet />
        )}
      </main>
      {showNavBar && <NavBar />}

      <Toaster />
    </>
  );
};
