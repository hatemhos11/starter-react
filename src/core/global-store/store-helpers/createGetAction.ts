import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiGet } from '@/lib/axios/axios-utils';
import { asyncThunkErrorHelper } from '@/utils/AsyncThunkErrorHelper';

interface CreateAsyncThunkParams<TResponse = any, TPayload = { [key: string]: string }> {
    reducerName: string;
    url: string | ((payload: TPayload) => string);
    queryParamsMapper?: (payload: TPayload) => Record<string, any>;
    transformResponse?: (response: TResponse) => any;
}
export const createGetAction = <TResponse = any, TPayload = { [key: string]: string }>({
    reducerName,
    url,
    queryParamsMapper,
    transformResponse,
}: CreateAsyncThunkParams<TResponse, TPayload>) =>
    createAsyncThunk(reducerName, async (payload: TPayload, { rejectWithValue }) => {
        try {
            const endpoint = typeof url === 'string' ? url : url(payload);
            const queryParams = queryParamsMapper ? queryParamsMapper(payload) : undefined;
            const response = await apiGet<TResponse>({ endpoint, queryParams });
            return transformResponse ? transformResponse(response.data) : response.data;
        } catch (error: unknown) {
            return asyncThunkErrorHelper(error, rejectWithValue);
        }
    });
