import React from 'react';
import { motion } from 'framer-motion';

interface GradientButtonProps {
    onClick: () => void;
    startColor?: string;
    endColor?: string;
    hoverStartColor?: string;
    hoverEndColor?: string;
    children: React.ReactNode;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    icon?: React.ReactNode;
}

const GradientButton: React.FC<GradientButtonProps> = ({
                                                           onClick,
                                                           startColor = 'from-blue-400',
                                                           endColor = 'to-indigo-400',
                                                           hoverStartColor = 'from-blue-500',
                                                           hoverEndColor = 'to-indigo-500',
                                                           children,
                                                           className = '',
                                                           type = 'button',
                                                           disabled = false,
                                                           icon
                                                       }) => {
    return (
        <motion.button
            type={type}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            disabled={disabled}
            className={`
        bg-gradient-to-r ${startColor} ${endColor}
        hover:bg-gradient-to-r hover:${hoverStartColor} hover:${hoverEndColor}
        text-white py-2 px-4 rounded-lg font-medium transition-colors shadow-sm
        flex items-center gap-2 justify-center relative overflow-hidden group
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
        >
            {/* Shine effect */}
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></span>

            {/* Icon and content */}
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <span>{children}</span>
        </motion.button>
    );
};

export default GradientButton;