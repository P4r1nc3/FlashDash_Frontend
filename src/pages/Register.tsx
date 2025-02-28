import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Box, Typography, Alert, Container } from '@mui/material';
import { register } from '../api/auth';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register({ firstName, lastName, email, password });
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.cause || 'Registration failed. Please try again.');
        }
    };

    return (
        <Container
            maxWidth="xs"
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 'calc(100vh - 80px)' // 100% wysokości ekranu minus 80px nawigacji
            }}
        >
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{
                    width: '100%',
                    boxShadow: 3,
                    p: 4,
                    borderRadius: 2,
                    backgroundColor: 'white',
                }}
            >
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Create an Account
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    Join us today!
                </Typography>
                <form onSubmit={handleRegister} style={{ width: '100%' }}>
                    <TextField
                        label="First Name"
                        type="text"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    <TextField
                        label="Last Name"
                        type="text"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                    <TextField
                        label="Email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 3, py: 1.5, fontSize: '1rem' }}
                    >
                        Register
                    </Button>
                </form>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        style={{
                            color: '#1976d2',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                        }}
                    >
                        Login
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default Register;
