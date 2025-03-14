export interface FriendInvitationResponse {
    invitationId: string;
    invitationFrn: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    createdAt: string;
    updatedAt: string;
    sender?: FriendUser;
    recipient?: FriendUser;
}

export interface FriendUser {
    userId: string;
    userFrn: string;
    firstName: string;
    lastName: string;
    email: string;
}
