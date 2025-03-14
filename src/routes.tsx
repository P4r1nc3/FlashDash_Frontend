import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DeckManager from './pages/DeckManager';
import DeckDetails from './pages/deckDetails/DeckDetails.tsx';
import GameSession from './pages/GameSession';
import QuizGame from './pages/QuizGame';
import Account from './pages/account/Account.tsx';
import Friends from './pages/Friends';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/decks" element={<ProtectedRoute><DeckManager /></ProtectedRoute>} />
        <Route path="/decks/:deckId" element={<ProtectedRoute><DeckDetails /></ProtectedRoute>} />
        <Route path="/decks/:deckId/quiz" element={<ProtectedRoute><QuizGame /></ProtectedRoute>} />
        <Route path="/decks/:deckId/gameSession/:gameSessionId" element={<ProtectedRoute><GameSession /></ProtectedRoute>} />
        <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
    </Routes>
);

export default AppRoutes;
