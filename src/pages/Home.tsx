import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <main className="min-h-screen bg-gradient-to-b from-white to-blue-200 flex items-center justify-center">
            <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center text-center lg:text-left">
                {/* Text Section */}
                <motion.div
                    className="lg:w-1/2"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <h1 className="text-9xl lg:text-7xl font-extrabold tracking-wide font-poppins mb-8">
                        <span className="text-gray-900">Flash</span>
                        <span className="text-blue-500">Dash</span>
                    </h1>
                    <p className="text-2xl text-gray-700 mb-8">
                        Learn by solving quizzes and earn rewards through gamification mechanics!
                        Enhance your knowledge, challenge yourself, and compete with friends in an interactive way.
                        Join FlashDash and turn learning into an adventure!
                    </p>
                    <Link to="/register">
                        <motion.button
                            className="bg-blue-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-blue-600 transition duration-300 mt-4"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Start Your Journey
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Image Section */}
                <motion.div
                    className="lg:w-1/2"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                >
                    <motion.img
                        src="/landing_page.png"
                        alt="FlashDash Quiz Game"
                        className="w-full max-w-lg mx-auto"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                    />
                </motion.div>
            </div>
        </main>
    );
};

export default Home;