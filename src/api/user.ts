import { User } from '../interfaces/User';
import axiosInstance from '../utils/axiosConfig';
import { getToken } from '../utils/tokenUtils';
import {ChangePasswordRequest} from "../interfaces/ChangePassword.ts";

export const getUserInfo = async (): Promise<User> => {
    const token = getToken();
    const response = await axiosInstance.get('/users', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const changeUserPassword = async (data: ChangePasswordRequest): Promise<void> => {
    const token = getToken();
    await axiosInstance.put('/users/change-password', data, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const deleteUserAccount = async (): Promise<void> => {
    const token = getToken();
    await axiosInstance.delete('/users', {
        headers: { Authorization: `Bearer ${token}` },
    });
};