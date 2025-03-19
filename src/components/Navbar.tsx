import { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { FaLayerGroup, FaUsers, FaUser, FaSignOutAlt, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { motion } from "framer-motion";

const Navbar = () => {
    const auth = useContext(AuthContext);
    const [isExpanded, setIsExpanded] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const content = document.getElementById("content");
        if (content) {
            content.style.marginLeft = auth?.isAuthenticated ? (isExpanded ? "260px" : "80px") : "0"; // If not logged in, full width
        }
    }, [isExpanded, auth?.isAuthenticated]);

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    const isActive = (path) => {
        return location.pathname.startsWith(path);
    };

    if (!auth?.isAuthenticated) {
        return (
            <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link
                        to="/"
                        className="text-2xl font-extrabold tracking-wide text-gray-900 font-poppins"
                    >
                        Flash<span className="text-blue-500">Dash</span>
                    </Link>

                    <div className="flex space-x-8">
                        <Link
                            to="/login"
                            className={`font-semibold text-lg transition-colors duration-200 ${
                                location.pathname === '/login'
                                    ? 'text-blue-500'
                                    : 'text-gray-700 hover:text-blue-500'
                            }`}
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className={`font-semibold text-lg transition-colors duration-200 ${
                                location.pathname === '/register'
                                    ? 'text-blue-500'
                                    : 'text-gray-700 hover:text-blue-500'
                            }`}
                        >
                            Register
                        </Link>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav
            className={`bg-white shadow-lg fixed top-0 left-0 h-screen z-50 flex flex-col p-6 transition-all duration-300 ease-in-out
            ${isExpanded ? "w-[260px]" : "w-[80px]"}`}
            style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}
        >
            {/* Toggle button on the right edge */}
            <button
                className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg z-10 transition-all duration-200 w-8 h-8 flex items-center justify-center border border-gray-200"
                onClick={toggleSidebar}
                aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
            >
                {isExpanded ? (
                    <FaChevronLeft className="text-gray-600 w-4 h-4" />
                ) : (
                    <FaChevronRight className="text-gray-600 w-4 h-4" />
                )}
            </button>

            {/* Logo Container - Now clickable to toggle sidebar */}
            <div className="mb-12 flex items-center cursor-pointer" onClick={toggleSidebar}>
                <div className="flex items-center h-12">
                    <div className="relative h-full flex items-center">
                        {/* We'll use absolute positioning for both logos to prevent jumping */}
                        <div className="relative h-full flex items-center">
                            {/* The full logo (FlashDash) */}
                            <motion.div
                                animate={{
                                    width: isExpanded ? "auto" : "0px",
                                    opacity: isExpanded ? 1 : 0,
                                    x: isExpanded ? 0 : -10
                                }}
                                transition={{
                                    duration: 0.4,
                                    ease: [0.25, 1, 0.5, 1]
                                }}
                                className="text-3xl font-extrabold tracking-wide overflow-hidden whitespace-nowrap absolute left-0"
                                style={{ height: "100%", display: "flex", alignItems: "center" }}
                            >
                                <span className="text-gray-900">Flash</span>
                                <span className="text-blue-500">Dash</span>
                            </motion.div>

                            {/* The short logo (FD) */}
                            <motion.div
                                animate={{
                                    opacity: isExpanded ? 0 : 1,
                                    scale: isExpanded ? 0.9 : 1
                                }}
                                transition={{
                                    duration: 0.4,
                                    ease: [0.25, 1, 0.5, 1]
                                }}
                                className="text-3xl font-extrabold tracking-wide absolute left-0"
                                style={{ height: "100%", display: "flex", alignItems: "center" }}
                            >
                                <span className="text-gray-900">F</span>
                                <span className="text-blue-500">D</span>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col space-y-8 w-full">
                {/* Navigation Links with Active Highlighting */}
                <Link
                    to="/decks"
                    className={`flex items-center w-full text-xl font-semibold ${
                        isActive('/decks')
                            ? 'text-blue-500'
                            : 'text-gray-700 hover:text-gray-900'
                    } rounded-lg py-2 px-1`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <FaLayerGroup className={`w-[32px] h-[32px] flex-shrink-0 ${isActive('/decks') ? 'text-blue-500' : ''}`} />
                    <span className={`ml-6 transition-all duration-300 ${isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"}`}>
                        Decks
                    </span>
                </Link>

                <Link
                    to="/friends"
                    className={`flex items-center w-full text-xl font-semibold ${
                        isActive('/friends')
                            ? 'text-blue-500'
                            : 'text-gray-700 hover:text-gray-900'
                    } rounded-lg py-2 px-1`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <FaUsers className={`w-[32px] h-[32px] flex-shrink-0 ${isActive('/friends') ? 'text-blue-500' : ''}`} />
                    <span className={`ml-6 transition-all duration-300 ${isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"}`}>
                        Friends
                    </span>
                </Link>

                <Link
                    to="/account"
                    className={`flex items-center w-full text-xl font-semibold ${
                        isActive('/account')
                            ? 'text-blue-500'
                            : 'text-gray-700 hover:text-gray-900'
                    } rounded-lg py-2 px-1`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <FaUser className={`w-[32px] h-[32px] flex-shrink-0 ${isActive('/account') ? 'text-blue-500' : ''}`} />
                    <span className={`ml-6 transition-all duration-300 ${isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"}`}>
                        Account
                    </span>
                </Link>

                <button
                    className="flex items-center text-red-500 hover:text-red-600 w-full text-xl font-semibold rounded-lg py-2 px-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        auth.logout();
                    }}
                >
                    <FaSignOutAlt className="w-[32px] h-[32px] flex-shrink-0" />
                    <span className={`ml-6 transition-all duration-300 ${isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"}`}>
                        Logout
                    </span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;