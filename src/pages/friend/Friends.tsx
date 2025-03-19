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
import { BsPersonCircle, BsPersonPlusFill, BsPersonXFill, BsCheck2Circle, BsXCircle } from "react-icons/bs";
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
            toast.success(status === "ACCEPTED" ? "Friend invitation accepted!" : status === "REJECTED" ? "Friend invitation rejected." : "Friend invitation cancelled.");
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
                { id: "received", icon: <AiOutlineMail size={22} />, label: `Received (${receivedInvitations.length})` },
                { id: "sent", icon: <AiOutlineSend size={22} />, label: `Sent (${sentInvitations.length})` },
            ]}
            activeTab={tabIndex}
            setActiveTab={setTabIndex}
        >
            {tabIndex === "friends" && (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-md w-full">
                        <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-t-xl"></div>

                        <div className="p-6">
                            <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2 mb-1">
                                <AiOutlineUserAdd size={22} className="text-indigo-500" /> Add a Friend
                            </h2>
                            <p className="text-gray-500 mb-4 text-sm">Send an invitation to connect with a friend.</p>

                            <div className="flex gap-3">
                                <input
                                    type="email"
                                    placeholder="Enter email address"
                                    className="p-3 w-full bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 text-base"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button
                                    className="bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
                                    onClick={handleSendInvitation}
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md w-full">
                        <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-t-xl"></div>

                        <div className="p-6">
                            <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2 mb-1">
                                <LiaUserFriendsSolid size={22} className="text-indigo-500" /> Your Friends
                            </h2>
                            <p className="text-gray-500 mb-4 text-sm">People you are connected with.</p>

                            <div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                {friends.length > 0 ? (
                                    <div className="space-y-3">
                                        {friends.map((friend) => (
                                            <div
                                                key={friend.email}
                                                className="flex justify-between items-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-indigo-100"
                                            >
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center shadow-sm mr-3">
                                                        <BsPersonCircle className="text-white text-lg" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800">{friend.firstName} {friend.lastName}</h3>
                                                        <p className="text-gray-500 text-sm">{friend.email}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-2 rounded-lg flex items-center gap-1 transition-colors text-sm font-medium"
                                                    onClick={() => handleDeleteFriend(friend.userFrn)}
                                                >
                                                    <BsPersonXFill size={16} />
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                                        <BsPersonCircle size={48} className="text-gray-300 mb-3" />
                                        <p className="text-center">No friends yet.</p>
                                        <p className="text-center text-sm">Send invitations to add friends.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {tabIndex === "received" && (
                <div className="bg-white rounded-xl shadow-md w-full">
                    <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-t-xl"></div>

                    <div className="p-6">
                        <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2 mb-1">
                            <AiOutlineMail size={22} className="text-indigo-500" /> Received Invitations
                        </h2>
                        <p className="text-gray-500 mb-4 text-sm">Friend requests waiting for your response.</p>

                        <div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                            {receivedInvitations.length > 0 ? (
                                <div className="space-y-3">
                                    {receivedInvitations.map((inv) => (
                                        <div
                                            key={inv.invitationId}
                                            className="flex justify-between items-center p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border border-amber-100"
                                        >
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full flex items-center justify-center shadow-sm mr-3">
                                                    <BsPersonPlusFill className="text-white text-lg" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">{inv.sender?.firstName} {inv.sender?.lastName}</h3>
                                                    <p className="text-gray-500 text-sm">{inv.sender?.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    className="bg-green-100 text-green-600 hover:bg-green-200 px-3 py-2 rounded-lg flex items-center gap-1 transition-colors text-sm font-medium"
                                                    onClick={() => handleRespondToInvitation(inv.invitationFrn, "ACCEPTED")}
                                                >
                                                    <BsCheck2Circle size={16} />
                                                    Accept
                                                </button>
                                                <button
                                                    className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-2 rounded-lg flex items-center gap-1 transition-colors text-sm font-medium"
                                                    onClick={() => handleRespondToInvitation(inv.invitationFrn, "REJECTED")}
                                                >
                                                    <BsXCircle size={16} />
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                                    <AiOutlineMail size={48} className="text-gray-300 mb-3" />
                                    <p className="text-center">No invitations received.</p>
                                    <p className="text-center text-sm">When someone invites you, it will appear here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {tabIndex === "sent" && (
                <div className="bg-white rounded-xl shadow-md w-full">
                    <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-t-xl"></div>

                    <div className="p-6">
                        <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2 mb-1">
                            <AiOutlineSend size={22} className="text-indigo-500" /> Sent Invitations
                        </h2>
                        <p className="text-gray-500 mb-4 text-sm">Pending invitations you've sent to others.</p>

                        <div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                            {sentInvitations.length > 0 ? (
                                <div className="space-y-3">
                                    {sentInvitations.map((inv) => (
                                        <div
                                            key={inv.invitationId}
                                            className="flex justify-between items-center p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg border border-slate-100"
                                        >
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gradient-to-r from-slate-400 to-gray-400 rounded-full flex items-center justify-center shadow-sm mr-3">
                                                    <AiOutlineSend className="text-white text-lg" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">{inv.recipient?.firstName} {inv.recipient?.lastName}</h3>
                                                    <p className="text-gray-500 text-sm">{inv.recipient?.email}</p>
                                                </div>
                                            </div>
                                            <button
                                                className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-2 rounded-lg flex items-center gap-1 transition-colors text-sm font-medium"
                                                onClick={() => handleRespondToInvitation(inv.invitationFrn, "CANCELLED")}
                                            >
                                                <BsXCircle size={16} />
                                                Cancel
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                                    <AiOutlineSend size={48} className="text-gray-300 mb-3" />
                                    <p className="text-center">No pending invitations.</p>
                                    <p className="text-center text-sm">Add a friend to send an invitation.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

// Add custom scrollbar styles
const style = document.createElement('style');
style.innerHTML = `
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #60a5fa, #818cf8);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #3b82f6, #6366f1);
}
`;
document.head.appendChild(style);

export default Friends;