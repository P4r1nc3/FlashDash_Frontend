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
    AiOutlineSend,
    AiOutlineUser,
    AiOutlineCalendar
} from "react-icons/ai";
import {
    BsPersonCircle,
    BsPersonPlusFill,
    BsPersonXFill,
    BsCheck2Circle,
    BsXCircle,
    BsChevronDown,
    BsChevronUp
} from "react-icons/bs";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { FaRegStar, FaFire, FaRegClock, FaGamepad } from "react-icons/fa";
import MainLayout from "../../components/MainLayout.tsx";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import GradientButton from "../../components/ui/GradientButton";
import EmptyState from "../../components/ui/EmptyState";
import { motion, AnimatePresence } from "framer-motion";

const Friends = () => {
    const [tabIndex, setTabIndex] = useState("friends");
    const [friends, setFriends] = useState<User[]>([]);
    const [sentInvitations, setSentInvitations] = useState<FriendInvitationResponse[]>([]);
    const [receivedInvitations, setReceivedInvitations] = useState<FriendInvitationResponse[]>([]);
    const [email, setEmail] = useState("");
    const [expandedFriendId, setExpandedFriendId] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletingFriend, setDeletingFriend] = useState<User | null>(null);

    useEffect(() => {
        fetchFriends();
        fetchSentInvitations();
        fetchReceivedInvitations().catch(error => {
            console.error("Unhandled error in fetchReceivedInvitations:", error);
        });
    }, []);

    const fetchFriends = async () => {
        const data = await getFriends();
        setFriends(data);
    };

    const fetchSentInvitations = async () => {
        const data = await getSentInvitations();
        setSentInvitations(data);
    };

    const fetchReceivedInvitations = async () => {
        const data = await getReceivedInvitations();
        setReceivedInvitations(data);
    };

    const handleSendInvitation = async () => {
        if (!email) return;
        await sendFriendInvitation(email);
        setEmail("");
        toast.success("Friend invitation sent successfully!");
        fetchSentInvitations();
    };

    const handleRespondToInvitation = async (invitationFrn: string, status: "ACCEPTED" | "REJECTED" | "CANCELLED") => {
        await respondToInvitation(invitationFrn, status);
        toast.success(status === "ACCEPTED" ? "Friend invitation accepted!" : status === "REJECTED" ? "Friend invitation rejected." : "Friend invitation cancelled.");
        fetchSentInvitations();
        fetchReceivedInvitations();
        fetchFriends();
    };

    const handleDeleteFriend = async () => {
        if (!deletingFriend) return;
        await deleteFriend(deletingFriend.userFrn);
        toast.success("Friend removed successfully.");
        fetchFriends();
        setExpandedFriendId(null);
        setDeleteModalOpen(false);
        setDeletingFriend(null);
    };

    const openDeleteModal = (friend: User, e: React.MouseEvent) => {
        e.stopPropagation();
        setDeletingFriend(friend);
        setDeleteModalOpen(true);
    };

    const toggleExpandFriend = (userId: string) => {
        if (expandedFriendId === userId) {
            setExpandedFriendId(null);
        } else {
            setExpandedFriendId(userId);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getCreationYear = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.getFullYear();
    };

    const formatStudyTime = (minutes: number) => {
        if (!minutes) return "0 min";

        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours === 0) return `${remainingMinutes} min`;
        if (remainingMinutes === 0) return `${hours} hrs`;
        return `${hours} hrs ${remainingMinutes} min`;
    };

    const renderAddFriendAction = () => (
        <div className="flex gap-3">
            <input
                type="email"
                placeholder="Enter email address"
                className="p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 text-base w-72"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <GradientButton
                onClick={handleSendInvitation}
                className="px-4 py-2.5 text-sm font-medium min-w-[100px]"
            >
                Send
            </GradientButton>
        </div>
    );

    const renderFriendCard = (friend: User) => {
        const isExpanded = expandedFriendId === friend.userFrn;

        return (
            <div
                key={friend.userFrn}
                className="overflow-hidden bg-white rounded-lg border border-indigo-100 shadow-sm transition-all duration-300"
            >
                {/* Collapsed Card View */}
                <div
                    className={`flex justify-between items-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 cursor-pointer hover:bg-gradient-to-br hover:from-blue-100 hover:to-indigo-100 transition-colors duration-200 ${isExpanded ? 'border-b border-indigo-100' : ''}`}
                    onClick={() => toggleExpandFriend(friend.userFrn)}
                >
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center shadow-sm mr-3">
                            <span className="text-sm font-bold text-white">
                                {friend.firstName.charAt(0)}{friend.lastName.charAt(0)}
                            </span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">{friend.firstName} {friend.lastName}</h3>
                            <p className="text-gray-500 text-sm">{friend.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button
                            className="flex items-center justify-center h-9 w-9 text-red-600 border border-red-200 bg-white hover:bg-red-50 rounded-md transition-colors shadow-sm mr-3"
                            onClick={(e) => openDeleteModal(friend, e)}
                            title="Remove friend"
                        >
                            <BsPersonXFill size={18} />
                        </button>
                        {isExpanded ? <BsChevronUp size={18} className="text-indigo-500" /> : <BsChevronDown size={18} className="text-indigo-500" />}
                    </div>
                </div>

                {/* Expanded Profile View */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            {/* Profile Info */}
                            <div className="p-6 bg-white">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
                                    <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg mx-auto sm:mx-0">
                                        <span className="text-2xl font-bold text-white">
                                            {friend.firstName.charAt(0)}{friend.lastName.charAt(0)}
                                        </span>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-1">
                                            {friend.firstName} {friend.lastName}
                                        </h3>
                                        <p className="text-gray-600 flex items-center gap-2 justify-center sm:justify-start mb-2">
                                            <AiOutlineMail className="text-indigo-400" />
                                            <span>{friend.email}</span>
                                        </p>
                                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                            {friend.username && (
                                                <div className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm">
                                                    <AiOutlineUser className="mr-1" /> {friend.username}
                                                </div>
                                            )}
                                            {friend.createdAt && (
                                                <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                                                    <AiOutlineCalendar className="mr-1" /> Joined {formatDate(friend.createdAt).split(' ').slice(0, 2).join(' ')} {getCreationYear(friend.createdAt)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-indigo-100 rounded-lg overflow-hidden">
                                    <div className="bg-white p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center shadow-sm">
                                                <FaRegStar className="text-white text-xs" />
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs">Points</p>
                                                <p className="text-lg font-bold text-blue-600">{friend.points || 0}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full flex items-center justify-center shadow-sm">
                                                <FaGamepad className="text-white text-xs" />
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs">Games</p>
                                                <p className="text-lg font-bold text-yellow-600">{friend.gamesPlayed || 0}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-sm">
                                                <FaRegClock className="text-white text-xs" />
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs">Study Time</p>
                                                <p className="text-lg font-bold text-purple-600">{formatStudyTime(friend.studyTime || 0)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-sm">
                                                <FaFire className="text-white text-xs" />
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs">Streak</p>
                                                <p className="text-lg font-bold text-orange-500">{friend.streak || 0} days</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    const renderFriendsTab = () => (
        <div className="space-y-6 h-full flex flex-col">
            <Card
                title="Add a Friend"
                description="Send an invitation to connect with a friend."
                icon={<AiOutlineUserAdd size={22} />}
                actions={renderAddFriendAction()}
            />

            <Card
                title="Your Friends"
                description="People you are connected with."
                icon={<LiaUserFriendsSolid size={22} />}
                scrollable={true}
                fullHeight={true}
            >
                {friends.length > 0 ? (
                    <div className="space-y-4">
                        {friends.map((friend) => renderFriendCard(friend))}
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
            fullHeight={true}
        >
            {receivedInvitations.length > 0 ? (
                <div className="space-y-3">
                    {receivedInvitations.map((inv) => (
                        <div
                            key={inv.invitationId}
                            className="flex justify-between items-center p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border border-amber-100 hover:bg-gradient-to-br hover:from-yellow-100 hover:to-amber-100 transition-colors duration-200"
                        >
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full flex items-center justify-center shadow-sm mr-3">
                                    {inv.sender?.firstName && inv.sender?.lastName ? (
                                        <span className="text-sm font-bold text-white">
                                            {inv.sender.firstName.charAt(0)}{inv.sender.lastName.charAt(0)}
                                        </span>
                                    ) : (
                                        <BsPersonPlusFill className="text-white text-lg" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">{inv.sender?.firstName} {inv.sender?.lastName}</h3>
                                    <p className="text-gray-500 text-sm">{inv.sender?.email}</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    className="flex items-center justify-center h-9 w-9 text-green-600 border border-green-200 bg-white hover:bg-green-50 rounded-md transition-colors shadow-sm"
                                    onClick={() => handleRespondToInvitation(inv.invitationFrn, "ACCEPTED")}
                                    title="Accept invitation"
                                >
                                    <BsCheck2Circle size={18} />
                                </button>
                                <button
                                    className="flex items-center justify-center h-9 w-9 text-red-600 border border-red-200 bg-white hover:bg-red-50 rounded-md transition-colors shadow-sm"
                                    onClick={() => handleRespondToInvitation(inv.invitationFrn, "REJECTED")}
                                    title="Reject invitation"
                                >
                                    <BsXCircle size={18} />
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
            fullHeight={true}
        >
            {sentInvitations.length > 0 ? (
                <div className="space-y-3">
                    {sentInvitations.map((inv) => (
                        <div
                            key={inv.invitationId}
                            className="flex justify-between items-center p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg border border-slate-100 hover:from-gray-100 hover:to-slate-100 hover:bg-gradient-to-br transition-colors duration-200"
                        >
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-r from-slate-400 to-gray-400 rounded-full flex items-center justify-center shadow-sm mr-3">
                                    {inv.recipient?.firstName && inv.recipient?.lastName ? (
                                        <span className="text-sm font-bold text-white">
                                            {inv.recipient.firstName.charAt(0)}{inv.recipient.lastName.charAt(0)}
                                        </span>
                                    ) : (
                                        <AiOutlineSend className="text-white text-lg" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">{inv.recipient?.firstName} {inv.recipient?.lastName}</h3>
                                    <p className="text-gray-500 text-sm">{inv.recipient?.email}</p>
                                </div>
                            </div>
                            <button
                                className="flex items-center justify-center h-9 w-9 text-red-600 border border-red-200 bg-white hover:bg-red-50 rounded-md transition-colors shadow-sm"
                                onClick={() => handleRespondToInvitation(inv.invitationFrn, "CANCELLED")}
                                title="Cancel invitation"
                            >
                                <BsXCircle size={18} />
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

            <Modal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setDeletingFriend(null);
                }}
                title="Confirm Friend Removal"
                onSave={handleDeleteFriend}
                saveText="Remove Friend"
                width="w-96"
            >
                <p className="text-gray-600 mb-6">
                    Are you sure you want to remove {deletingFriend?.firstName} {deletingFriend?.lastName} from your friends?
                    This action cannot be undone.
                </p>
            </Modal>
        </MainLayout>
    );
};

export default Friends;