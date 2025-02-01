import axios, { AxiosResponse } from 'axios';

interface RequestOptions {
    endpoint: string;
    queryParams?: Record<string, string | number | boolean>;
    body?: Record<string, any>;
    config?: Record<string, any>; // Additional Axios config
}
type TReturn<T> = Promise<AxiosResponse<T, any>>;
// Helper to generate query string from params
const generateQueryString = (queryParams?: Record<string, string | number | boolean>): string => {
    if (!queryParams) return '';
    const query = new URLSearchParams(queryParams as Record<string, string>).toString();
    return query ? `?${query}` : '';
};

// GET Request
export const apiGet = async <T = any>({ endpoint, queryParams, config }: RequestOptions): TReturn<T> => {
    const queryString = generateQueryString(queryParams);
    const response = await axios.get<T>(`${endpoint}${queryString}`, config);
    return response;
};

// POST Request
export const apiPost = async <T = any>({ endpoint, body, queryParams, config }: RequestOptions): TReturn<T> => {
    const queryString = generateQueryString(queryParams);
    const response = await axios.post<T>(`${endpoint}${queryString}`, body, config);
    return response;
};

// PUT Request
export const apiPut = async <T = any>({ endpoint, body, queryParams, config }: RequestOptions): TReturn<T> => {
    const queryString = generateQueryString(queryParams);
    const response = await axios.put<T>(`${endpoint}${queryString}`, body, config);
    return response;
};

// PATCH Request
export const apiPatch = async <T = any>({ endpoint, body, queryParams, config }: RequestOptions): TReturn<T> => {
    const queryString = generateQueryString(queryParams);
    const response = await axios.patch<T>(`${endpoint}${queryString}`, body, config);
    return response;
};

// DELETE Request
export const apiDelete = async <T = any>({ endpoint, queryParams, config }: RequestOptions): TReturn<T> => {
    const queryString = generateQueryString(queryParams);
    const response = await axios.delete<T>(`${endpoint}${queryString}`, config);
    return response;
};
