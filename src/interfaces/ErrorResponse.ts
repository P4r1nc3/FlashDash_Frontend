export interface ErrorResponse {
    status: number;
    error: string;
    cause: string;
    action: string;
    timestamp: string;
    correlationId: string;
}
