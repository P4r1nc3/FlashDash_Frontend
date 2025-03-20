import { useNavigate } from "react-router-dom";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { FaRocket } from "react-icons/fa";

interface GameModesTabProps {
    deckId: string;
}

const GameModesTab = ({ deckId }: GameModesTabProps) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-xl shadow-md w-full">
            {/* Top gradient line */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-t-xl"></div>

            <div className="p-6">
                <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2 mb-1">
                    <AiOutlinePlayCircle size={22} className="text-indigo-500" /> Game Modes
                </h2>
                <p className="text-gray-500 mb-6 text-sm">Choose a game mode to start practicing with this deck.</p>

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
                    <button
                        className="mt-2 bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500 text-white py-3 px-6 rounded-lg w-full font-medium transition-colors shadow-sm relative overflow-hidden"
                        onClick={() => navigate(`/decks/${deckId}/quiz`)}
                    >
                        Start Quiz
                        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 animate-shine"></div>
                    </button>
                </div>

                {/*
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-teal-400 rounded-full flex items-center justify-center shadow-sm mr-3">
                            <FaStopwatch className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Timed Challenge</h3>
                            <p className="text-gray-600 text-sm">Race against the clock to answer as many questions as possible.</p>
                        </div>
                    </div>
                    <button
                        className="mt-2 bg-gradient-to-r from-green-400 to-teal-400 hover:from-green-500 hover:to-teal-500 text-white py-3 px-6 rounded-lg w-full font-medium transition-colors shadow-sm relative overflow-hidden"
                        onClick={() => navigate(`/decks/${deckId}/timed`)}
                    >
                        Start Timed Challenge
                        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 animate-shine"></div>
                    </button>
                </div>
                */}
            </div>
        </div>
    );
};

// Add keyframes for the shine animation
const style = document.createElement('style');
style.innerHTML = `
@keyframes shine {
  from {
    left: -100%;
  }
  to {
    left: 100%;
  }
}
.animate-shine {
  animation: shine 3s infinite;
}
`;
document.head.appendChild(style);

export default GameModesTab;