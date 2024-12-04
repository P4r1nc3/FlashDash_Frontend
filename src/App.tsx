import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import AppRoutes from './routes';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
};

export default App;
