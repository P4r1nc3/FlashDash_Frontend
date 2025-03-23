import { UserSummary } from './UserSummary';

export interface FriendInvitationResponse {
    invitationId: string;
    invitationFrn: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    createdAt: string;
    updatedAt: string;
    sender?: UserSummary;
    recipient?: UserSummary;
}
