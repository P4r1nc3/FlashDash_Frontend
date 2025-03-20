import { ReactNode } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface MainLayoutProps {
    title: string;
    description?: string;
    tabs?: { id: string; label: string; icon?: ReactNode }[];
    activeTab?: string;
    setActiveTab?: (tab: string) => void;
    onBack?: () => void;
    children: ReactNode;
}

const MainLayout = ({ title, description, tabs, activeTab, setActiveTab, onBack, children }: MainLayoutProps) => {
    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        },
        exit: { opacity: 0, y: 20 }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50">
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <motion.div
                className="relative w-full max-w-4xl bg-white shadow-lg rounded-xl overflow-hidden min-h-[80vh] flex flex-col"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                {/* Header Section with Background */}
                <div className="relative bg-gradient-to-r from-blue-400 to-indigo-400 text-white p-8 pb-12">
                    {/* Back Button */}
                    {onBack && (
                        <button
                            className="absolute top-4 left-4 text-white hover:text-blue-50 flex items-center gap-2 transition-all bg-white bg-opacity-15 hover:bg-opacity-25 p-2 rounded-lg"
                            onClick={onBack}
                        >
                            <AiOutlineArrowLeft size={18} /> Back
                        </button>
                    )}

                    {/* Page Title with drop shadow */}
                    <h1 className="text-4xl font-bold text-center mt-4 text-white drop-shadow-sm">{title}</h1>
                    {description && <p className="text-center text-blue-50 mt-3 max-w-2xl mx-auto opacity-90 font-light">{description}</p>}
                </div>

                {/* Navigation Tabs */}
                {tabs && tabs.length > 0 && setActiveTab && (
                    <div className="flex justify-center -mt-6 px-8">
                        <div className="bg-white rounded-lg shadow-md flex p-1 z-10">
                            {tabs.map(({ id, icon, label }) => (
                                <button
                                    key={id}
                                    className={`px-5 py-2.5 flex items-center gap-2 rounded-lg ${
                                        activeTab === id
                                            ? "bg-gradient-to-r from-blue-300 to-indigo-400 text-white shadow-sm font-medium"
                                            : "text-gray-600 hover:bg-blue-50 hover:text-indigo-500"
                                    }`}
                                    onClick={() => setActiveTab && setActiveTab(id)}
                                >
                                    {icon} {label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="p-8 pt-6 flex-1 overflow-auto">{children}</div>
            </motion.div>
        </div>
    );
};

export default MainLayout;