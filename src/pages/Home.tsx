import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ height: '100vh', textAlign: 'center' }}
        >
            <Typography variant="h3" gutterBottom>
                Welcome to FlashDash
            </Typography>
            <Typography variant="h6" gutterBottom>
                Your go-to platform for learning!
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/register')}
                sx={{ mt: 2 }}
            >
                Get Started
            </Button>
        </Box>
    );
};

export default Home;
