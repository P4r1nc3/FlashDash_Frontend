export interface Deck {
    deckId: string;
    deckFrn: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateDeckRequest {
    name: string;
    description: string;
}
