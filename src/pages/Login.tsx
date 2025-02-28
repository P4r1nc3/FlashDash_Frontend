import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Box, Typography, Alert, Container } from '@mui/material';
import { login } from '../api/auth';
import { AuthContext } from '../contexts/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { token } = await login({ email, password });
            auth?.login(token);
            navigate('/account');
        } catch (err: any) {
            setError(err.response?.data?.cause || 'Login failed. Please try again.');
        }
    };

    return (
        <Container
            maxWidth="xs"
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 'calc(100vh - 80px)'
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
                    Welcome Back!
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    Login to continue
                </Typography>
                <form onSubmit={handleLogin} style={{ width: '100%' }}>
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
                        Login
                    </Button>
                </form>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        style={{
                            color: '#1976d2',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                        }}
                    >
                        Register
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default Login;
