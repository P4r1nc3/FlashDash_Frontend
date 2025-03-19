import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthForm = ({
                      title,
                      subtitle,
                      fields,
                      onSubmit,
                      submitLabel,
                      footerText,
                      footerLink,
                      footerHref,
                      // New parameterized options
                      columns = 1, // Default to 1 column
                      maxWidth = "2xl", // Default max width
                      showPasswordToggle = true, // Option to show/hide password toggle
                      containerPadding = 6, // Padding for the container
                      validatePasswords = false, // Whether to validate password matching
                      buttonVariant = "primary" // Button style variant
                  }) => {
    const [formData, setFormData] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        // Check if passwords match when validatePasswords is true
        if (validatePasswords && (e.target.name === 'password' || e.target.name === 'confirmPassword')) {
            if (e.target.name === 'password') {
                setPasswordsMatch(e.target.value === formData.confirmPassword || !formData.confirmPassword);
            } else {
                setPasswordsMatch(e.target.value === formData.password);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if passwords match before submitting when validatePasswords is true
        if (validatePasswords && formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        try {
            // Remove confirmPassword from the data sent to the server if it exists
            const { confirmPassword, ...dataToSubmit } = formData;
            await onSubmit(dataToSubmit);
        } catch (err) {
            toast.error(err.response?.data?.cause || 'Something went wrong. Please try again.');
        }
    };

    // Dynamic max width class based on the maxWidth prop
    const getMaxWidthClass = () => {
        const validSizes = ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl"];
        return validSizes.includes(maxWidth) ? `max-w-${maxWidth}` : "max-w-2xl";
    };

    // Dynamic grid columns class based on the columns prop
    const getGridColumnsClass = () => {
        return `grid-cols-1 ${columns > 1 ? `md:grid-cols-${Math.min(columns, 4)}` : ''}`;
    };

    // Dynamic button class based on the buttonVariant prop
    const getButtonClass = () => {
        switch (buttonVariant) {
            case 'secondary':
                return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
            case 'success':
                return 'bg-gradient-to-r from-green-400 to-green-500 text-white';
            case 'danger':
                return 'bg-gradient-to-r from-red-400 to-red-500 text-white';
            case 'warning':
                return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white';
            case 'primary':
            default:
                return 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white';
        }
    };

    // Using placeholder directly from field, now required

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-indigo-50">
            <div className={`container mx-auto px-4 ${getMaxWidthClass()}`}>
                <motion.div
                    className={`bg-white p-${containerPadding} rounded-lg shadow-md flex flex-col items-center text-center`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover draggable />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
                    <p className="text-sm text-gray-600 mb-4">{subtitle}</p>
                    <form onSubmit={handleSubmit} className="w-full flex flex-col">
                        <div className={`grid ${getGridColumnsClass()} gap-3`}>
                            {fields.map((field) => (
                                <div key={field.name} className="mb-3">
                                    <label className="text-gray-700 text-sm font-medium mb-1 block text-left">{field.label}</label>
                                    {field.type === 'password' ? (
                                        <div className="relative">
                                            <input
                                                type={showPasswordToggle ? (showPassword ? 'text' : 'password') : 'password'}
                                                name={field.name}
                                                placeholder={field.placeholder}
                                                className={`p-2 w-full bg-gray-50 border ${validatePasswords && field.name === 'confirmPassword' && !passwordsMatch ? 'border-red-300' : 'border-gray-200'} rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-300 transition-all duration-200`}
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
                                    {validatePasswords && field.name === 'confirmPassword' && !passwordsMatch &&
                                        <div className="text-red-500 text-xs mt-1 text-left">Passwords do not match</div>
                                    }
                                </div>
                            ))}
                        </div>

                        <motion.button
                            type="submit"
                            className={`${getButtonClass()} py-2 rounded-md font-medium shadow-sm hover:shadow-md transition duration-300 w-full mb-1`}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {submitLabel}
                        </motion.button>
                    </form>

                    <p className="text-gray-600 text-sm mt-4">
                        {footerText}
                        <a href={footerHref} className="text-indigo-500 font-medium ml-1 hover:text-blue-500 transition-colors duration-200">{footerLink}</a>
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