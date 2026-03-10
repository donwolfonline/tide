import { create } from 'zustand';
import { Email } from '../types';
import mockData from '../fixtures/mockEmails.json';

interface EmailState {
    emails: Email[];
    currentFolder: string;
    searchQuery: string;
    isComposeVisible: boolean;
    isDrawerExpanded: boolean;
    setFolder: (folder: string) => void;
    setSearchQuery: (query: string) => void;
    setComposeVisible: (visible: boolean) => void;
    toggleDrawer: () => void;
    markAsRead: (id: string) => void;
    toggleStar: (id: string) => void;
    deleteEmail: (id: string) => void;
    addEmail: (email: Email) => void;
}

export const useEmailStore = create<EmailState>((set) => ({
    emails: mockData as Email[],
    currentFolder: 'inbox',
    searchQuery: '',
    isComposeVisible: false,
    isDrawerExpanded: true,

    setFolder: (folder) => set({ currentFolder: folder }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setComposeVisible: (visible) => set({ isComposeVisible: visible }),
    toggleDrawer: () => set((state) => ({ isDrawerExpanded: !state.isDrawerExpanded })),

    markAsRead: (id) =>
        set((state) => ({
            emails: state.emails.map((e) => (e.id === id ? { ...e, isRead: true } : e)),
        })),

    toggleStar: (id) =>
        set((state) => ({
            emails: state.emails.map((e) => (e.id === id ? { ...e, isStarred: !e.isStarred } : e)),
        })),

    deleteEmail: (id) =>
        set((state) => ({
            emails: state.emails.filter((e) => e.id !== id),
        })),

    addEmail: (email) =>
        set((state) => ({
            emails: [email, ...state.emails],
        })),
}));
