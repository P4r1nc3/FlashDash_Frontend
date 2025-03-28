import axios from 'axios';
import { toast } from 'react-toastify';
import { ErrorResponse } from '../interfaces/ErrorResponse';

const CORE_API_BASE_URL = import.meta.env.CORE_API_BASE_URL || 'http://localhost:8080';
const ACTIVITY_API_BASE_URL = import.meta.env.ACTIVITY_API_BASE_URL || 'http://localhost:7070';

export const axiosCoreInstance = axios.create({
    baseURL: CORE_API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

export const axiosActivityInstance = axios.create({
    baseURL: ACTIVITY_API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

const responseInterceptor = (error: any) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(error);
    }

    // Handle API error responses
    const errorData = error.response.data;
    if (errorData.status && errorData.cause && errorData.action) {
        const apiError = errorData as ErrorResponse;
        toast.error(`${apiError.cause}. ${apiError.action}`);
        return Promise.reject(apiError);
    }


    toast.error('An unexpected error occurred. Please try again later.');
    return Promise.reject(error);
};

axiosCoreInstance.interceptors.response.use(response => response, responseInterceptor);
axiosActivityInstance.interceptors.response.use(response => response, responseInterceptor);