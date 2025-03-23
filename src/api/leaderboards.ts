import { axiosCoreInstance } from '../utils/axiosConfig';
import { getToken } from '../utils/tokenUtils';
import { AxiosResponse } from 'axios';
import { LeaderboardEntry } from '../interfaces/LeaderboardEntry';

export const getLeaderboard = async (
    criteria: string = 'points',
    friendsOnly: boolean = false,
    limit: number = 10
): Promise<LeaderboardEntry[]> => {
    const token = getToken();
    const response: AxiosResponse<LeaderboardEntry[]> = await axiosCoreInstance.get('/leaderboards', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            criteria,
            friendsOnly,
            limit,
        },
    });
    return response.data;
};
