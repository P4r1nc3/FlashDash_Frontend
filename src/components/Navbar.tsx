import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { FaBars, FaLayerGroup, FaUsers, FaUser, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
    const auth = useContext(AuthContext);
    const [isExpanded, setIsExpanded] = useState(false);

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
                        <Link to="/login" className="text-gray-700 font-semibold text-lg hover:text-blue-500">
                            Login
                        </Link>
                        <Link to="/register" className="text-gray-700 font-semibold text-lg hover:text-blue-500">
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
        >
            <button
                className="mb-12 text-gray-800 hover:text-gray-900 self-start"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <FaBars size={32} />
            </button>

            <div className="flex flex-col space-y-8 w-full">
                <Link to="/decks" className="flex items-center text-gray-700 hover:text-gray-900 w-full text-xl font-semibold transition-all duration-300">
                    <FaLayerGroup className="w-[32px] h-[32px] flex-shrink-0" />
                    <span className={`ml-6 transition-all duration-300 ${isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"}`}>
                        Decks
                    </span>
                </Link>

                <Link to="/friends" className="flex items-center text-gray-700 hover:text-gray-900 w-full text-xl font-semibold transition-all duration-300">
                    <FaUsers className="w-[32px] h-[32px] flex-shrink-0" />
                    <span className={`ml-6 transition-all duration-300 ${isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"}`}>
                        Friends
                    </span>
                </Link>

                <Link to="/account" className="flex items-center text-gray-700 hover:text-gray-900 w-full text-xl font-semibold transition-all duration-300">
                    <FaUser className="w-[32px] h-[32px] flex-shrink-0" />
                    <span className={`ml-6 transition-all duration-300 ${isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"}`}>
                        Account
                    </span>
                </Link>

                <button
                    onClick={auth.logout}
                    className="flex items-center text-red-500 hover:text-red-600 w-full text-xl font-semibold transition-opacity duration-300"
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
