import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

const Home = () => {
    return (
        <main className="w-full">
            {/* Hero Section */}
            <section className="h-screen bg-gradient-to-b from-white to-blue-200 flex items-center justify-center">
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
                            <span className="text-blue-500">Dash</span>
                        </h1>
                        <p className="text-2xl text-gray-700 mb-12">
                            Learn by solving quizzes and earn rewards through gamification mechanics!
                            Enhance your knowledge, challenge yourself, and compete with friends in an interactive way.
                            Join FlashDash and turn learning into an adventure!
                        </p>
                        <Link to="/register">
                            <motion.button
                                className="bg-blue-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-blue-600 transition duration-300"
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
            </section>

            {/* Key Features Section */}
            <section className="py-20 bg-white text-center">
                <div className="container mx-auto px-6 lg:px-16">
                    <h2 className="text-5xl font-extrabold text-gray-900 mb-16">Key Features</h2>
                    <div className="grid md:grid-cols-3 gap-12">
                        <FeatureCard
                            title="Engaging Quizzes"
                            description="Test your knowledge with thousands of interactive quizzes on various topics. Tailored difficulty levels and dynamic content ensure a fun learning experience."
                            icon="📚"
                        />
                        <FeatureCard
                            title="Gamification Rewards"
                            description="Earn points, unlock exclusive achievements, and climb the leaderboards. Stay motivated with streaks, badges, and performance tracking."
                            icon="🏆"
                        />
                        <FeatureCard
                            title="Compete with Friends"
                            description="Challenge your friends to quizzes, compare scores in real-time, and engage in friendly competition with social leaderboards."
                            icon="👥"
                        />
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-gray-100 text-center">
                <div className="container mx-auto px-6 lg:px-16">
                    <h2 className="text-5xl font-extrabold text-gray-900 mb-12">What Users Say</h2>
                    <Swiper
                        modules={[Pagination]}
                        spaceBetween={30}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        className="w-full max-w-4xl mx-auto"
                    >
                        <SwiperSlide>
                            <Testimonial
                                quote="FlashDash has made learning so much fun! I never thought quizzes could be this engaging."
                                name="Sarah L."
                                location="New York, USA"
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <Testimonial
                                quote="I love the competition aspect! My friends and I challenge each other daily."
                                name="David R."
                                location="London, UK"
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <Testimonial
                                quote="The rewards system keeps me motivated to keep learning every day."
                                name="Emma W."
                                location="Sydney, Australia"
                            />
                        </SwiperSlide>
                    </Swiper>
                </div>
            </section>
        </main>
    );
};

const FeatureCard = ({ title, description, icon }) => (
    <div className="p-8 bg-gray-100 rounded-lg shadow-lg hover:shadow-xl transition duration-300 flex flex-col items-center text-center min-h-[300px]">
        <div className="text-6xl mb-6">{icon}</div>
        <h3 className="text-3xl font-bold text-gray-800 mb-4">{title}</h3>
        <p className="text-lg text-gray-600">{description}</p>
    </div>
);

const Testimonial = ({ quote, name, location }) => (
    <div className="bg-white p-8 rounded-lg shadow-lg">
        <p className="text-xl italic text-gray-700 mb-4">"{quote}"</p>
        <h4 className="font-bold text-gray-800">{name}</h4>
        <span className="text-gray-500">{location}</span>
    </div>
);

export default Home;