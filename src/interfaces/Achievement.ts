export interface Achievement {
    achievementId: string;
    achievementFrn: string;
    schemaId: string;
    schemaFrn: string;
    name: string;
    description: string;
    achievementType: string;
    level: number;
    threshold: number;
    achievedAt: string;
}

export interface AchievementSchema {
    schemaId: string;
    schemaFrn: string;
    name: string;
    description: string;
    achievementType: string;
    level: number;
    threshold: number;
}
