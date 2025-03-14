export interface User {
    userId: string;
    userFrn: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    updatedAt: string;
    dailyNotifications: boolean;
    gamesPlayed: number;
    points: number;
    streak: number;
}
