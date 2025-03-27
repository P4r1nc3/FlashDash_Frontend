export interface QuestionRequest {
    question: string;
    correctAnswers: string[];
    incorrectAnswers: string[];
    difficulty: string;
}

export interface GenerateQuestionRequest {
    count: number;
    language: string;
    difficulty: string;
    prompt: string;
}

export interface QuestionResponse {
    questionId: string;
    questionFrn: string;
    question: string;
    correctAnswers: string[];
    incorrectAnswers: string[];
    difficulty: string;
    createdAt: string;
    updatedAt: string;
}
