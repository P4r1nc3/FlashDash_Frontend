export interface Deck {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateDeckRequest {
    name: string;
    description: string;
}
