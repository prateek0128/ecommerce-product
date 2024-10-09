import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// project-imports
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';
import AuthLayout from 'layout/Auth';

import { SimpleLayoutType } from 'config';
import SimpleLayout from 'layout/Simple';
import Loadable from 'components/Loadable';
import Login from 'pages/auth/auth1/login';
import Register from 'pages/auth/auth1/register';
import ForgotPassword from 'pages/auth/auth1/forgot-password';
import CreateForm from 'pages/apps/invoice/create';

// render - landing page
//const LoginRoutes = Loadable(lazy(() => import('pages/auth/auth1/login')));
const Statistics = Loadable(lazy(() => import('pages/widget/statistics')));

// ==============================|| ROUTES RENDER ||============================== //

const router = createBrowserRouter(
  [
    // {
    //   path: '/',
    //   element: <SimpleLayout layout={SimpleLayoutType.LANDING} />,
    //   children: [
    //     {
    //       index: true,
    //       element: <PagesLanding />
    //     }
    //   ]
    // },
    // {
    //   path: '/',
    //   element: <SimpleLayout layout={SimpleLayoutType.LANDING} />,
    //   children: [
    //     {
    //       index: true,
    //       element: <PagesLanding />
    //     }
    //   ]
    // },
    {
      path: '/login',
      element: <Login />,
      children: [
        {
          index: true,
          element: <Login />
        }
      ]
    },
    {
      path: '/register',
      element: <Register />,
      children: [
        {
          index: true,
          element: <Register />
        }
      ]
    },
    {
      path: '/forgot-password',
      element: <ForgotPassword />,
      children: [
        {
          index: true,
          element: <ForgotPassword />
        }
      ]
    },
    {
      path: '/create-invoice',
      element: <CreateForm />,
      children: [
        {
          index: true,
          element: <CreateForm />
        }
      ]
    },
    //LoginRoutes,
    MainRoutes
  ],
  { basename: import.meta.env.VITE_APP_BASE_NAME }
);

export default router;
