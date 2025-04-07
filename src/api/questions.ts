import { axiosCoreInstance } from '../utils/axiosConfig';
import { QuestionRequest, QuestionResponse, GenerateQuestionRequest } from '../interfaces/Question';
import { getToken } from '../utils/tokenUtils';
import { AxiosResponse } from 'axios';

export const addQuestionToDeck = async (deckFrn: string, data: QuestionRequest): Promise<QuestionResponse> => {
    const token = getToken();
    const response: AxiosResponse<QuestionResponse> = await axiosCoreInstance.post(`/decks/${deckFrn}/questions`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const generateQuestions = async (deckFrn: string, data: GenerateQuestionRequest): Promise<QuestionResponse> => {
    const token = getToken();
    const response: AxiosResponse<QuestionResponse> = await axiosCoreInstance.post(`/decks/${deckFrn}/questions/generate`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getQuestionsInDeck = async (deckFrn: string): Promise<QuestionResponse[]> => {
    const token = getToken();
    const response: AxiosResponse<QuestionResponse[]> = await axiosCoreInstance.get(`/decks/${deckFrn}/questions`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getQuestionDetails = async (deckFrn: string, questionId: string): Promise<QuestionResponse> => {
    const token = getToken();
    const response: AxiosResponse<QuestionResponse> = await axiosCoreInstance.get(`/decks/${deckFrn}/questions/${questionId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const updateQuestion = async (deckFrn: string, questionId: string, data: QuestionRequest): Promise<QuestionResponse> => {
    const token = getToken();
    const response: AxiosResponse<QuestionResponse> = await axiosCoreInstance.put(`/decks/${deckFrn}/questions/${questionId}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const deleteQuestion = async (deckFrn: string, questionId: string): Promise<void> => {
    const token = getToken();
    await axiosCoreInstance.delete(`/decks/${deckFrn}/questions/${questionId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
