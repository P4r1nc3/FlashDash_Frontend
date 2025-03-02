import { useEffect, useState } from "react";
import { getFriends, getSentInvitations, getReceivedInvitations, sendFriendInvitation, respondToInvitation, deleteFriend } from "../api/friends";
import { User } from "../interfaces/User";
import { FriendInvitationResponse } from "../interfaces/FriendInvitation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {AiOutlineUser, AiOutlineUserAdd, AiOutlineMail, AiOutlineSend,  AiOutlinePlus} from "react-icons/ai";
import { LiaUserFriendsSolid } from "react-icons/lia";

const Friends = () => {
    const [tabIndex, setTabIndex] = useState("friends");
    const [friends, setFriends] = useState<User[]>([]);
    const [sentInvitations, setSentInvitations] = useState<FriendInvitationResponse[]>([]);
    const [receivedInvitations, setReceivedInvitations] = useState<FriendInvitationResponse[]>([]);
    const [email, setEmail] = useState("");

    useEffect(() => {
        fetchFriends();
        fetchSentInvitations();
        fetchReceivedInvitations();
    }, []);

    const fetchFriends = async () => {
        try {
            const data = await getFriends();
            setFriends(data);
        } catch (error) {
            toast.error("Failed to load friends.");
        }
    };

    const fetchSentInvitations = async () => {
        try {
            const data = await getSentInvitations();
            setSentInvitations(data);
        } catch (error) {
            toast.error("Failed to load sent invitations.");
        }
    };

    const fetchReceivedInvitations = async () => {
        try {
            const data = await getReceivedInvitations();
            setReceivedInvitations(data);
        } catch (error) {
            toast.error("Failed to load received invitations.");
        }
    };

    const handleSendInvitation = async () => {
        if (!email) return;
        try {
            await sendFriendInvitation(email);
            setEmail("");
            toast.success("Friend invitation sent successfully!");
            fetchSentInvitations();
        } catch (error) {
            toast.error("Failed to send invitation.");
        }
    };

    const handleRespondToInvitation = async (invitationId: number, status: "ACCEPTED" | "REJECTED") => {
        try {
            await respondToInvitation(invitationId, status);
            toast.success(status === "ACCEPTED" ? "Friend invitation accepted!" : "Friend invitation rejected.");
            fetchSentInvitations();
            fetchReceivedInvitations();
            fetchFriends();
        } catch (error) {
            toast.error("Failed to respond to invitation.");
        }
    };

    const handleDeleteFriend = async (friendEmail: string) => {
        try {
            await deleteFriend(friendEmail);
            toast.success("Friend removed successfully.");
            fetchFriends();
        } catch (error) {
            toast.error("Failed to remove friend.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-300">
            <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-8 min-h-[80vh] flex flex-col">
                <h1 className="text-4xl font-bold text-center">Your Friends</h1>
                <p className="text-center text-gray-500">Manage your friendships easily.</p>

                {/* Nawigacja */}
                <div className="flex justify-center mt-6 space-x-6 border-b pb-3">
                    {[
                        { id: "friends", icon: <LiaUserFriendsSolid size={22} />, label: "Friends" },
                        { id: "received", icon: <AiOutlineMail size={22} />, label: `Received Invitations (${receivedInvitations.length})` },
                        { id: "sent", icon: <AiOutlineSend size={22} />, label: `Sent Invitations (${sentInvitations.length})` },
                    ].map(({ id, icon, label }) => (
                        <button
                            key={id}
                            className={`px-6 py-3 flex items-center gap-2 rounded-lg transition-all ${
                                tabIndex === id ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
                            }`}
                            onClick={() => setTabIndex(id)}
                        >
                            {icon} {label}
                        </button>
                    ))}
                </div>

                <div className="mt-6 flex-1">
                    {tabIndex === "friends" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <div className="p-6 bg-gray-100 rounded-lg shadow">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <AiOutlineUserAdd size={22} /> Add a Friend
                                </h2>
                                <div className="mt-4 flex gap-3">
                                    <input
                                        type="email"
                                        placeholder="Enter email"
                                        className="p-3 w-full bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <button className="bg-blue-500 text-white px-6 py-3 rounded-lg" onClick={handleSendInvitation}>
                                        Send
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 bg-gray-100 rounded-lg shadow">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold flex items-center gap-2">
                                        <LiaUserFriendsSolid size={22} /> Your Friends
                                        <span className="w-6 h-6 flex items-center justify-center bg-gray-300 text-gray-700 text-lg font-bold rounded-full">
                                            {friends.length}
                                        </span>
                                    </h2>
                                </div>

                                {friends.length > 0 ? (
                                    friends.map((friend) => (
                                        <div key={friend.email} className="flex justify-between items-center mt-4 p-4 bg-white rounded-lg shadow">
                                            <span className="text-lg font-semibold">{friend.firstName} {friend.lastName}</span>
                                            <button className="bg-red-500 text-white px-4 py-2 rounded-lg" onClick={() => handleDeleteFriend(friend.email)}>
                                                Remove
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 mt-2">No friends yet.</p>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {tabIndex === "received" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <div className="p-6 bg-gray-100 rounded-lg shadow">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <AiOutlineMail size={22} /> Received Invitations
                                </h2>
                                {receivedInvitations.length > 0 ? (
                                    receivedInvitations.map((inv) => (
                                        <div key={inv.id} className="flex justify-between items-center mt-4 p-4 bg-white rounded-lg shadow">
                                            <span className="text-lg">{inv.senderFirstName} {inv.senderLastName}</span>
                                            <div className="space-x-2">
                                                <button className="bg-green-500 text-white px-4 py-2 rounded-lg" onClick={() => handleRespondToInvitation(inv.id, "ACCEPTED")}>
                                                    Accept
                                                </button>
                                                <button className="bg-red-500 text-white px-4 py-2 rounded-lg" onClick={() => handleRespondToInvitation(inv.id, "REJECTED")}>
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 mt-2">No invitations.</p>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {tabIndex === "sent" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <div className="p-6 bg-gray-100 rounded-lg shadow">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <AiOutlineSend size={22} /> Sent Invitations
                                </h2>
                                {sentInvitations.length > 0 ? (
                                    sentInvitations.map((inv) => (
                                        <div key={inv.id} className="flex justify-between items-center mt-4 p-4 bg-white rounded-lg shadow">
                                            <span className="text-lg">{inv.recipientFirstName} {inv.recipientLastName}</span>
                                            <button className="bg-red-500 text-white px-4 py-2 rounded-lg" onClick={() => handleRespondToInvitation(inv.id, "REJECTED")}>
                                                Cancel
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 mt-2">No sent invitations.</p>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Friends;
