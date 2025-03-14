import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import AppRoutes from './routes';
import './App.css';

const App = () => {
    return (
        <>
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
            <AuthProvider>
                <Router>
                    <div className="flex h-screen">
                        <Navbar />
                        <div id="content" className="flex-1 transition-all duration-300">
                            <AppRoutes />
                        </div>
                    </div>
                </Router>
            </AuthProvider>
        </>
    );
};

export default App;
