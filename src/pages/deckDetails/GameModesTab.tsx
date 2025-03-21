import {useNavigate, useParams} from "react-router-dom";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { FaRocket } from "react-icons/fa";
import Card from "../../components/ui/Card";
import GradientButton from "../../components/ui/GradientButton";

const GameModesTab = () => {
    const { deckId } = useParams<{ deckId: string }>();
    const navigate = useNavigate();

    return (
        <Card
            title="Game Modes"
            description="Choose a game mode to start practicing with this deck."
            icon={<AiOutlinePlayCircle size={22} />}
        >
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg shadow-sm mb-4">
                <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center shadow-sm mr-3">
                        <FaRocket className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Standard Quiz</h3>
                        <p className="text-gray-600 text-sm">Test your knowledge with questions from this deck.</p>
                    </div>
                </div>
                <GradientButton
                    onClick={() => navigate(`/decks/${deckId}/quiz`)}
                    className="mt-2 py-3 px-6 w-full"
                >
                    Start Quiz
                </GradientButton>
            </div>
        </Card>
    );
};

export default GameModesTab;