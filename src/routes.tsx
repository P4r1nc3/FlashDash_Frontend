import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes = () => (
    <Routes>
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
        <Route path="*" element={<NotFound />} />
    </Routes>
);

export default AppRoutes;
