import { useEffect, useState } from "react";
import { getUserInfo } from "../../api/user.ts";
import { motion } from "framer-motion";
import { AiOutlineUser } from "react-icons/ai";

const ProfileTab = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await getUserInfo();
                setUser(data);
            } catch (err: any) {
                setError("Failed to fetch user information.");
            }
        };
        fetchUserInfo();
    }, []);

    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-gray-100 rounded-lg shadow">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <AiOutlineUser size={22} /> Profile Information
            </h2>
            {user ? (
                <div className="mt-4 space-y-4">
                    <div>
                        <p className="text-gray-500 text-sm">First Name</p>
                        <p className="text-lg font-semibold">{user.firstName}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Last Name</p>
                        <p className="text-lg font-semibold">{user.lastName}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Email</p>
                        <p className="text-lg font-semibold">{user.email}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Account Created</p>
                        <p className="text-lg font-semibold">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-500">Loading user data...</p>
            )}
        </motion.div>
    );
};

export default ProfileTab;
