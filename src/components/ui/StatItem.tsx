import React from 'react';

interface StatItemProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    colorClass?: string;
    title?: string;
}

const StatItem: React.FC<StatItemProps> = ({
                                               label,
                                               value,
                                               icon,
                                               colorClass = "from-blue-400 to-indigo-400",
                                               title
                                           }) => {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-2 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-gray-600 font-medium text-xs">{label}</p>
                <div className={`w-6 h-6 bg-gradient-to-r ${colorClass} rounded-full flex items-center justify-center shadow-sm`}>
                    {icon}
                </div>
            </div>
            <p
                className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 truncate"
                title={title || String(value)}
            >
                {value}
            </p>
        </div>
    );
};

export default StatItem;