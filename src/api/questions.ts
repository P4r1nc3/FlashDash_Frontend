import { axiosCoreInstance } from '../utils/axiosConfig';
import { QuestionRequest, QuestionResponse } from '../interfaces/Question';
import { getToken } from '../utils/tokenUtils';
import { AxiosResponse } from 'axios';

export const addQuestionToDeck = async (deckId: string, data: QuestionRequest): Promise<QuestionResponse> => {
    const token = getToken();
    const response: AxiosResponse<QuestionResponse> = await axiosCoreInstance.post(`/decks/${deckId}/questions`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getQuestionsInDeck = async (deckId: string): Promise<QuestionResponse[]> => {
    const token = getToken();
    const response: AxiosResponse<QuestionResponse[]> = await axiosCoreInstance.get(`/decks/${deckId}/questions`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getQuestionDetails = async (deckId: string, questionId: string): Promise<QuestionResponse> => {
    const token = getToken();
    const response: AxiosResponse<QuestionResponse> = await axiosCoreInstance.get(`/decks/${deckId}/questions/${questionId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const updateQuestion = async (deckId: string, questionId: string, data: QuestionRequest): Promise<QuestionResponse> => {
    const token = getToken();
    const response: AxiosResponse<QuestionResponse> = await axiosCoreInstance.put(`/decks/${deckId}/questions/${questionId}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const deleteQuestion = async (deckId: string, questionId: string): Promise<void> => {
    const token = getToken();
    await axiosCoreInstance.delete(`/decks/${deckId}/questions/${questionId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
