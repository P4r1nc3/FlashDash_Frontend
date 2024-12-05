import axiosInstance from '../utils/axiosConfig';
import { RegisterRequest, LoginRequest, AuthResponse } from '../interfaces/Auth';
import { AxiosResponse } from 'axios';

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await axiosInstance.post('/auth/register', data);
    return response.data;
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await axiosInstance.post('/auth/login', data);
    return response.data;
};
