import { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { FaLayerGroup, FaUsers, FaUser, FaSignOutAlt } from "react-icons/fa";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { motion } from "framer-motion";

const Navbar = () => {
    const auth = useContext(AuthContext);
    const [isExpanded, setIsExpanded] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const content = document.getElementById("content");
        if (content) {
            content.style.marginLeft = auth?.isAuthenticated ? (isExpanded ? "260px" : "80px") : "0";
            content.style.transition = "margin-left 0.3s ease-in-out";
        }
    }, [isExpanded, auth?.isAuthenticated]);

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    const isActive = (path: string) => {
        return location.pathname.startsWith(path);
    };

    if (!auth?.isAuthenticated) {
        return (
            <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    {/* Updated Logo to match the expanded sidebar logo */}
                    <Link
                        to="/"
                        className="text-3xl font-extrabold tracking-wide font-poppins"
                    >
                        <span className="text-gray-900">Flash</span>
                        <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Dash</span>
                    </Link>

                    <div className="flex space-x-8">
                        <Link
                            to="/login"
                            className={`flex items-center font-medium text-lg transition-colors duration-200 px-3 py-2 rounded-lg ${
                                location.pathname === '/login'
                                    ? 'bg-indigo-50 text-indigo-500'
                                    : 'text-gray-600 hover:text-indigo-500 hover:bg-blue-50'
                            }`}
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className={`flex items-center font-medium text-lg transition-colors duration-200 px-3 py-2 rounded-lg ${
                                location.pathname === '/register'
                                    ? 'bg-indigo-50 text-indigo-500'
                                    : 'text-gray-600 hover:text-indigo-500 hover:bg-blue-50'
                            }`}
                        >
                            Register
                        </Link>
                    </div>
                </div>
                {/* Added bottom gradient line */}
                <div className="h-1 w-full bg-gradient-to-r from-blue-200 to-indigo-200"></div>
            </nav>
        );
    }

    return (
        <nav
            className={`bg-white shadow-lg fixed top-0 left-0 h-screen z-50 flex flex-col transition-all duration-300 ease-in-out
            ${isExpanded ? "w-[260px]" : "w-[80px]"}`}
            style={{ boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.05)' }}
        >
            {/* Toggle button with updated styling */}
            <button
                className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg z-10 transition-all duration-200 w-8 h-8 flex items-center justify-center border border-indigo-100 text-indigo-400 hover:text-blue-500"
                onClick={toggleSidebar}
                aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
            >
                {isExpanded ? (
                    <IoChevronBackOutline className="w-4 h-4" />
                ) : (
                    <IoChevronForwardOutline className="w-4 h-4" />
                )}
            </button>

            {/* Logo Container with updated styling */}
            <div className="mb-12 flex items-center cursor-pointer px-6 pt-8" onClick={toggleSidebar}>
                <div className="flex items-center h-12">
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
                            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Dash</span>
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
                            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">D</span>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Navigation Menu with updated styling */}
            <div className="flex flex-col space-y-6 w-full px-4">
                {/* Navigation Links with Active Highlighting */}
                <Link
                    to="/decks"
                    className={`flex items-center w-full text-lg font-medium transition-colors duration-200 rounded-lg py-2.5 px-3 ${
                        isActive('/decks')
                            ? 'bg-indigo-50 text-indigo-500'
                            : 'text-gray-600 hover:text-indigo-500 hover:bg-blue-50'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <FaLayerGroup className={`w-6 h-6 flex-shrink-0 ${isActive('/decks') ? 'text-indigo-400' : 'text-gray-500'}`} />
                    <span className={`ml-4 transition-all duration-300 ${isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"}`}>
                        Decks
                    </span>
                    {isActive('/decks') && !isExpanded && (
                        <div className="absolute left-0 w-1 h-8 bg-gradient-to-b from-blue-400 to-indigo-400 rounded-r-md"></div>
                    )}
                </Link>

                <Link
                    to="/friends"
                    className={`flex items-center w-full text-lg font-medium transition-colors duration-200 rounded-lg py-2.5 px-3 ${
                        isActive('/friends')
                            ? 'bg-indigo-50 text-indigo-500'
                            : 'text-gray-600 hover:text-indigo-500 hover:bg-blue-50'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <FaUsers className={`w-6 h-6 flex-shrink-0 ${isActive('/friends') ? 'text-indigo-400' : 'text-gray-500'}`} />
                    <span className={`ml-4 transition-all duration-300 ${isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"}`}>
                        Friends
                    </span>
                    {isActive('/friends') && !isExpanded && (
                        <div className="absolute left-0 w-1 h-8 bg-gradient-to-b from-blue-400 to-indigo-400 rounded-r-md"></div>
                    )}
                </Link>

                <Link
                    to="/account"
                    className={`flex items-center w-full text-lg font-medium transition-colors duration-200 rounded-lg py-2.5 px-3 ${
                        isActive('/account')
                            ? 'bg-indigo-50 text-indigo-500'
                            : 'text-gray-600 hover:text-indigo-500 hover:bg-blue-50'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <FaUser className={`w-6 h-6 flex-shrink-0 ${isActive('/account') ? 'text-indigo-400' : 'text-gray-500'}`} />
                    <span className={`ml-4 transition-all duration-300 ${isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"}`}>
                        Account
                    </span>
                    {isActive('/account') && !isExpanded && (
                        <div className="absolute left-0 w-1 h-8 bg-gradient-to-b from-blue-400 to-indigo-400 rounded-r-md"></div>
                    )}
                </Link>

                {/* Divider */}
                <div className="border-t border-gray-100 w-full my-2"></div>

                <button
                    className="flex items-center text-gray-600 hover:text-red-500 hover:bg-red-50 w-full text-lg font-medium rounded-lg py-2.5 px-3 transition-colors duration-200"
                    onClick={(e) => {
                        e.stopPropagation();
                        auth.logout();
                    }}
                >
                    <FaSignOutAlt className="w-6 h-6 flex-shrink-0 text-gray-500" />
                    <span className={`ml-4 transition-all duration-300 ${isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"}`}>
                        Logout
                    </span>
                </button>
            </div>

            {/* Bottom gradient line */}
            <div className="mt-auto">
                <div className="h-1 w-full bg-gradient-to-r from-blue-200 to-indigo-200"></div>
            </div>
        </nav>
    );
};

export default Navbar;