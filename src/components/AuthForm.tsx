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
        <main className="h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-200">
            <div className="container mx-auto px-6 lg:px-12 max-w-xl">
                <motion.div
                    className="bg-white p-10 rounded-xl shadow-2xl flex flex-col items-center text-center"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <h2 className="text-4xl font-extrabold text-gray-800 mb-3">{title}</h2>
                    <p className="text-lg text-gray-600 mb-6">{subtitle}</p>
                    <form onSubmit={handleSubmit} className="w-full flex flex-col">
                        {fields.map(({ name, label, type, placeholder }) => (
                            <div key={name} className="mb-4">
                                <label className="text-gray-700 font-semibold mb-2 block text-left">{label}</label>
                                {type === 'password' ? (
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name={name}
                                            placeholder={placeholder}
                                            className="p-3 w-full bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg transition-all duration-200"
                                            onChange={handleChange}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-700"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <AiOutlineEyeInvisible size={24} /> : <AiOutlineEye size={24} />}
                                        </button>
                                    </div>
                                ) : (
                                    <input
                                        type={type}
                                        name={name}
                                        placeholder={placeholder}
                                        className="p-3 w-full bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg transition-all duration-200"
                                        onChange={handleChange}
                                        required
                                    />
                                )}
                            </div>
                        ))}
                        {error && <p className="text-red-500 text-lg mb-4">{error}</p>}
                        <motion.button
                            type="submit"
                            className="bg-blue-500 text-white py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-blue-600 transition duration-300 w-full"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {submitLabel}
                        </motion.button>
                    </form>
                    <p className="text-gray-600 mt-6 text-lg">
                        {footerText}
                        <a href={footerHref} className="text-blue-500 font-semibold ml-1 text-lg">{footerLink}</a>
                    </p>
                </motion.div>
            </div>
        </main>
    );
};

export default AuthForm;
