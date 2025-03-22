import { useState, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GradientButton from '../components/ui/GradientButton';

interface FormField {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    required?: boolean;
}

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
    validatePasswords?: boolean;
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
                      validatePasswords = false,
                  }: AuthFormProps) => {
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const gridColumnsClass = columns > 1 ? `grid-cols-1 md:grid-cols-${Math.min(columns, 4)}` : 'grid-cols-1';

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (validatePasswords && (name === 'password' || name === 'confirmPassword')) {
            const otherField = name === 'password' ? 'confirmPassword' : 'password';
            const otherValue = formData[otherField] || '';
            setPasswordsMatch(!otherValue || value === otherValue);
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
            toast.error(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
        }
    };

    const renderField = (field: FormField) => {
        const isPasswordField = field.type === 'password';
        const hasPasswordError = validatePasswords && field.name === 'confirmPassword' && !passwordsMatch;

        return (
            <div key={field.name} className="mb-3">
                <label className="text-gray-700 text-sm font-medium mb-1 block text-left">
                    {field.label}
                </label>

                <div className={isPasswordField ? "relative" : ""}>
                    <input
                        type={isPasswordField && showPassword ? 'text' : field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        className={`p-2 w-full bg-gray-50 border ${
                            hasPasswordError ? 'border-red-300' : 'border-gray-200'
                        } rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-300 transition-all duration-200`}
                        onChange={handleChange}
                        required={field.required !== false}
                    />

                    {isPasswordField && (
                        <button
                            type="button"
                            className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-indigo-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                        </button>
                    )}
                </div>

                {hasPasswordError && (
                    <div className="text-red-500 text-xs mt-1 text-left">
                        Passwords do not match
                    </div>
                )}
            </div>
        );
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-indigo-50">
            <div className="container mx-auto px-4 max-w-2xl">
                <motion.div
                    className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <ToastContainer position="top-right" autoClose={5000} />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
                    <p className="text-sm text-gray-600 mb-4">{subtitle}</p>

                    <form onSubmit={handleSubmit} className="w-full flex flex-col">
                        <div className={`grid ${gridColumnsClass} gap-3`}>
                            {fields.map(renderField)}
                        </div>

                        <GradientButton
                            type="submit"
                            onClick={() => {}}
                        >
                            {submitLabel}
                        </GradientButton>
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