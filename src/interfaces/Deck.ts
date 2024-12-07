export enum DeckType {
    QUESTION = 'QUESTION',
    CARD = 'CARD',
}

export interface Deck {
    id: number;
    deckType: DeckType;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateDeckRequest {
    deckType: string;
    name: string;
    description: string;
}
