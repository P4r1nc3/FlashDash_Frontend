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
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 p-2 sm:p-4 md:p-6">
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
                className="relative w-full max-w-4xl bg-white shadow-lg rounded-xl overflow-hidden h-[90vh] flex flex-col mx-2 sm:mx-0"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                <div className="relative bg-gradient-to-r from-blue-400 to-indigo-400 text-white p-4 sm:p-6 md:p-8 pb-8 sm:pb-10 md:pb-12 flex-shrink-0">
                    {onBack && (
                        <button
                            className="absolute top-4 left-4 text-white hover:text-blue-50 flex items-center gap-2 transition-all bg-white bg-opacity-15 hover:bg-opacity-25 p-2 rounded-lg"
                            onClick={onBack}
                        >
                            <AiOutlineArrowLeft size={18} /> Back
                        </button>
                    )}

                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mt-4 text-white drop-shadow-sm">{title}</h1>
                    {description && (
                        <p className="text-center text-blue-50 mt-2 sm:mt-3 max-w-2xl mx-auto opacity-90 font-light text-sm sm:text-base">
                            {description}
                        </p>
                    )}
                </div>

                {tabs && tabs.length > 0 && setActiveTab && (
                    <div className="flex justify-center -mt-4 sm:-mt-5 md:-mt-6 px-2 sm:px-4 md:px-8 z-10 flex-shrink-0 overflow-x-auto">
                        <div className="bg-white rounded-lg shadow-md flex p-1">
                            {tabs.map(({ id, icon, label }) => (
                                <button
                                    key={id}
                                    className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 flex items-center gap-1 sm:gap-2 rounded-lg text-xs sm:text-sm md:text-base whitespace-nowrap ${
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

                <div className="p-3 sm:p-5 md:p-8 pt-4 sm:pt-5 md:pt-6 flex-grow overflow-auto h-full">
                    {children}
                </div>
            </motion.div>
        </div>
    );
};

export default MainLayout;