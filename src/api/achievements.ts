import { axiosActivityInstance } from '../utils/axiosConfig';
import { Achievement, AchievementSchema } from '../interfaces/Achievement';
import { getToken } from '../utils/tokenUtils';
import { AxiosResponse } from 'axios';

export const getUserAchievements = async (): Promise<Achievement[]> => {
    const token = getToken();
    const response: AxiosResponse<Achievement[]> = await axiosActivityInstance.get('/achievements', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getAchievementByFrn = async (achievementFrn: string): Promise<Achievement> => {
    const token = getToken();
    const response: AxiosResponse<Achievement> = await axiosActivityInstance.get(`/achievements/${achievementFrn}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getAllAchievementSchemas = async (): Promise<AchievementSchema[]> => {
    const token = getToken();
    const response: AxiosResponse<AchievementSchema[]> = await axiosActivityInstance.get('/achievements/schemas', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getAchievementSchema = async (schemaFrn: string): Promise<AchievementSchema> => {
    const token = getToken();
    const response: AxiosResponse<AchievementSchema> = await axiosActivityInstance.get(`/achievements/schemas/${schemaFrn}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
