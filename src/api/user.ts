import axiosInstance from "../utils/axiosConfig";
import { getToken } from "../utils/tokenUtils";
import { User } from "../interfaces/User";
import { NotificationResponse } from "../interfaces/NotificationResponse";
import { ChangePasswordRequest } from "../interfaces/ChangePassword";


export const getUserInfo = async (): Promise<User> => {
    const token = getToken();
    const response = await axiosInstance.get("/users", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const changeUserPassword = async (data: ChangePasswordRequest): Promise<void> => {
    const token = getToken();
    await axiosInstance.put("/users", data, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const deleteUserAccount = async (): Promise<void> => {
    const token = getToken();
    await axiosInstance.delete("/users", {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const getNotificationSettings = async (): Promise<NotificationResponse> => {
    const token = getToken();
    const response = await axiosInstance.get("/users/notifications", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const enableNotifications = async (notificationTime: string = "08:00"): Promise<void> => {
    const token = getToken();
    await axiosInstance.put(`/users/notifications/enable?notificationTime=${notificationTime}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const disableNotifications = async (): Promise<void> => {
    const token = getToken();
    await axiosInstance.put("/users/notifications/disable", {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
};
