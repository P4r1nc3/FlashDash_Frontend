import React from 'react';

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
                                                   icon,
                                                   title,
                                                   description,
                                                   action
                                               }) => {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <div className="text-gray-300 mb-3">
                {icon}
            </div>
            <p className="text-center">{title}</p>
            {description && <p className="text-center text-sm mt-2">{description}</p>}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
};

export default EmptyState;