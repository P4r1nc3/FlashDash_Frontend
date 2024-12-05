import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DeckManager from './pages/DeckManager.tsx';
import Account from './pages/Account';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
            path="/account"
            element={
                <ProtectedRoute>
                    <Account />
                </ProtectedRoute>
            }
        />
        <Route
            path="/decks"
            element={
                <ProtectedRoute>
                    <DeckManager />
                </ProtectedRoute>
            }
        />

        <Route path="*" element={<NotFound />} />
    </Routes>
);

export default AppRoutes;
