import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Star, Award, Users, Zap, Book, Gift, ChevronDown } from 'lucide-react';

interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

interface TestimonialProps {
    quote: string;
    name: string;
    location: string;
}

interface FAQItemProps {
    question: string;
    answer: string;
}

const Home = () => {
    // Konfiguracja dla React Slick
    const slickSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: true,
        adaptiveHeight: false,
        arrows: true,
        dotsClass: "slick-dots custom-dots",
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    arrows: false,
                }
            }
        ]
    };

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .custom-dots {
                margin-top: 20px !important;
            }
            .custom-dots li button:before {
                font-size: 12px !important;
                opacity: 0.5;
                color: #ccc !important;
            }
            .custom-dots li.slick-active button:before {
                opacity: 1;
                background: linear-gradient(to right, #3B82F6, #6366F1);
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent !important;
                font-size: 14px !important;
            }
            .slick-prev, .slick-next {
                width: 24px !important;
                height: 24px !important;
                z-index: 10;
                top: 40% !important;
                transform: translateY(-50%) !important;
            }
            .slick-prev {
                left: -40px !important;
            }
            .slick-next {
                right: -40px !important;
            }
            .slick-prev:before, .slick-next:before {
                font-size: 28px !important;
                background: linear-gradient(to right, #3B82F6, #6366F1);
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent !important;
                opacity: 0.8 !important;
            }
            .slick-prev:hover:before, .slick-next:hover:before {
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <main className="w-full">
            {/* Hero Section */}
            <section className="h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center text-center lg:text-left">
                    {/* Text Section */}
                    <motion.div
                        className="lg:w-1/2"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <h1 className="text-9xl lg:text-7xl font-extrabold tracking-wide font-poppins mb-12">
                            <span className="text-gray-900">Flash</span>
                            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Dash</span>
                        </h1>
                        <p className="text-2xl text-gray-700 mb-12">
                            Learn by solving quizzes and earn rewards through gamification mechanics!
                            Enhance your knowledge, challenge yourself, and compete with friends in an interactive way.
                            Join FlashDash and turn learning into an adventure!
                        </p>
                        <Link to="/register">
                            <motion.button
                                className="bg-gradient-to-r from-blue-400 to-indigo-400 lg:text-xl text-white px-10 py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition duration-300"
                                whileHover={{ scale: 1.10 }}
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
            </section>

            {/* Key Features Section */}
            <section className="h-[calc(100vh-70px)] bg-white flex flex-col justify-center py-16">
                <div className="container mx-auto px-6 lg:px-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                        className="text-center mb-10"
                    >
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Key Features</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mb-6"></div>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                            Explore how FlashDash empowers learning through personalized quizzes, progress tracking, and social features.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                        <FeatureCard
                            title="Custom Quiz Decks"
                            description="Create and organize your own decks of flashcards with questions. Easily update and manage content anytime."
                            icon={<Book size={28} />}
                            color="from-blue-400 to-blue-600"
                        />
                        <FeatureCard
                            title="Progress Tracking"
                            description="Track your learning progress with detailed statistics, including streaks, games played, and question accuracy."
                            icon={<Award size={28} />}
                            color="from-indigo-400 to-indigo-600"
                        />
                        <FeatureCard
                            title="Friends & Invitations"
                            description="Build your learning circle by adding friends, sending invites, and viewing their progress."
                            icon={<Users size={28} />}
                            color="from-purple-400 to-purple-600"
                        />
                        <FeatureCard
                            title="Game Sessions"
                            description="Start solo quiz sessions and get immediate feedback on your answers. Track correct and incorrect responses."
                            icon={<Zap size={28} />}
                            color="from-pink-400 to-pink-600"
                        />
                        <FeatureCard
                            title="Achievements System"
                            description="Unlock achievements by reaching learning milestones such as streaks, number of quizzes, or added friends."
                            icon={<Gift size={28} />}
                            color="from-amber-400 to-amber-600"
                        />
                        <FeatureCard
                            title="Daily Reminders"
                            description="Stay consistent with optional daily email reminders. Set your preferred time and never miss a session."
                            icon={<Star size={28} />}
                            color="from-teal-400 to-teal-600"
                        />
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-gray-100 text-center">
                <div className="container mx-auto px-6 lg:px-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">What Users Say</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mb-6"></div>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">See what our users love about FlashDash.</p>
                    </motion.div>

                    {/* React Slick Carousel */}
                    <div className="w-full max-w-4xl mx-auto relative">
                        <Slider {...slickSettings}>
                            <div className="px-4">
                                <Testimonial
                                    quote="FlashDash has made learning fun! I never thought quizzes could be this engaging and addictive."
                                    name="Sarah L."
                                    location="New York, USA"
                                />
                            </div>
                            <div className="px-4">
                                <Testimonial
                                    quote="I love the competition aspect! My friends and I challenge each other daily with new quizzes."
                                    name="David R."
                                    location="London, UK"
                                />
                            </div>
                            <div className="px-4">
                                <Testimonial
                                    quote="The rewards system keeps me motivated to learn every day. I've maintained a 60-day streak!"
                                    name="Emma W."
                                    location="Sydney, Australia"
                                />
                            </div>
                            <div className="px-4">
                                <Testimonial
                                    quote="As a teacher, I use FlashDash to make my lessons interactive. My students love it and learn more."
                                    name="Michael K."
                                    location="Toronto, Canada"
                                />
                            </div>
                        </Slider>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="h-[calc(100vh-70px)] bg-gray-50 flex flex-col justify-center py-6">
                <div className="container mx-auto px-6 lg:px-16">
                    <div className="text-center mb-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
                            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mb-4"></div>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Have questions? We have answers!</p>
                        </motion.div>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-5">
                        {faqData.map((faq, index) => (
                            <FAQAccordionItem key={index} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="bg-gradient-to-r from-blue-400 to-indigo-400 text-white py-16 flex flex-col items-center justify-center text-center">
                <div className="container mx-auto px-6">
                    <p className="text-2xl mb-8">Join thousands of learners and start your journey today!</p>
                    <Link to="/register">
                        <motion.button
                            className="bg-white text-blue-500 px-10 py-4 text-xl rounded-full font-semibold shadow-lg hover:bg-gray-100 transition duration-300 mb-8"
                            whileHover={{ scale: 1.10 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Register Now
                        </motion.button>
                    </Link>
                    <p className="text-lg">© {new Date().getFullYear()} FlashDash. All Rights Reserved.</p>
                </div>
            </footer>
        </main>
    );
};

const faqData = [
    {
        question: "Is FlashDash free to use?",
        answer: "Yes! FlashDash is completely free to use. All features are available without any subscription or payment."
    },
    {
        question: "Can I create my own quizzes?",
        answer: "Yes! You can create your own decks of flashcards, add custom questions, and use them to study or play solo quiz sessions."
    },
    {
        question: "How do I track my progress?",
        answer: "FlashDash tracks your activity automatically. You can view statistics like the number of games played, correct answers, and your current learning streak."
    },
    {
        question: "Is FlashDash available on mobile?",
        answer: "Currently, FlashDash is available through the web browser. A mobile app for iOS and Android is planned for release in the near future."
    },
    {
        question: "Is there a leaderboard or competition feature?",
        answer: "Yes! FlashDash features leaderboards that allow you to compete based on points earned. You can view global rankings or filter them to see only your friends' scores."
    },
    {
        question: "Can I use FlashDash for educational purposes?",
        answer: "FlashDash is designed for individual learning. While there is no dedicated teacher mode yet, educators can still create decks and share them with students manually."
    }
];


const FeatureCard = ({ title, description, icon, color }: FeatureCardProps) => (
    <motion.div
        whileHover={{
            y: -6,
            boxShadow: "0 15px 20px -5px rgba(0, 0, 0, 0.1), 0 8px 8px -5px rgba(0, 0, 0, 0.04)"
        }}
        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
        <div className={`h-2 w-full bg-gradient-to-r ${color}`}></div>
        <div className="p-6 flex flex-col items-center text-center">
            <div className={`p-3 rounded-full bg-gradient-to-r ${color} bg-opacity-10 mb-4`}>
                <div className="text-white">{icon}</div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
        </div>
    </motion.div>
);

const Testimonial = ({ quote, name, location }: TestimonialProps) => (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-12 mx-3">
        <div className="flex flex-col justify-between h-24">
            <p className="text-lg italic text-gray-700 mb-4 line-clamp-3">"{quote}"</p>
            <div>
                <h4 className="font-bold text-gray-800">{name}</h4>
                <span className="text-gray-500">{location}</span>
            </div>
        </div>
    </div>
);

const FAQAccordionItem = ({ question, answer }: FAQItemProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            whileHover={{ y: -3 }}
        >
            <button
                className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h4 className="text-xl font-semibold text-gray-900">{question}</h4>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronDown className={`w-6 h-6 transition-colors ${isOpen ? 'text-indigo-600' : 'text-blue-500'}`} />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-5 text-gray-700 border-t border-gray-100 pt-3 text-base">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Home;