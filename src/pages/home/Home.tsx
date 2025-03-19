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
            <section className="h-screen bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
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
            <section className="h-[65vh] py-20 bg-white text-center flex flex-col justify-center">
                <div className="container mx-auto px-6 lg:px-16">
                    <h2 className="text-5xl font-extrabold text-gray-900 mb-2">Key Features</h2>
                    <p className="text-lg text-gray-600 mb-12">Discover how FlashDash makes learning engaging and rewarding.</p>
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
            <section className="h-[45vh] py-20 bg-gray-100 text-center flex flex-col justify-center">
                <div className="container mx-auto px-6 lg:px-16">
                    <h2 className="text-5xl font-extrabold text-gray-900 mb-2">What Users Say</h2>
                    <p className="text-lg text-gray-600 mb-12">See what our users love about FlashDash.</p>
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

            {/* FAQ Section */}
            <section className="py-20 bg-white text-center flex flex-col justify-center">
                <div className="container mx-auto px-6 lg:px-16">
                    <h2 className="text-5xl font-extrabold text-gray-900 mb-2">Frequently Asked Questions</h2>
                    <p className="text-lg text-gray-600 mb-12">Have questions? We have answers!</p>
                    <div className="grid md:grid-cols-2 gap-12 text-left">
                        <FAQItem question="Is FlashDash free to use?" answer="Yes! FlashDash offers free access to thousands of quizzes. A premium version is available for extra features." />
                        <FAQItem question="Can I create my own quizzes?" answer="Absolutely! Create, share, and challenge friends with your custom quizzes." />
                        <FAQItem question="How do I earn rewards?" answer="Earn points by completing quizzes and maintaining learning streaks." />
                        <FAQItem question="Is FlashDash available on mobile?" answer="Our mobile app is coming soon! Stay tuned for updates." />
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="h-[35vh] bg-gradient-to-r from-blue-400 to-indigo-400 text-white flex flex-col items-center justify-center text-center">
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

const FeatureCard = ({ title, description, icon }) => (
    <div className="p-8 bg-gray-100 rounded-lg shadow-lg hover:shadow-xl transition duration-300 flex flex-col items-center text-center min-h-[350px]">
        <div className="text-6xl mb-6">{icon}</div>
        <h3 className="text-3xl font-bold text-gray-800 mb-2">{title}</h3>
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

const FAQItem = ({ question, answer }) => (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
        <h4 className="text-xl font-semibold text-gray-900 mb-2">{question}</h4>
        <p className="text-gray-700">{answer}</p>
    </div>
);

export default Home;