import { useEffect, useState } from "react";
import {
    getFriends,
    getSentInvitations,
    getReceivedInvitations,
    sendFriendInvitation,
    respondToInvitation,
    deleteFriend
} from "../../api/friends.ts";
import { User } from "../../interfaces/User.ts";
import { FriendInvitationResponse } from "../../interfaces/FriendInvitation.ts";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
    AiOutlineUserAdd,
    AiOutlineMail,
    AiOutlineSend
} from "react-icons/ai";
import { LiaUserFriendsSolid } from "react-icons/lia";
import MainLayout from "../../components/MainLayout.tsx";

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

    const handleRespondToInvitation = async (invitationFrn: string, status: "ACCEPTED" | "REJECTED" | "CANCELLED") => {
        try {
            await respondToInvitation(invitationFrn, status);
            toast.success(status === "ACCEPTED" ? "Friend invitation accepted!" : "Friend invitation rejected.");
            fetchSentInvitations();
            fetchReceivedInvitations();
            fetchFriends();
        } catch (error) {
            toast.error("Failed to respond to invitation.");
        }
    };

    const handleDeleteFriend = async (friendFrn: string) => {
        try {
            await deleteFriend(friendFrn);
            toast.success("Friend removed successfully.");
            fetchFriends();
        } catch (error) {
            toast.error("Failed to remove friend.");
        }
    };

    return (
        <MainLayout
            title="Your Friends"
            description="Manage your friendships easily."
            tabs={[
                { id: "friends", icon: <LiaUserFriendsSolid size={22} />, label: `Friends (${friends.length})` },
                { id: "received", icon: <AiOutlineMail size={22} />, label: `Received Invitations (${receivedInvitations.length})` },
                { id: "sent", icon: <AiOutlineSend size={22} />, label: `Sent Invitations (${sentInvitations.length})` },
            ]}
            activeTab={tabIndex}
            setActiveTab={setTabIndex}
        >
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
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <LiaUserFriendsSolid size={22} /> Your Friends
                        </h2>
                        {friends.length > 0 ? (
                            friends.map((friend) => (
                                <div key={friend.email} className="flex justify-between items-center mt-4 p-4 bg-white rounded-lg shadow">
                                    <span className="text-lg font-semibold">{friend.firstName} {friend.lastName}</span>
                                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg" onClick={() => handleDeleteFriend(friend.userFrn)}>
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
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-gray-100 rounded-lg shadow">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <AiOutlineMail size={22} /> Received Invitations
                    </h2>
                    {receivedInvitations.length > 0 ? (
                        receivedInvitations.map((inv) => (
                            <div key={inv.invitationId} className="flex justify-between items-center mt-4 p-4 bg-white rounded-lg shadow">
                                <span className="text-lg">{inv.sender?.firstName} {inv.sender?.lastName}</span>
                                <div className="space-x-2">
                                    <button
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg"
                                        onClick={() => handleRespondToInvitation(inv.invitationFrn, "ACCEPTED")}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                                        onClick={() => handleRespondToInvitation(inv.invitationFrn, "REJECTED")}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 mt-2">No invitations.</p>
                    )}
                </motion.div>
            )}

            {tabIndex === "sent" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-gray-100 rounded-lg shadow">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <AiOutlineSend size={22} /> Sent Invitations
                    </h2>
                    {sentInvitations.length > 0 ? (
                        sentInvitations.map((inv) => (
                            <div key={inv.invitationId} className="flex justify-between items-center mt-4 p-4 bg-white rounded-lg shadow">
                                <span className="text-lg">{inv.recipient?.firstName} {inv.recipient?.lastName}</span>
                                <button className="bg-red-500 text-white px-4 py-2 rounded-lg" onClick={() => handleRespondToInvitation(inv.invitationFrn, "CANCELLED")}>
                                    Cancel
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 mt-2">No sent invitations.</p>
                    )}
                </motion.div>
            )}
        </MainLayout>
    );
};

export default Friends;
