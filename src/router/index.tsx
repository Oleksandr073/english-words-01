import { createBrowserRouter, Navigate } from 'react-router-dom';

import { MainLayout } from '@/components/layout';
import {
  LoginPage,
  NotFoundPage,
  UserPage,
  WordsListPage,
  WordPage,
  CreateWordPage,
  TagsPage,
} from '@/pages';

import { ProtectedRoute } from './ProtectedRoute';
import { PublicOnlyRoute } from './PublicOnlyRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="words/" replace />,
      },
      {
        path: '/login',
        element: (
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        ),
      },
      {
        path: '/words',
        element: (
          <ProtectedRoute>
            <WordsListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/words/:id',
        element: (
          <ProtectedRoute>
            <WordPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/words/create',
        element: (
          <ProtectedRoute>
            <CreateWordPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/tags',
        element: (
          <ProtectedRoute>
            <TagsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/user',
        element: (
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
