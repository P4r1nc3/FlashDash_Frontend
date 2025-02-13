export interface FriendInvitationResponse {
    id: number;
    senderFirstName: string;
    senderLastName: string;
    recipientFirstName: string;
    recipientLastName: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    createdAt: string;
}
