import { useEffect } from 'react';

const useReloadAlert = (isActive = true, deps: any[] = []) => {
    useEffect(() => {
        const unloadCallback = (event: BeforeUnloadEvent) => {
            if (isActive) {
                event.preventDefault();
            }
            return '';
        };

        window.addEventListener('beforeunload', unloadCallback);
        return () => window.removeEventListener('beforeunload', unloadCallback);
    }, [...deps]);
    return;
};

export default useReloadAlert;
