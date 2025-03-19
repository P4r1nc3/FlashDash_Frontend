import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import { motion } from 'framer-motion';
import { BiError } from 'react-icons/bi';

const NotFound = () => {
    const navigate = useNavigate();

    const handleBackToAccount = () => {
        navigate('/account');
    };

    return (
        <MainLayout
            title="404 - Page Not Found"
            description="The page you're looking for doesn't exist."
        >
            <motion.div
                className="flex flex-col items-center justify-center py-12 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <BiError className="text-red-500 mb-6" size={120} />

                <h2 className="text-2xl font-semibold mb-4">Oops! This page has gone missing.</h2>

                <p className="text-gray-600 mb-8 max-w-md">
                    The page you're trying to access doesn't exist or has been moved.
                    Please check the URL or return to the dashboard.
                </p>

                <div className="flex gap-4">
                    <motion.button
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/')}
                    >
                        Go to Dashboard
                    </motion.button>

                    <motion.button
                        className="px-6 py-3 border border-gray-300 rounded-lg shadow-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleBackToAccount}
                    >
                        Go to Account
                    </motion.button>
                </div>
            </motion.div>
        </MainLayout>
    );
};

export default NotFound;