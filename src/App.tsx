import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import AppRoutes from './routes';

const App = () => {
    return (
        <>
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
            <AuthProvider>
                <Router>
                    <Navbar />
                    <AppRoutes />
                </Router>
            </AuthProvider>
        </>
    );
};

export default App;
