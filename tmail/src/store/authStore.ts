import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TmailUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string; // e.g. john.doe@tmail.com
    displayName: string;
    avatarColor: string;
    createdAt: string;
}

interface AuthState {
    currentUser: TmailUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    // All registered users in mock storage
    users: TmailUser[];

    signIn: (email: string, password: string) => Promise<boolean>;
    signUp: (firstName: string, lastName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signOut: () => Promise<void>;
    loadSession: () => Promise<void>;
    clearError: () => void;
}

const AVATAR_COLORS = [
    '#E53935', '#8E24AA', '#3949AB', '#00897B',
    '#43A047', '#FB8C00', '#6D4C41', '#1E88E5',
];

const pickColor = (name: string) => {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
};

// Mock password store (in memory — good enough for simulation)
const passwordStore: Record<string, string> = {
    'frederick@tmail.com': 'password123',
};

const syncCookie = (user: TmailUser | null) => {
    if (typeof document !== 'undefined') {
        if (user) {
            // Set cookie for localhost (shared across ports)
            document.cookie = `tmail_session_v1=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400; SameSite=Lax`;
        } else {
            // Clear cookie
            document.cookie = "tmail_session_v1=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }
};

const SEED_USERS: TmailUser[] = [
    {
        id: 'u_001',
        firstName: 'Frederick',
        lastName: 'Dineen',
        email: 'frederick@tmail.com',
        displayName: 'Frederick Dineen',
        avatarColor: '#1E88E5',
        createdAt: '2026-01-01T00:00:00Z',
    },
];

export const useAuthStore = create<AuthState>((set, get) => ({
    currentUser: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    users: SEED_USERS,

    clearError: () => set({ error: null }),

    loadSession: async () => {
        set({ isLoading: true });
        try {
            const stored = await AsyncStorage.getItem('@tmail_session');
            if (stored) {
                const user: TmailUser = JSON.parse(stored);
                set({ currentUser: user, isAuthenticated: true });
                syncCookie(user);
            }
        } catch (_) {
            // ignore
        } finally {
            set({ isLoading: false });
        }
    },

    signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        await new Promise((r) => setTimeout(r, 800)); // sim network

        const { users } = get();
        const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        const storedPw = passwordStore[email.toLowerCase()];

        if (!user || storedPw !== password) {
            set({ isLoading: false, error: 'Invalid email or password.' });
            return false;
        }

        await AsyncStorage.setItem('@tmail_session', JSON.stringify(user));
        set({ currentUser: user, isAuthenticated: true, isLoading: false });
        syncCookie(user);
        return true;
    },

    signUp: async (firstName, lastName, email, password) => {
        set({ isLoading: true, error: null });
        await new Promise((r) => setTimeout(r, 1000));

        const { users } = get();

        // Build the tmail address from the provided email or generate it
        const localPart = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
        let tmailAddress = `${localPart}@tmail.com`;

        // Check uniqueness — suffix with number if taken
        let suffix = 1;
        while (users.find((u) => u.email === tmailAddress)) {
            tmailAddress = `${localPart}${suffix}@tmail.com`;
            suffix++;
        }

        const newUser: TmailUser = {
            id: `u_${Date.now()}`,
            firstName,
            lastName,
            email: tmailAddress,
            displayName: `${firstName} ${lastName}`,
            avatarColor: pickColor(`${firstName}${lastName}`),
            createdAt: new Date().toISOString(),
        };

        passwordStore[tmailAddress] = password;
        set({ users: [...users, newUser], isLoading: false });
        await AsyncStorage.setItem('@tmail_session', JSON.stringify(newUser));
        set({ currentUser: newUser, isAuthenticated: true });
        syncCookie(newUser);
        return { success: true };
    },

    signOut: async () => {
        await AsyncStorage.removeItem('@tmail_session');
        set({ currentUser: null, isAuthenticated: false });
        syncCookie(null);
    },
}));
