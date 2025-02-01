import axios from 'axios';
import i18n from '@/i18n';
import { TRejectWithValue, TResponse } from '@/types/global.types';

export function asyncThunkErrorHelper(error: unknown, rejectWithValue: TRejectWithValue) {
    if (axios.isAxiosError<TResponse, Record<string, unknown>>(error)) {
        if (error.response?.status === 403) {
            return rejectWithValue({
                errorMessage: i18n.t('alerts.forbidden'),
                error: { code: 'FORBIDDEN', message: i18n.t('alerts.forbidden') },
                statusCode: 403,
            });
        }
        return rejectWithValue({
            errorMessage: error.response?.data?.errorMessage || i18n.t('alerts.error'),
            error: error.response?.data?.error,
            statusCode: error.response?.data.statusCode || 0,
        });
    } else {
        if (typeof error === 'string') {
            return rejectWithValue({
                errorMessage: error,
                error: { code: 'INTERNAL ERROR', message: error },
                statusCode: 0,
            });
        } else {
            if (error instanceof Error) {
                return rejectWithValue({
                    errorMessage: error.message,
                    error: { code: 'INTERNAL ERROR', message: error.message },
                    statusCode: 0,
                });
            }
        }
    }
}
export function axiosErrorHelper(error: unknown) {
    if (axios.isAxiosError<TResponse, Record<string, unknown>>(error)) {
        return {
            errorMessage: error.response?.data?.errorMessage || i18n.t('alerts.error'),
            error: error.response?.data?.error,
            statusCode: error.response?.data.statusCode,
        };
    } else {
        if (error instanceof String) {
            return { errorMessage: error || i18n.t('alerts.error'), error: { code: 'INTERNAL ERROR', message: error } };
        } else {
            if (error instanceof Error) {
                return { errorMessage: error.message, error: { code: 'INTERNAL ERROR', message: error.message } };
            }
        }
    }
}
