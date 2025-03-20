import { axiosCoreInstance } from '../utils/axiosConfig';
import { Deck, CreateDeckRequest } from '../interfaces/Deck';
import { getToken } from '../utils/tokenUtils';
import { AxiosResponse } from 'axios';

export const getDecks = async (): Promise<Deck[]> => {
    const token = getToken();
    const response: AxiosResponse<Deck[]> = await axiosCoreInstance.get('/decks', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getDeckDetails = async (deckId: string): Promise<Deck> => {
    const token = getToken();
    const response = await axiosCoreInstance.get(`/decks/${deckId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const createDeck = async (data: CreateDeckRequest): Promise<Deck> => {
    const token = getToken();
    const response: AxiosResponse<Deck> = await axiosCoreInstance.post('/decks', data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const updateDeck = async (deckId: number, data: CreateDeckRequest): Promise<Deck> => {
    const token = getToken();
    const response: AxiosResponse<Deck> = await axiosCoreInstance.put(`/decks/${deckId}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const deleteDeck = async (deckId: number): Promise<void> => {
    const token = getToken();
    await axiosCoreInstance.delete(`/decks/${deckId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
