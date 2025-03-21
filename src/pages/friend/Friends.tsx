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
import {
    AiOutlineUserAdd,
    AiOutlineMail,
    AiOutlineSend
} from "react-icons/ai";
import { BsPersonCircle, BsPersonPlusFill, BsPersonXFill, BsCheck2Circle, BsXCircle } from "react-icons/bs";
import { LiaUserFriendsSolid } from "react-icons/lia";
import MainLayout from "../../components/MainLayout.tsx";
import Card from "../../components/ui/Card";
import GradientButton from "../../components/ui/GradientButton";
import EmptyState from "../../components/ui/EmptyState";

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

    const renderFriendsTab = () => (
        <div className="space-y-6">
            <Card
                title="Add a Friend"
                description="Send an invitation to connect with a friend."
                icon={<AiOutlineUserAdd size={22} />}
            >
                <div className="flex gap-3 justify-end">
                    <input
                        type="email"
                        placeholder="Enter email address"
                        className="p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 text-base flex-grow"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <GradientButton
                        onClick={handleSendInvitation}
                        className="px-6 py-3"
                    >
                        Send
                    </GradientButton>
                </div>
            </Card>

            <Card
                title="Your Friends"
                description="People you are connected with."
                icon={<LiaUserFriendsSolid size={22} />}
                scrollable={true}
                maxHeight="max-h-[36vh]"
            >
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
                    <EmptyState
                        icon={<BsPersonCircle size={48} />}
                        title="No friends yet."
                        description="Send invitations to add friends."
                    />
                )}
            </Card>
        </div>
    );

    const renderReceivedTab = () => (
        <Card
            title="Received Invitations"
            description="Friend requests waiting for your response."
            icon={<AiOutlineMail size={22} />}
            scrollable={true}
            maxHeight="max-h-[36vh]"
        >
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
                <EmptyState
                    icon={<AiOutlineMail size={48} />}
                    title="No invitations received."
                    description="When someone invites you, it will appear here."
                />
            )}
        </Card>
    );

    const renderSentTab = () => (
        <Card
            title="Sent Invitations"
            description="Pending invitations you've sent to others."
            icon={<AiOutlineSend size={22} />}
            scrollable={true}
            maxHeight="max-h-[36vh]"
        >
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
                <EmptyState
                    icon={<AiOutlineSend size={48} />}
                    title="No pending invitations."
                    description="Add a friend to send an invitation."
                />
            )}
        </Card>
    );

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
            {tabIndex === "friends" && renderFriendsTab()}
            {tabIndex === "received" && renderReceivedTab()}
            {tabIndex === "sent" && renderSentTab()}
        </MainLayout>
    );
};

export default Friends;