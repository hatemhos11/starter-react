import axios, { AxiosError } from 'axios';
import { API_GATEWAY_BASE_URL } from '@/core/global-data/constants.data';

// ------------- AXIOS DEFAULTS SETTINGS -------------
// ---------------------------------------------------
const defaultURL = API_GATEWAY_BASE_URL;

axios.defaults.baseURL = defaultURL;

// ------------- CREATE AXIOS INTERCEPTORS -------------
// ----------------------------------------------------

axios.interceptors.response.use(
    (config) => {
        return config;
    },
    async (error: AxiosError) => {
        try {
            return Promise.reject(error);
        } catch (error) {
            return Promise.reject(error);
        }
    },
);
