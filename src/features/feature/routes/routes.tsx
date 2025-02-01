import { lazy } from 'react';

const FeaturePage = lazy(() => import('../pages/Feature.page'));

const FeatureRoutes = [
    {
        path: '/feature-page',
        element: <FeaturePage />,
        layout: 'default',
        isAuthReq: true,
    },
];

export { FeatureRoutes };
