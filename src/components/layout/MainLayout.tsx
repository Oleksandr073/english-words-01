import { Outlet } from 'react-router-dom';

import { Header } from '../ui';

export const MainLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
};
