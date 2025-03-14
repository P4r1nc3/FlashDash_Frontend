import { ReactNode } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";

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
    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-300">
            <div className="relative w-full max-w-4xl bg-white shadow-xl rounded-xl p-8 min-h-[80vh] flex flex-col">
                {/* Back Button */}
                {onBack && (
                    <button
                        className="absolute top-4 left-4 text-gray-600 hover:text-gray-800 flex items-center gap-2"
                        onClick={onBack}
                    >
                        <AiOutlineArrowLeft size={20} /> Back
                    </button>
                )}

                {/* Page Title */}
                <h1 className="text-4xl font-bold text-center">{title}</h1>
                {description && <p className="text-center text-gray-500">{description}</p>}

                {/* Navigation Tabs (if applicable) */}
                {tabs && tabs.length > 0 && setActiveTab && (
                    <div className="flex justify-center mt-6 space-x-6 border-b pb-3">
                        {tabs.map(({ id, icon, label }) => (
                            <button
                                key={id}
                                className={`px-6 py-3 flex items-center gap-2 rounded-lg transition-all ${
                                    activeTab === id ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
                                }`}
                                onClick={() => setActiveTab && setActiveTab(id)}
                            >
                                {icon} {label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Content */}
                <div className="mt-6 flex-1">{children}</div>
            </div>
        </div>
    );
};

export default MainLayout;
