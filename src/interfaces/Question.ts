export interface QuestionRequest {
    question: string;
    correctAnswers: string[];
    incorrectAnswers: string[];
    difficulty: string;
}

export interface QuestionResponse {
    questionId: string;
    question: string;
    correctAnswers: string[];
    incorrectAnswers: string[];
    difficulty: string;
    createdAt: string;
    updatedAt: string;
}
