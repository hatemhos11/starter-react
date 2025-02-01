import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PAGE_SIZES } from '@/core/global-data/constants.data';
import useParamState from './useFilterParamsTest';

// ------------------------

const usePaginateTable = (): UsePaginateTable => {
    // REACT-ROUTER-DOM HOOKS
    const location = useLocation();
    const [pagParams, setPagParams] = useParamState('pagination', {
        page: '1',
        pageSize: getPageSize(location.pathname),
    });

    const setPage = useCallback(
        (num: number) => {
            setPagParams({ page: num.toString() });
        },
        [pagParams],
    );
    const setPageSize = useCallback(
        (size: number) => {
            setPagParams({ pageSize: size.toString() });
        },
        [pagParams],
    );

    useEffect(() => {
        savePageSizeWithHref(pagParams.pageSize, location.pathname);
    }, [pagParams.pageSize]);

    return { page: +pagParams.page, setPagParams, pageSize: +pagParams.pageSize, setPageSize, setPage };
};
export default usePaginateTable;

// -----------------------------------------
// ------------ UTILS FUNCTIONS ------------
function savePageSizeWithHref(pageSize: number, href: string) {
    const pageSizeData = JSON.parse(localStorage.getItem('page_sizes_data') || '{}');
    localStorage.setItem('page_sizes_data', JSON.stringify({ ...pageSizeData, [`${href}`]: pageSize }));
}
function getPageSize(href = '/') {
    const pageSizeData = JSON.parse(localStorage.getItem('page_sizes_data') || '{}');
    return pageSizeData?.[href] || PAGE_SIZES[0];
}

// TYPES
interface UsePaginateTable {
    pageSize: number;
    setPageSize: (page: number) => void;
    page: number;
    setPage: (page: number) => void;
    setPagParams: ({ page, pageSize }: { page?: string; pageSize?: string }) => void;
}
