import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Star, Award, Users, Zap, Book, Gift } from 'lucide-react';

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
            <section className="py-24 bg-white text-center">
                <div className="container mx-auto px-6 lg:px-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Key Features</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mb-6"></div>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-16">Discover how FlashDash makes learning engaging and rewarding.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                        <FeatureCard
                            title="Engaging Quizzes"
                            description="Test your knowledge with thousands of interactive quizzes on various topics. Tailored difficulty levels and dynamic content ensure a fun learning experience."
                            icon={<Book size={36} />}
                            color="from-blue-400 to-blue-600"
                        />
                        <FeatureCard
                            title="Gamification Rewards"
                            description="Earn points, unlock exclusive achievements, and climb the leaderboards. Stay motivated with streaks, badges, and performance tracking."
                            icon={<Award size={36} />}
                            color="from-indigo-400 to-indigo-600"
                        />
                        <FeatureCard
                            title="Compete with Friends"
                            description="Challenge your friends to quizzes, compare scores in real-time, and engage in friendly competition with social leaderboards."
                            icon={<Users size={36} />}
                            color="from-purple-400 to-purple-600"
                        />
                        <FeatureCard
                            title="Daily Challenges"
                            description="Keep your knowledge fresh with new daily challenges across different subjects. Build streaks and earn bonus rewards for consistent learning."
                            icon={<Zap size={36} />}
                            color="from-pink-400 to-pink-600"
                        />
                        <FeatureCard
                            title="Personalized Learning"
                            description="Our AI adapts to your strengths and weaknesses, creating a personalized learning path that helps you improve efficiently."
                            icon={<Gift size={36} />}
                            color="from-amber-400 to-amber-600"
                        />
                        <FeatureCard
                            title="Create & Share"
                            description="Create your own quizzes to share with friends or the community. Customize topics, difficulty, and question formats."
                            icon={<Star size={36} />}
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

                    {/* React Slick Carousel zastępujący Swiper */}
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
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 lg:px-16">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mb-6"></div>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Have questions? We have answers!</p>
                        </motion.div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
                        <FAQItem question="Is FlashDash free to use?" answer="Yes! FlashDash offers free access to thousands of quizzes. A premium version is available for extra features and exclusive content." />
                        <FAQItem question="Can I create my own quizzes?" answer="Absolutely! Create, share, and challenge friends with your custom quizzes. Our intuitive editor makes it easy to get started." />
                        <FAQItem question="How do I earn rewards?" answer="Earn points by completing quizzes, maintaining daily learning streaks, and participating in community challenges and competitions." />
                        <FAQItem question="Is FlashDash available on mobile?" answer="Yes! Our app is available for both iOS and Android devices. Search for 'FlashDash Quiz' in your app store." />
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

const FeatureCard = ({ title, description, icon }: FeatureCardProps) => (
    <div className="p-8 bg-gray-100 rounded-lg shadow-lg hover:shadow-xl transition duration-300 flex flex-col items-center text-center min-h-[350px]">
        <div className="text-6xl mb-6">{icon}</div>
        <h3 className="text-3xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-lg text-gray-600">{description}</p>
    </div>
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

const FAQItem = ({ question, answer }: FAQItemProps) => (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
        <h4 className="text-xl font-semibold text-gray-900 mb-2">{question}</h4>
        <p className="text-gray-700">{answer}</p>
    </div>
);

export default Home;