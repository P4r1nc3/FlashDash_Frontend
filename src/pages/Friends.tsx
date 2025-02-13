import { useEffect, useState } from 'react';
import { Container, Typography, Box, Tabs, Tab, Paper, Button, TextField } from '@mui/material';
import { getFriends, getSentInvitations, getReceivedInvitations, sendFriendInvitation, respondToInvitation } from '../api/friends';
import { User } from '../interfaces/User';
import { FriendInvitationResponse } from '../interfaces/FriendInvitation';
import { ErrorResponse } from '../interfaces/ErrorResponse';
import { toast } from 'react-toastify';

const Friends = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [friends, setFriends] = useState<User[]>([]);
    const [sentInvitations, setSentInvitations] = useState<FriendInvitationResponse[]>([]);
    const [receivedInvitations, setReceivedInvitations] = useState<FriendInvitationResponse[]>([]);
    const [email, setEmail] = useState('');

    useEffect(() => {
        fetchFriends();
        fetchSentInvitations();
        fetchReceivedInvitations();
    }, []);

    const fetchFriends = async () => {
        try {
            const data = await getFriends();
            setFriends(data);
        } catch (error: any) {
            handleError(error);
        }
    };

    const fetchSentInvitations = async () => {
        try {
            const data = await getSentInvitations();
            setSentInvitations(data);
        } catch (error: any) {
            handleError(error);
        }
    };

    const fetchReceivedInvitations = async () => {
        try {
            const data = await getReceivedInvitations();
            setReceivedInvitations(data);
        } catch (error: any) {
            handleError(error);
        }
    };

    const handleSendInvitation = async () => {
        if (!email) return;
        try {
            await sendFriendInvitation(email);
            setEmail('');
            toast.success('Friend invitation sent successfully!');
            fetchSentInvitations();
        } catch (error: any) {
            handleError(error);
        }
    };

    const handleRespondToInvitation = async (invitationId: number, status: 'ACCEPTED' | 'REJECTED') => {
        try {
            await respondToInvitation(invitationId, status);
            toast.success(
                status === 'ACCEPTED' ? 'Friend invitation accepted!' : 'Friend invitation rejected.'
            );
            fetchReceivedInvitations();
            fetchFriends();
        } catch (error: any) {
            handleError(error);
        }
    };

    const handleError = (error: any) => {
        if (error.response) {
            const errorResponse: ErrorResponse = error.response.data;
            toast.error(errorResponse.cause || 'An unexpected error occurred.');
        } else {
            toast.error('Something went wrong. Please try again.');
        }
    };

    return (
        <Container>
            <Typography variant="h4" align="center" sx={{ my: 3 }}>
                Friends
            </Typography>
            <Paper elevation={3} sx={{ p: 2 }}>
                <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} centered>
                    <Tab label="Friends" />
                    <Tab label="Sent Invitations" />
                    <Tab label="Received Invitations" />
                </Tabs>
                <Box sx={{ mt: 3 }}>
                    {tabIndex === 0 && (
                        <Box>
                            <Box display="flex" gap={2} mb={3}>
                                <TextField
                                    label="Friend's Email"
                                    variant="outlined"
                                    fullWidth
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Button variant="contained" onClick={handleSendInvitation}>
                                    Send Invitation
                                </Button>
                            </Box>

                            {friends.length > 0 ? (
                                friends.map((friend) => (
                                    <Paper key={friend.email} sx={{ p: 2, mb: 2 }}>
                                        <Typography variant="h6">{friend.firstName} {friend.lastName}</Typography>
                                        <Typography color="textSecondary">{friend.email}</Typography>
                                    </Paper>
                                ))
                            ) : (
                                <Typography align="center">No friends yet.</Typography>
                            )}
                        </Box>
                    )}

                    {tabIndex === 1 && (
                        <Box>
                            {sentInvitations.length > 0 ? (
                                sentInvitations.map((inv) => (
                                    <Paper key={inv.id} sx={{ p: 2, mb: 2 }}>
                                        <Typography variant="h6">{inv.recipientFirstName} {inv.recipientLastName}</Typography>
                                        <Typography color="textSecondary">Status: {inv.status}</Typography>
                                    </Paper>
                                ))
                            ) : (
                                <Typography align="center">No sent invitations.</Typography>
                            )}
                        </Box>
                    )}

                    {tabIndex === 2 && (
                        <Box>
                            {receivedInvitations.length > 0 ? (
                                receivedInvitations.map((inv) => (
                                    <Paper key={inv.id} sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box>
                                            <Typography variant="h6">{inv.senderFirstName} {inv.senderLastName}</Typography>
                                            <Typography color="textSecondary">Sent: {new Date(inv.createdAt).toLocaleDateString()}</Typography>
                                        </Box>
                                        <Box>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                sx={{ mr: 1 }}
                                                onClick={() => handleRespondToInvitation(inv.id, 'ACCEPTED')}
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleRespondToInvitation(inv.id, 'REJECTED')}
                                            >
                                                Reject
                                            </Button>
                                        </Box>
                                    </Paper>
                                ))
                            ) : (
                                <Typography align="center">No received invitations.</Typography>
                            )}
                        </Box>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default Friends;
