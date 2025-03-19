import { Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home.tsx';
import Login from './pages/auth/Login.tsx';
import Register from './pages/auth/Register.tsx';
import DeckManager from './pages/deckManager/DeckManager.tsx';
import DeckDetails from './pages/deckDetails/DeckDetails.tsx';
import GameSession from './pages/gameSession/GameSession.tsx';
import QuizGame from './pages/game/QuizGame.tsx';
import Account from './pages/account/Account.tsx';
import Friends from './pages/friend/Friends.tsx';
import NotFound from './pages/util/NotFound.tsx';
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
