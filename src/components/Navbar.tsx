import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
    const auth = useContext(AuthContext);

    return (
        <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: 1 }}>
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                {/* Logo po lewej stronie */}
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{
                        textDecoration: 'none',
                        color: 'black',
                        fontWeight: 'bold',
                        fontFamily: 'Roboto, sans-serif',
                    }}
                >
                    FlashDash
                </Typography>

                {/* Linki po prawej stronie */}
                <Box>
                    {auth?.isAuthenticated ? (
                        <>
                            <Button
                                component={Link}
                                to="/account"
                                sx={{
                                    textTransform: 'none',
                                    color: 'black',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                }}
                            >
                                Account
                            </Button>
                            <Button
                                onClick={auth.logout}
                                sx={{
                                    textTransform: 'none',
                                    color: 'black',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                }}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                component={Link}
                                to="/login"
                                sx={{
                                    textTransform: 'none',
                                    color: 'black',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                }}
                            >
                                Login
                            </Button>
                            <Button
                                component={Link}
                                to="/register"
                                sx={{
                                    textTransform: 'none',
                                    color: 'black',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                }}
                            >
                                Register
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
