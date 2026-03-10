// Tmail Design Theme — Gmail-inspired color palette and spacing
export const theme = {
    colors: {
        // Brand
        primary: '#D93025',        // Gmail red
        primaryDark: '#B31412',
        primaryLight: '#FDECEA',

        // Surface
        background: '#FFFFFF',
        surfaceAlt: '#F6F8FC',     // sidebar / search bar
        surfaceHover: '#E8F0FE',
        border: '#E0E0E0',

        // Text
        textPrimary: '#202124',
        textSecondary: '#5F6368',
        textMuted: '#80868B',
        textOnPrimary: '#FFFFFF',

        // Accent
        starYellow: '#F4B400',
        unreadDot: '#1A73E8',
        attachmentGray: '#9AA0A6',

        // Avatar palette (cycles for sender initials)
        avatarColors: [
            '#E53935', '#8E24AA', '#3949AB', '#00897B',
            '#43A047', '#FB8C00', '#6D4C41', '#1E88E5',
        ],
    },
    spacing: {
        xs: 4, sm: 8, md: 16, lg: 24, xl: 32,
    },
    radius: {
        sm: 6, md: 12, lg: 24, full: 9999,
    },
    font: {
        regular: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
    },
};

/** Pick a deterministic avatar background color from sender name */
export const avatarColor = (name: string): string => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return theme.colors.avatarColors[Math.abs(hash) % theme.colors.avatarColors.length];
};

/** Get initials (up to 2 chars) from a display name */
export const initials = (name: string): string =>
    name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
