import axiosInstance from '../utils/axiosConfig';
import { GameSessionResult } from '../interfaces/GameSession';
import { QuestionResponse } from '../interfaces/Question';
import { getToken } from '../utils/tokenUtils';
import { AxiosResponse } from 'axios';

export const startGameSession = async (deckId: string): Promise<QuestionResponse[]> => {
    const token = getToken();
    const response: AxiosResponse<QuestionResponse[]> = await axiosInstance.post(`/decks/${deckId}/gameSessions/start`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};


export const endGameSession = async (deckId: string, userAnswers: QuestionResponse[]): Promise<GameSessionResult> => {
    const token = getToken();
    const response: AxiosResponse<GameSessionResult> = await axiosInstance.post(`/decks/${deckId}/gameSessions/end`, userAnswers, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
