import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Paperclip, Star } from 'lucide-react-native';
import { Email } from '../types';
import { theme, avatarColor, initials } from '../theme';

interface EmailListItemProps {
    email: Email;
    onPress: () => void;
    onToggleStar: () => void;
}

const formatTimestamp = (ts: string): string => {
    const date = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = diff / (1000 * 60 * 60 * 24);

    if (days < 1) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days < 7) {
        return date.toLocaleDateString([], { weekday: 'short' });
    } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
};

export const EmailListItem = ({ email, onPress, onToggleStar }: EmailListItemProps) => {
    const isUnread = !email.isRead;
    const bgColor = avatarColor(email.sender.name);
    const initial = initials(email.sender.name);

    return (
        <TouchableOpacity
            style={[styles.container, isUnread && styles.unreadContainer]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Avatar */}
            <View style={[styles.avatar, { backgroundColor: bgColor }]}>
                <Text style={styles.avatarText}>{initial}</Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.topRow}>
                    <Text
                        style={[styles.sender, isUnread && styles.senderBold]}
                        numberOfLines={1}
                    >
                        {email.sender.name}
                    </Text>
                    <View style={styles.rightMeta}>
                        {email.attachments.length > 0 && (
                            <Paperclip size={14} color={theme.colors.textMuted} style={styles.attachIcon} />
                        )}
                        <Text style={[styles.timestamp, isUnread && styles.timestampBold]}>
                            {formatTimestamp(email.timestamp)}
                        </Text>
                    </View>
                </View>

                <View style={styles.bottomRow}>
                    <View style={styles.subjectSnippet}>
                        <Text style={[styles.subject, isUnread && styles.subjectBold]} numberOfLines={1}>
                            {email.subject}
                        </Text>
                        <Text style={styles.snippet} numberOfLines={1}>
                            {'  —  '}{email.snippet}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={onToggleStar}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        style={styles.starBtn}
                    >
                        <Star
                            size={18}
                            color={email.isStarred ? theme.colors.starYellow : theme.colors.border}
                            fill={email.isStarred ? theme.colors.starYellow : 'transparent'}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 16,
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceAlt,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: theme.colors.border,
    },
    unreadContainer: {
        backgroundColor: theme.colors.background,
    },
    avatar: {
        width: 40, height: 40, borderRadius: 20,
        justifyContent: 'center', alignItems: 'center',
        marginRight: theme.spacing.md, flexShrink: 0,
    },
    avatarText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    content: { flex: 1, minWidth: 0 },
    topRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 2,
    },
    sender: {
        fontSize: 14, color: theme.colors.textSecondary,
        flex: 1, marginRight: 8,
    },
    senderBold: { fontWeight: '700', color: theme.colors.textPrimary },
    rightMeta: { flexDirection: 'row', alignItems: 'center', flexShrink: 0 },
    attachIcon: { marginRight: 4 },
    timestamp: { fontSize: 12, color: theme.colors.textMuted },
    timestampBold: { fontWeight: '600', color: theme.colors.textSecondary },
    bottomRow: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    subjectSnippet: { flex: 1, flexDirection: 'row', minWidth: 0 },
    subject: {
        fontSize: 14, color: theme.colors.textSecondary, flexShrink: 1,
    },
    subjectBold: { fontWeight: '700', color: theme.colors.textPrimary },
    snippet: {
        fontSize: 14, color: theme.colors.textMuted, flexShrink: 1,
    },
    starBtn: { paddingLeft: 8, flexShrink: 0 },
});
