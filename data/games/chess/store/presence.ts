import { create } from "zustand";

interface PresenceState {
    onlinePlayers: Record<string, boolean>; // { userId: true }
    setOnline: (userId: string) => void;
    setOffline: (userId: string) => void;
    reset: () => void;
}

export const usePresenceStore = create<PresenceState>((set) => ({
    onlinePlayers: {},

    setOnline: (userId) =>
        set((state) => ({
            onlinePlayers: {
                ...state.onlinePlayers,
                [userId]: true,
            },
        })),

    setOffline: (userId) =>
        set((state) => {
            const updated = { ...state.onlinePlayers };
            delete updated[userId];
            return { onlinePlayers: updated };
        }),

    reset: () => set({ onlinePlayers: {} }),
}));
