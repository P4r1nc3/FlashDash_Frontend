import React from 'react';

interface CardProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    actions?: React.ReactNode;
    scrollable?: boolean;
    maxHeight?: string;
    className?: string;
    colorScheme?: 'default' | 'danger' | string;
    titleColor?: string;
}

const Card: React.FC<CardProps> = ({
                                       title,
                                       description,
                                       icon,
                                       children,
                                       actions,
                                       scrollable = false,
                                       maxHeight = 'max-h-[50vh]',
                                       className = '',
                                       colorScheme = 'default',
                                       titleColor
                                   }) => {
    let gradientClasses = "from-blue-400 to-indigo-400";
    let titleColorClass = "text-blue-600";
    let iconColorClass = "text-indigo-500";

    if (colorScheme === 'danger') {
        gradientClasses = "from-red-400 to-red-500";
        titleColorClass = "text-red-500";
        iconColorClass = "text-red-500";
    } else if (colorScheme.includes('from-') && colorScheme.includes('to-')) {
        gradientClasses = colorScheme;
    }

    if (titleColor) {
        titleColorClass = titleColor;
    }

    return (
        <div className={`bg-white rounded-xl shadow-md w-full ${className}`}>
            {/* Top gradient line */}
            <div className={`h-1 w-full bg-gradient-to-r ${gradientClasses} rounded-t-xl`}></div>

            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className={`text-xl font-bold ${titleColorClass} flex items-center gap-2 mb-2`}>
                            {icon && <span className={iconColorClass}>{icon}</span>} {title}
                        </h2>
                        {description && <p className="mb-3 text-gray-500 text-sm">{description}</p>}
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