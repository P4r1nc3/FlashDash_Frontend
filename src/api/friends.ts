import axiosInstance from '../utils/axiosConfig';
import { getToken } from '../utils/tokenUtils';
import { AxiosResponse } from 'axios';
import { User } from '../interfaces/User';
import { FriendInvitationResponse } from '../interfaces/FriendInvitation';

export const getFriends = async (): Promise<User[]> => {
    const token = getToken();
    const response: AxiosResponse<User[]> = await axiosInstance.get('/friends', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const deleteFriend = async (friendEmail: string): Promise<void> => {
    const token = getToken();
    await axiosInstance.delete(`/friends/${friendEmail}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const sendFriendInvitation = async (recipientEmail: string): Promise<void> => {
    const token = getToken();
    await axiosInstance.post(`/friends/invite?recipientEmail=${encodeURIComponent(recipientEmail)}`, null, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const getSentInvitations = async (): Promise<FriendInvitationResponse[]> => {
    const token = getToken();
    const response: AxiosResponse<FriendInvitationResponse[]> = await axiosInstance.get('/friends/invitations/sent', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getReceivedInvitations = async (): Promise<FriendInvitationResponse[]> => {
    const token = getToken();
    const response: AxiosResponse<FriendInvitationResponse[]> = await axiosInstance.get('/friends/invitations/received', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const respondToInvitation = async (invitationId: number, status: 'ACCEPTED' | 'REJECTED'): Promise<void> => {
    const token = getToken();
    await axiosInstance.put(`/friends/invitations/${invitationId}?status=${status}`, null, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
