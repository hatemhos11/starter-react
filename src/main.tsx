import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';


// Tailwind css
import './tailwind.css';


// Router
import { RouterProvider } from 'react-router-dom';
import './lib/axios/axios-global';
import router from './core/global-router';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Suspense>
        <RouterProvider router={router} />
    </Suspense>,
);
