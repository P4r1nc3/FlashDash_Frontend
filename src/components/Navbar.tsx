import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
    const auth = useContext(AuthContext);

    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-xl font-extrabold tracking-wide text-gray-900 font-poppins">
                    Flash<span className="text-blue-500">Dash</span>
                </Link>

                {/* Nawigacja */}
                <div className="flex space-x-6">
                    {auth?.isAuthenticated ? (
                        <>
                            <NavItem to="/decks">Decks</NavItem>
                            <NavItem to="/friends">Friends</NavItem>
                            <NavItem to="/account">Account</NavItem>
                            <button
                                onClick={auth.logout}
                                className="nav-item text-red-500 hover:text-red-600"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavItem to="/login">Login</NavItem>
                            <NavItem to="/register">Register</NavItem>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

const NavItem = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link to={to} className="nav-item">
        {children}
    </Link>
);

export default Navbar;
