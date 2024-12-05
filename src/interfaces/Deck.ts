export interface Deck {
    id: number;
    deckType: string;
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
