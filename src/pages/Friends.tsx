import { useEffect, useState } from "react";
import { getFriends, getSentInvitations, getReceivedInvitations, sendFriendInvitation, respondToInvitation, deleteFriend } from "../api/friends";
import { User } from "../interfaces/User";
import { FriendInvitationResponse } from "../interfaces/FriendInvitation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const IconFriends = () => <span className="text-2xl">👥</span>;
const IconInvitations = ({ count }: { count: number }) => (
    <span className="relative text-2xl">
        📩
        {count > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
                {count}
            </span>
        )}
    </span>
);

const IconSent = ({ count }: { count: number }) => (
    <span className="relative text-2xl">
        📤
        {count > 0 && (
            <span className="absolute -top-2 -right-3 bg-orange-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
                {count}
            </span>
        )}
    </span>
);

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
            <div className="w-full max-w-3xl bg-white shadow-xl rounded-xl p-8 min-h-[80vh] flex flex-col">
                <h1 className="text-4xl font-bold text-center">Your Friends</h1>
                <p className="text-center text-gray-500">Manage your friendships easily.</p>

                <div className="flex justify-center mt-6 space-x-6 border-b pb-3">
                    <button className={`px-6 py-3 rounded-lg transition-all ${tabIndex === "friends" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"}`} onClick={() => setTabIndex("friends")}>
                        <IconFriends /> Friends
                    </button>
                    <button
                        className={`px-6 py-3 rounded-lg transition-all ${tabIndex === "received" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"}`}
                        onClick={() => setTabIndex("received")}
                    >
                        <IconInvitations count={receivedInvitations.length} /> Received Invitations
                    </button>
                    <button
                        className={`px-6 py-3 rounded-lg transition-all ${tabIndex === "sent" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"}`}
                        onClick={() => setTabIndex("sent")}
                    >
                        <IconSent count={sentInvitations.length} /> Sent Invitations
                    </button>
                </div>

                <div className="mt-6 flex-1">
                    {tabIndex === "friends" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <div className="p-6 bg-gray-100 rounded-lg shadow">
                                <h2 className="text-xl font-semibold">Add a Friend</h2>
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
                                <h2 className="text-xl font-semibold">Your Friends</h2>
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
                                <h2 className="text-xl font-semibold">Received Invitations</h2>
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
                                <h2 className="text-xl font-semibold">Sent Invitations</h2>
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
