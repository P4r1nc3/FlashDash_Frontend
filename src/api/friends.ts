import { axiosCoreInstance } from '../utils/axiosConfig.ts';
import { getToken } from '../utils/tokenUtils';
import { AxiosResponse } from 'axios';
import { User } from '../interfaces/User';
import { FriendInvitationResponse } from '../interfaces/FriendInvitation';

export const getFriends = async (): Promise<User[]> => {
    const token = getToken();
    const response: AxiosResponse<User[]> = await axiosCoreInstance.get('/friends', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const deleteFriend = async (friendEmail: string): Promise<void> => {
    const token = getToken();
    await axiosCoreInstance.delete(`/friends/${friendEmail}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const sendFriendInvitation = async (recipientEmail: string): Promise<void> => {
    const token = getToken();
    await axiosCoreInstance.post(`/invitations?recipientEmail=${encodeURIComponent(recipientEmail)}`, null, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const getSentInvitations = async (): Promise<FriendInvitationResponse[]> => {
    const token = getToken();
    const response: AxiosResponse<FriendInvitationResponse[]> = await axiosCoreInstance.get("/invitations/sent", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getReceivedInvitations = async (): Promise<FriendInvitationResponse[]> => {
    const token = getToken();
    const response: AxiosResponse<FriendInvitationResponse[]> = await axiosCoreInstance.get("/invitations/received", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const respondToInvitation = async (invitationFrn: string, status: "ACCEPTED" | "REJECTED" | "CANCELLED"): Promise<void> => {
    const token = getToken();
    await axiosCoreInstance.put(`/invitations/${invitationFrn}`, null, {
        params: { status },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
