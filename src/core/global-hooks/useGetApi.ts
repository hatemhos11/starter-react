import { useState, useEffect, useCallback } from 'react';
import axios, { isAxiosError } from 'axios';

const useApi = (url: string, options = {}) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [statusCode, setStatusCode] = useState<number | null>(null);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios({ url, ...options });
            setStatusCode(response?.status);
            setData(response?.data?.data);
        } catch (err) {
            if (isAxiosError(err)) {
                setStatusCode(err.response?.status || null);
                setError(err.response?.data || err.message);
            }
        } finally {
            setLoading(false);
        }
    }, [url, options]);

    useEffect(() => {
        fetchData();
    }, []);

    const refetch = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, statusCode, refetch };
};

export default useApi;
