import { create } from 'zustand';

export interface User {
    _id: string;
    username: string;
    displayName: string;
    email: string;
    avatar: string;
    role: 'user' | 'admin';
}

interface UserStore {
    user: User | null;
    token: string | null;
    login: (user: User, token: string) => void;
    logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    token: null,

    login: (user, token) => {
        set({
            user,
            token,
        });
    },

    logout: () => {
        set({
            user: null,
            token: null,
        });
    },
}));