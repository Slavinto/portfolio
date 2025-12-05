export interface ProjectTabsConstants {
    title: string;
    value: string;
    imageName: string;
    hasTheme?: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface IPlayer {
    id: string;
    username: string | null;
    bio: string | null;
    avatar_url: string | null;
    rating: number;
    wins: number;
    losses: number;
    draws: number;
    created_at: string;
    updated_at: string;
}
