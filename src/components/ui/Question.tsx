import React from 'react';
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

interface AnswerItem {
    text: string;
    isCorrect: boolean;
    isUserAnswer?: boolean;
    isMissed?: boolean;
}

interface QuestionProps {
    index: number;
    question: string;
    answers: AnswerItem[];
    difficulty?: string;
    editable?: boolean;
    status?: 'correct' | 'incorrect' | 'neutral';
    onEdit?: () => void;
    onDelete?: () => void;
}

const Question: React.FC<QuestionProps> = ({
                                               index,
                                               question,
                                               answers,
                                               difficulty,
                                               editable = false,
                                               status = 'neutral',
                                               onEdit,
                                               onDelete,
                                           }) => {
    // Get status styling
    const getStatusStyling = () => {
        switch (status) {
            case 'correct':
                return {
                    border: 'border-l-4 border-green-500',
                    badge: 'bg-green-100 text-green-700',
                    badgeText: 'Correct'
                };
            case 'incorrect':
                return {
                    border: 'border-l-4 border-red-500',
                    badge: 'bg-red-100 text-red-700',
                    badgeText: 'Incorrect'
                };
            default:
                return {
                    border: 'border-l-4 border-blue-500',
                    badge: '',
                    badgeText: ''
                };
        }
    };

    // Get difficulty badge styling
    const getDifficultyBadge = (difficultyLevel: string) => {
        let colors = '';
        switch (difficultyLevel?.toLowerCase()) {
            case 'easy':
                colors = 'bg-green-100 text-green-700';
                break;
            case 'medium':
                colors = 'bg-yellow-100 text-yellow-700';
                break;
            case 'hard':
                colors = 'bg-red-100 text-red-700';
                break;
            default:
                colors = 'bg-blue-100 text-blue-700';
        }
        return <span className={`px-3 py-1.5 rounded-md text-xs font-medium ${colors}`}>{difficultyLevel}</span>;
    };

    // Get answer styling and icon
    const getAnswerStyle = (answer: AnswerItem) => {
        if (answer.isCorrect && answer.isUserAnswer) {
            return {
                containerClass: 'bg-green-50 text-green-700 border border-green-200',
                icon: <BsCheckCircleFill className="text-green-500 mr-2 text-xs flex-shrink-0" />
            };
        } else if (!answer.isCorrect && answer.isUserAnswer) {
            return {
                containerClass: 'bg-red-50 text-red-700 border border-red-200',
                icon: <BsXCircleFill className="text-red-500 mr-2 text-xs flex-shrink-0" />
            };
        } else if (answer.isCorrect && answer.isMissed) {
            return {
                containerClass: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
                icon: <BsCheckCircleFill className="text-yellow-500 mr-2 text-xs flex-shrink-0" />
            };
        } else if (answer.isCorrect) {
            return {
                containerClass: 'bg-green-50 text-green-700 border border-green-200',
                icon: <BsCheckCircleFill className="text-green-500 mr-2 text-xs flex-shrink-0" />
            };
        } else {
            return {
                containerClass: 'bg-gray-50 text-gray-500 border border-gray-200',
                icon: <BsXCircleFill className="text-gray-400 mr-2 text-xs flex-shrink-0" />
            };
        }
    };

    const statusStyle = getStatusStyling();

    return (
        <div className={`p-4 bg-white rounded-lg shadow-sm ${statusStyle.border} transition-all hover:shadow-md`}>
            {/* Header with question number, status badge and action buttons */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shadow-sm">
                            <span className="text-indigo-700 text-xs font-bold">{index}</span>
                        </div>
                        <h4 className="font-semibold text-base text-gray-800">Question {index}</h4>
                    </div>

                    {difficulty && getDifficultyBadge(difficulty)}

                    {status !== 'neutral' && (
                        <span className={`px-3 py-1.5 rounded-md text-xs font-medium ${statusStyle.badge}`}>
              {statusStyle.badgeText}
            </span>
                    )}
                </div>

                {editable && (
                    <div className="flex space-x-2">
                        <button
                            className="text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-md transition-colors"
                            onClick={onEdit}
                        >
                            <AiOutlineEdit size={18} />
                        </button>
                        <button
                            className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded-md transition-colors"
                            onClick={onDelete}
                        >
                            <AiOutlineDelete size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* Question text */}
            <p className="text-gray-700 mb-4 text-sm bg-gray-50 p-3 rounded-lg">{question}</p>

            {/* Answers */}
            <div className="space-y-2">
                {answers.map((answer, i) => {
                    const answerStyle = getAnswerStyle(answer);
                    return (
                        <div
                            key={i}
                            className={`p-3 rounded-lg text-sm font-medium flex items-center ${answerStyle.containerClass} transition-colors`}
                        >
                            {answerStyle.icon}
                            <span>{answer.text}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Question;