import { useNavigate } from "react-router-dom";
import { AiOutlinePlayCircle } from "react-icons/ai";

interface GameModesTabProps {
    deckId: string;
}

const GameModesTab = ({ deckId }: GameModesTabProps) => {
    const navigate = useNavigate();

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <AiOutlinePlayCircle size={22} /> Game Modes
            </h2>
            <button
                className="mt-4 bg-blue-500 text-white py-3 px-6 rounded-lg w-full"
                onClick={() => navigate(`/decks/${deckId}/quiz`)}
            >
                Start Quiz
            </button>
        </div>
    );
};

export default GameModesTab;
