import React from 'react';
import GradientButton from './GradientButton';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    onSave?: () => void;
    saveText?: string;
    cancelText?: string;
    width?: string;
    showFooter?: boolean;
}

const Modal: React.FC<ModalProps> = ({
                                         isOpen,
                                         onClose,
                                         title,
                                         children,
                                         onSave,
                                         saveText = 'Save',
                                         cancelText = 'Cancel',
                                         width = 'w-96',
                                         showFooter = true
                                     }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50"></div>
            <div className={`bg-white rounded-lg shadow-lg ${width} max-h-[90vh] overflow-y-auto relative mx-4 z-10`}>
                {/* Top gradient line */}
                <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-indigo-400 absolute top-0 left-0 rounded-t-lg"></div>

                <div className="p-6">
                    <h2 className="text-xl font-bold text-blue-600 mb-4 mt-2">
                        {title}
                    </h2>

                    <div className="mb-6">
                        {children}
                    </div>

                    {showFooter && (
                        <div className="flex justify-end space-x-3">
                            <button
                                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                                onClick={onClose}
                            >
                                {cancelText}
                            </button>

                            {onSave && (
                                <GradientButton onClick={onSave}>
                                    {saveText}
                                </GradientButton>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;