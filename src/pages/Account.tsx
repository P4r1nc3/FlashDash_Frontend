import { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Tabs, Tab } from '@mui/material';
import { getUserInfo } from '../api/user';
import { User } from '../interfaces/User';

const Account = () => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState('');
    const [tabIndex, setTabIndex] = useState(0);

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
                        <Typography align="center" sx={{ mt: 3 }}>
                            Password change functionality coming soon.
                        </Typography>
                    )}

                    {tabIndex === 2 && (
                        <Typography align="center" sx={{ mt: 3, color: 'red', fontWeight: 'bold' }}>
                            Delete account functionality coming soon.
                        </Typography>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default Account;
