export interface CardRequest {
    question: string;
    answer: string;
    difficulty: string;
}

export interface CardResponse {
    cardId: string;
    question: string;
    answer: string;
    difficulty: string;
    createdAt: string;
    updatedAt: string;
}
