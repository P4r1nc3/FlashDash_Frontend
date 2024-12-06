import axiosInstance from '../utils/axiosConfig';
import { Deck, CreateDeckRequest } from '../interfaces/Deck';
import { getToken } from '../utils/tokenUtils';
import { AxiosResponse } from 'axios';

export const getDecks = async (): Promise<Deck[]> => {
    const token = getToken();
    const response: AxiosResponse<Deck[]> = await axiosInstance.get('/decks', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getDeckDetails = async (deckId: string): Promise<Deck> => {
    const token = getToken();
    const response = await axiosInstance.get(`/decks/${deckId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const createDeck = async (data: CreateDeckRequest): Promise<Deck> => {
    const token = getToken();
    const response: AxiosResponse<Deck> = await axiosInstance.post('/decks', data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const updateDeck = async (deckId: number, data: CreateDeckRequest): Promise<Deck> => {
    const token = getToken();
    const response: AxiosResponse<Deck> = await axiosInstance.put(`/decks/${deckId}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const deleteDeck = async (deckId: number): Promise<void> => {
    const token = getToken();
    await axiosInstance.delete(`/decks/${deckId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
