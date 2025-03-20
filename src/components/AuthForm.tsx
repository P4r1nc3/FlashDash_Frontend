import { useState, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormField {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    required?: boolean;
}

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning';

interface AuthFormProps {
    title: string;
    subtitle: string;
    fields: FormField[];
    onSubmit: (data: Record<string, string>) => Promise<void>;
    submitLabel: string;
    footerText: string;
    footerLink: string;
    footerHref: string;
    columns?: number;
    maxWidth?: string;
    showPasswordToggle?: boolean;
    containerPadding?: number;
    validatePasswords?: boolean;
    buttonVariant?: ButtonVariant;
}

const AuthForm = ({
                      title,
                      subtitle,
                      fields,
                      onSubmit,
                      submitLabel,
                      footerText,
                      footerLink,
                      footerHref,
                      columns = 1,
                      maxWidth = "2xl",
                      showPasswordToggle = true,
                      containerPadding = 6,
                      validatePasswords = false,
                      buttonVariant = "primary"
                  }: AuthFormProps) => {
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const maxWidthClass = `max-w-${maxWidth in ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl"] ? maxWidth : "2xl"}`;
    const gridColumnsClass = `grid-cols-1 ${columns > 1 ? `md:grid-cols-${Math.min(columns, 4)}` : ''}`;

    const buttonClasses = {
        primary: 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white',
        secondary: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white',
        success: 'bg-gradient-to-r from-green-400 to-green-500 text-white',
        danger: 'bg-gradient-to-r from-red-400 to-red-500 text-white',
        warning: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (validatePasswords && (name === 'password' || name === 'confirmPassword')) {
            setPasswordsMatch(
                name === 'password'
                    ? value === formData.confirmPassword || !formData.confirmPassword
                    : value === formData.password
            );
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validatePasswords && formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        try {
            const dataToSubmit = { ...formData };
            delete dataToSubmit.confirmPassword;
            await onSubmit(dataToSubmit);
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Something went wrong. Please try again.';
            toast.error(errorMessage);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-indigo-50">
            <div className={`container mx-auto px-4 ${maxWidthClass}`}>
                <motion.div
                    className={`bg-white p-${containerPadding} rounded-lg shadow-md flex flex-col items-center text-center`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <ToastContainer position="top-right" autoClose={5000} />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
                    <p className="text-sm text-gray-600 mb-4">{subtitle}</p>

                    <form onSubmit={handleSubmit} className="w-full flex flex-col">
                        <div className={`grid ${gridColumnsClass} gap-3`}>
                            {fields.map((field) => (
                                <div key={field.name} className="mb-3">
                                    <label className="text-gray-700 text-sm font-medium mb-1 block text-left">
                                        {field.label}
                                    </label>

                                    {field.type === 'password' ? (
                                        <div className="relative">
                                            <input
                                                type={showPasswordToggle ? (showPassword ? 'text' : 'password') : 'password'}
                                                name={field.name}
                                                placeholder={field.placeholder}
                                                className={`p-2 w-full bg-gray-50 border ${
                                                    validatePasswords && field.name === 'confirmPassword' && !passwordsMatch
                                                        ? 'border-red-300'
                                                        : 'border-gray-200'
                                                } rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-300 transition-all duration-200`}
                                                onChange={handleChange}
                                                required={field.required !== false}
                                            />
                                            {showPasswordToggle && (
                                                <button
                                                    type="button"
                                                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-indigo-500"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            placeholder={field.placeholder}
                                            className="p-2 w-full bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-300 transition-all duration-200"
                                            onChange={handleChange}
                                            required={field.required !== false}
                                        />
                                    )}

                                    {validatePasswords && field.name === 'confirmPassword' && !passwordsMatch && (
                                        <div className="text-red-500 text-xs mt-1 text-left">
                                            Passwords do not match
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <motion.button
                            type="submit"
                            className={`${buttonClasses[buttonVariant]} py-2 rounded-md font-medium shadow-sm hover:shadow-md transition duration-300 w-full mb-1`}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {submitLabel}
                        </motion.button>
                    </form>

                    <p className="text-gray-600 text-sm mt-4">
                        {footerText}
                        <a href={footerHref} className="text-indigo-500 font-medium ml-1 hover:text-blue-500 transition-colors duration-200">
                            {footerLink}
                        </a>
                    </p>

                    <div className="w-full mt-4">
                        <div className="h-1 w-full bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full"></div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
};

export default AuthForm;