import { AxiosResponse } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { asyncThunkErrorHelper } from '@/utils/AsyncThunkErrorHelper';
import { TResponse } from '@/types/global.types';
import { apiDelete, apiPatch } from '@/lib/axios/axios-utils';

interface DeleteActionParams {
    reducerName: string; // Name of the Redux reducer
    url: string | ((payload: any) => string); // API url for DELETE
    transformResponse?: (response: AxiosResponse<TResponse, any>, payload?: any) => any; // Optional response transformation
    /**
     * @DEFAULT `SINGLE`
     */
    delType?: 'SINGLE' | 'BULK';
}

// Utility to create reusable delete actions
export const createDeleteAction = ({ reducerName, url, transformResponse, delType = 'SINGLE' }: DeleteActionParams) =>
    createAsyncThunk(reducerName, async (payload: { id?: string | number; ids?: string[] }, { rejectWithValue }) => {
        try {
            const endpoint = typeof url === 'string' ? url : url(payload);
            // Make the DELETE request
            const response =
                delType === 'BULK'
                    ? await apiPatch<TResponse>({ endpoint, body: payload?.ids })
                    : await apiDelete<TResponse>({
                          endpoint,
                      });
            // Optionally transform the response before returning
            return transformResponse ? transformResponse(response, payload) : response;
        } catch (error: unknown) {
            // Handle error using the helper
            return asyncThunkErrorHelper(error, rejectWithValue);
        }
    });
