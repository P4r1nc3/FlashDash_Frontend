import { useState } from 'react';
import { motion } from 'framer-motion';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const AuthForm = ({ title, subtitle, fields, onSubmit, submitLabel, footerText, footerLink, footerHref }) => {
    const [formData, setFormData] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSubmit(formData);
        } catch (err) {
            setError(err.response?.data?.cause || 'Something went wrong. Please try again.');
        }
    };

    return (
        <main className="h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-indigo-50">
            <div className="container mx-auto px-6 lg:px-12 max-w-xl">
                <motion.div
                    className="bg-white p-10 rounded-xl shadow-lg flex flex-col items-center text-center"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{ boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.05)' }}
                >
                    <h2 className="text-4xl font-extrabold text-gray-800 mb-3">{title}</h2>
                    <p className="text-lg text-gray-600 mb-6">{subtitle}</p>
                    <form onSubmit={handleSubmit} className="w-full flex flex-col">
                        {fields.map(({ name, label, type, placeholder }) => (
                            <div key={name} className="mb-5">
                                <label className="text-gray-700 font-medium mb-2 block text-left">{label}</label>
                                {type === 'password' ? (
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name={name}
                                            placeholder={placeholder}
                                            className="p-3 w-full bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200"
                                            onChange={handleChange}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-indigo-500"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                        </button>
                                    </div>
                                ) : (
                                    <input
                                        type={type}
                                        name={name}
                                        placeholder={placeholder}
                                        className="p-3 w-full bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200"
                                        onChange={handleChange}
                                        required
                                    />
                                )}
                            </div>
                        ))}

                        {error &&
                            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-left">
                                {error}
                            </div>
                        }

                        <motion.button
                            type="submit"
                            className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition duration-300 w-full mb-1"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {submitLabel}
                        </motion.button>
                    </form>

                    <p className="text-gray-600 mt-6">
                        {footerText}
                        <a href={footerHref} className="text-indigo-500 font-medium ml-1 hover:text-blue-500 transition-colors duration-200">{footerLink}</a>
                    </p>

                    {/* Bottom gradient line */}
                    <div className="w-full mt-8">
                        <div className="h-1 w-full bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full"></div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
};

export default AuthForm