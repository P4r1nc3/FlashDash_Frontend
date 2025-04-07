import { UserSummary } from './UserSummary';

export interface LeaderboardEntry {
    rank: number;
    score: number;
    user: UserSummary;
}
