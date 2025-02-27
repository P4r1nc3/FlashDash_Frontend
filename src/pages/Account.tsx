import { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Tabs, Tab, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { getUserInfo, changeUserPassword, deleteUserAccount } from '../api/user';
import { User } from '../interfaces/User';
import { ChangePasswordRequest } from '../interfaces/ChangePassword';


const Account = () => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState('');
    const [tabIndex, setTabIndex] = useState(0);
    const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
    const [passwordError, setPasswordError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await getUserInfo();
                setUser(data);
            } catch (err: any) {
                setError(err.response?.data?.cause || 'Failed to fetch user information.');
            }
        };

        fetchUserInfo();
    }, []);

    const handlePasswordChange = async () => {
        try {
            if (!passwords.oldPassword || !passwords.newPassword) {
                setPasswordError('Both fields are required.');
                return;
            }

            await changeUserPassword({ oldPassword: passwords.oldPassword, newPassword: passwords.newPassword });
            setPasswords({ oldPassword: '', newPassword: '' });
            setPasswordError('');
            alert('Password changed successfully.');
        } catch (error) {
            setPasswordError('Failed to change password.');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteUserAccount();
            alert('Account deleted successfully.');
            window.location.href = '/';
        } catch (error) {
            alert('Failed to delete account.');
        }
    };

    if (error) {
        return <Typography color="error" align="center" sx={{ mt: 3 }}>{error}</Typography>;
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h4" align="center" sx={{ mt: 4, fontWeight: 'bold' }}>
                Welcome, {user?.firstName}
            </Typography>
            <Typography variant="subtitle1" align="center" color="textSecondary">
                {new Date().toLocaleDateString()}
            </Typography>

            <Paper elevation={3} sx={{ mt: 3, p: 3 }}>
                <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} centered>
                    <Tab label="Profile Information" />
                    <Tab label="Change Password" />
                    <Tab label="Delete Account" />
                </Tabs>

                <Box sx={{ mt: 3 }}>
                    {tabIndex === 0 && user && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Profile Information
                            </Typography>
                            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                                    <Box>
                                        <Typography variant="body2" color="textSecondary">First Name</Typography>
                                        <Typography variant="h6">{user.firstName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" color="textSecondary">Last Name</Typography>
                                        <Typography variant="h6">{user.lastName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" color="textSecondary">Email</Typography>
                                        <Typography variant="h6">{user.email}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" color="textSecondary">Account Created</Typography>
                                        <Typography variant="h6">{new Date(user.createdAt).toLocaleDateString()}</Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Box>
                    )}

                    {tabIndex === 1 && (
                        <Box textAlign="center" sx={{ mt: 3 }}>
                            <Typography variant="h6" fontWeight="bold">Change Password</Typography>
                            <TextField
                                label="Old Password"
                                type="password"
                                fullWidth
                                sx={{ mt: 2 }}
                                value={passwords.oldPassword}
                                onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                            />
                            <TextField
                                label="New Password"
                                type="password"
                                fullWidth
                                sx={{ mt: 2 }}
                                value={passwords.newPassword}
                                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                            />
                            {passwordError && <Typography color="error" sx={{ mt: 1 }}>{passwordError}</Typography>}
                            <Button variant="contained" sx={{ mt: 2 }} onClick={handlePasswordChange}>Change Password</Button>
                        </Box>
                    )}

                    {tabIndex === 2 && (
                        <Box textAlign="center" sx={{ mt: 3 }}>
                            <Typography color="error" fontWeight="bold">Delete Account</Typography>
                            <Button variant="contained" color="error" sx={{ mt: 2 }} onClick={() => setModalOpen(true)}>
                                Confirm Delete
                            </Button>
                        </Box>
                    )}
                </Box>
            </Paper>

            <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
                <DialogTitle>Confirm Account Deletion</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete your account? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setModalOpen(false)}>Cancel</Button>
                    <Button color="error" onClick={handleDeleteAccount}>Delete</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Account;
