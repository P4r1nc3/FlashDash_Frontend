import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
    const auth = useContext(AuthContext);

    return (
        <nav>
            <Link to="/">Home</Link>
            {auth?.isAuthenticated ? (
                <>
                    <Link to="/account">Account</Link>
                    <button onClick={auth.logout}>Logout</button>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            )}
        </nav>
    );
};

export default Navbar;
