import DefaultLayout from '@/Layouts/DefaultLayout';
import { lazy } from 'react';
const Home = lazy(() => import('@/core/global-pages/Home'));
import { FeatureRoutes } from '$/feature/routes/routes';

const routes = [
    {
        path: '/',
        element: <DefaultLayout />,
        children: [{ index: true, element: <Home /> }, ...FeatureRoutes],
    },
];
export { routes };
