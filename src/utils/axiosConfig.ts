import axios from 'axios';

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
    if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
    return Promise.reject(error);
};

axiosCoreInstance.interceptors.response.use(response => response, responseInterceptor);
axiosActivityInstance.interceptors.response.use(response => response, responseInterceptor);
