import { axiosCoreInstance } from '../utils/axiosConfig';
import { RegisterRequest, LoginRequest, AuthResponse } from '../interfaces/Auth';
import { AxiosResponse } from 'axios';

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await axiosCoreInstance.post('/auth/register', data);
    return response.data;
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await axiosCoreInstance.post('/auth/login', data);
    return response.data;
};

export const activate = async (token: string): Promise<string> => {
    const response: AxiosResponse<string> = await axiosCoreInstance.post(`/auth/activate?token=${token}`);
    return response.data;
};
