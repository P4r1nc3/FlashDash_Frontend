import axiosInstance from '../utils/axiosConfig';
import { CardRequest, CardResponse } from '../interfaces/Card';
import { getToken } from '../utils/tokenUtils';
import { AxiosResponse } from 'axios';

export const addCardToDeck = async (deckId: string, data: CardRequest): Promise<CardResponse> => {
    const token = getToken();
    const response: AxiosResponse<CardResponse> = await axiosInstance.post(`/decks/${deckId}/cards`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getCardsInDeck = async (deckId: string): Promise<CardResponse[]> => {
    const token = getToken();
    const response: AxiosResponse<CardResponse[]> = await axiosInstance.get(`/decks/${deckId}/cards`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getCardDetails = async (deckId: string, cardId: string): Promise<CardResponse> => {
    const token = getToken();
    const response: AxiosResponse<CardResponse> = await axiosInstance.get(`/decks/${deckId}/cards/${cardId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const updateCard = async (deckId: string, cardId: string, data: CardRequest): Promise<CardResponse> => {
    const token = getToken();
    const response: AxiosResponse<CardResponse> = await axiosInstance.put(`/decks/${deckId}/cards/${cardId}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const deleteCard = async (deckId: string, cardId: string): Promise<void> => {
    const token = getToken();
    await axiosInstance.delete(`/decks/${deckId}/cards/${cardId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
