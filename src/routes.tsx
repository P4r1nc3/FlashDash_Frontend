import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DeckManager from './pages/DeckManager';
import DeckDetails from './pages/DeckDetails';
import FlashGame from './pages/FlashGame.tsx';
import MatchingGame from './pages/MatchingGame';
import QuizGame from './pages/QuizGame';
import Account from './pages/Account';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes = () => (
    <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>}/>
            <Route path="/decks" element={<ProtectedRoute><DeckManager /></ProtectedRoute>}/>
            <Route path="/decks/:deckId" element={<ProtectedRoute><DeckDetails /></ProtectedRoute>}/>
            <Route path="/decks/:deckId/flashcards" element={<ProtectedRoute><FlashGame /></ProtectedRoute>} />
            <Route path="/decks/:deckId/matching" element={<ProtectedRoute><MatchingGame /></ProtectedRoute>} />
            <Route path="/decks/:deckId/quiz" element={<ProtectedRoute><QuizGame /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
    </Routes>
);

export default AppRoutes;
