import axiosInstance from '../utils/axiosConfig';
import { GameSessionResult } from '../interfaces/GameSession';
import {QuestionRequest, QuestionResponse} from '../interfaces/Question';
import { getToken } from '../utils/tokenUtils';
import { AxiosResponse } from 'axios';

export const startGameSession = async (deckFrn: string): Promise<QuestionResponse[]> => {
    const token = getToken();
    const response: AxiosResponse<QuestionResponse[]> = await axiosInstance.post(`/decks/${deckFrn}/gameSessions/start`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const endGameSession = async (deckFrn: string, userAnswers: QuestionRequest[]): Promise<GameSessionResult> => {
    const token = getToken();
    const response: AxiosResponse<GameSessionResult> = await axiosInstance.post(`/decks/${deckFrn}/gameSessions/end`, userAnswers, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getGameSessions = async (deckFrn: string): Promise<GameSessionResult[]> => {
    const token = getToken();
    const response = await axiosInstance.get(`/decks/${deckFrn}/gameSessions`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getGameSession = async (deckFrn: string, gameSessionFrn: string): Promise<GameSessionResult> => {
    const token = getToken();
    const response = await axiosInstance.get(`/decks/${deckFrn}/gameSessions/${gameSessionFrn}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
