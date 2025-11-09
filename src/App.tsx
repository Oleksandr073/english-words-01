import './App.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { MainLayout } from './components/layout';
import { HomePage, NotFoundPage } from './pages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
