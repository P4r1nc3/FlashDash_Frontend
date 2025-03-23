import React from 'react';

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
                                                   icon,
                                                   title,
                                                   description,
                                                   action,
                                                   className = ''
                                               }) => {
    return (
        <div className={`h-full w-full flex items-center justify-center ${className}`}>
            <div className="flex flex-col items-center justify-center py-10 text-gray-500 max-w-md">
                <div className="text-gray-300 mb-3">
                    {icon}
                </div>
                <p className="text-center font-medium text-gray-600">{title}</p>
                {description && <p className="text-center text-sm mt-2">{description}</p>}
                {action && <div className="mt-4">{action}</div>}
            </div>
        </div>
    );
};

export default EmptyState;