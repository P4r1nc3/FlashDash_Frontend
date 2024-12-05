import { User } from '../interfaces/User';
import axiosInstance from '../utils/axiosConfig';
import { getToken } from '../utils/tokenUtils';

export const getUserInfo = async (): Promise<User> => {
    const token = getToken();
    const response = await axiosInstance.get('/users', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
