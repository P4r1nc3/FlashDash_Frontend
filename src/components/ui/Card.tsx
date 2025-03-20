import React from 'react';

interface CardProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    actions?: React.ReactNode;
    scrollable?: boolean;
    maxHeight?: string;
    className?: string;
}

const Card: React.FC<CardProps> = ({
                                       title,
                                       description,
                                       icon,
                                       children,
                                       actions,
                                       scrollable = false,
                                       maxHeight = 'max-h-[50vh]',
                                       className = ''
                                   }) => {
    return (
        <div className={`bg-white rounded-xl shadow-md w-full ${className}`}>
            {/* Top gradient line */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-t-xl"></div>

            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2 mb-1">
                            {icon && <span className="text-indigo-500">{icon}</span>} {title}
                        </h2>
                        {description && <p className="text-gray-500 text-sm">{description}</p>}
                    </div>
                    {actions && <div>{actions}</div>}
                </div>

                <div className={scrollable ? `${maxHeight} overflow-y-auto pr-2 custom-scrollbar` : ''}>
                    {children}
                </div>
            </div>
        </div>
    );
};

// Add the custom scrollbar styles
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

export default Card;