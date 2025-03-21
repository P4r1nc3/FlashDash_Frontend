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

export const getDeckDetails = async (deckFrn: string): Promise<Deck> => {
    const token = getToken();
    const response = await axiosCoreInstance.get(`/decks/${deckFrn}`, {
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

export const updateDeck = async (deckFrn: string, data: CreateDeckRequest): Promise<Deck> => {
    const token = getToken();
    const response: AxiosResponse<Deck> = await axiosCoreInstance.put(`/decks/${deckFrn}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const deleteDeck = async (deckFrn: string): Promise<void> => {
    const token = getToken();
    await axiosCoreInstance.delete(`/decks/${deckFrn}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
