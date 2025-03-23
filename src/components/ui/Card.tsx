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
    fullHeight?: boolean;
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
                                       titleColor,
                                       fullHeight = false,
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
        <div className={`bg-white rounded-xl shadow-md w-full overflow-hidden ${fullHeight ? 'h-full flex flex-col' : ''} ${className}`}>
            <div className={`h-1 w-full bg-gradient-to-r ${gradientClasses} rounded-t-xl flex-shrink-0`}></div>

            <div className={`p-6 ${fullHeight ? 'flex flex-col flex-grow h-full' : ''}`}>
                <div className="flex justify-between items-start mb-4 flex-shrink-0">
                    <div>
                        <h2 className={`text-xl font-bold ${titleColorClass} flex items-center gap-2 mb-2`}>
                            {icon && <span className={iconColorClass}>{icon}</span>} {title}
                        </h2>
                        {description && <p className="text-gray-500 text-sm">{description}</p>}
                    </div>
                    {actions && <div>{actions}</div>}
                </div>

                <div className={`${fullHeight ? 'flex-grow relative' : ''}`}>
                    <div
                        className={
                            scrollable
                                ? fullHeight
                                    ? 'absolute inset-0 overflow-y-auto pr-2 custom-scrollbar overflow-auto-when-needed'
                                    : `${maxHeight} overflow-y-auto pr-2 custom-scrollbar overflow-auto-when-needed`
                                : fullHeight
                                    ? 'absolute inset-0'
                                    : ''
                        }
                    >
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

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

.overflow-auto-when-needed {
  overflow-y: auto;
  scrollbar-gutter: stable;
}

.overflow-auto-when-needed:not(:hover)::-webkit-scrollbar-thumb {
  background: transparent;
}

.overflow-auto-when-needed:hover::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #60a5fa, #818cf8);
}
`;
document.head.appendChild(style);

export default Card;