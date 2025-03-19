export interface GameSessionResult {
    gameSessionId: string;
    gameSessionFrn: string;
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    duration: string;
    accuracy: number;
    startTime: string;
    endTime: string;
    sessionDetails: SessionDetail[];
}

export interface SessionDetail {
    questionText: string;
    correctAnswers: string[];
    incorrectAnswers: string[];
    userAnswers: string[];
    wasCorrect: boolean;
}