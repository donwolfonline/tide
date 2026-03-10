import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

/**
 * This component acts as a hidden iframe bridge.
 * It reads the auth state from Tmail's localStorage and sends it to the parent window (Tide) via postMessage.
 */
export const AuthBridgeScreen = () => {
    const { currentUser, isAuthenticated, loadSession } = useAuthStore();

    useEffect(() => {
        // Force a session load when the bridge mounts
        loadSession();
    }, []);

    useEffect(() => {
        // Whenever the auth state changes, broadcast it to the parent window (Tide at localhost:3000)
        if (window.parent !== window) {
            window.parent.postMessage({
                type: 'TMAIL_AUTH_SYNC',
                isAuthenticated,
                user: currentUser
            }, 'http://localhost:3000');
        }
    }, [currentUser, isAuthenticated]);

    // Send an immediate sync request handler in case the parent asks
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== 'http://localhost:3000') return;
            if (event.data?.type === 'TMAIL_AUTH_REQUEST') {
                window.parent.postMessage({
                    type: 'TMAIL_AUTH_SYNC',
                    isAuthenticated: useAuthStore.getState().isAuthenticated,
                    user: useAuthStore.getState().currentUser
                }, 'http://localhost:3000');
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return null; // Hidden component
};
