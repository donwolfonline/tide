import React, { useMemo, useState } from 'react';
import {
    View, FlatList, StyleSheet, SafeAreaView,
    Text, TextInput, TouchableOpacity, useWindowDimensions
} from 'react-native';
import { PenSquare, Search, Menu } from 'lucide-react-native';
import { EmailListItem } from '../components/EmailListItem';
import { useEmailStore } from '../store/emailStore';
import { useAuthStore } from '../store/authStore';
import { Email } from '../types';
import { theme, initials, avatarColor } from '../theme';

const FOLDER_LABELS: Record<string, string> = {
    inbox: 'Inbox',
    starred: 'Starred',
    sent: 'Sent',
    drafts: 'Drafts',
    trash: 'Trash',
};

export const InboxScreen = ({ navigation }: any) => {
    const emails = useEmailStore((s) => s.emails);
    const currentFolder = useEmailStore((s) => s.currentFolder);
    const searchQuery = useEmailStore((s) => s.searchQuery);
    const toggleStar = useEmailStore((s) => s.toggleStar);
    const markAsRead = useEmailStore((s) => s.markAsRead);
    const setSearchQuery = useEmailStore((s) => s.setSearchQuery);

    const setComposeVisible = useEmailStore((s) => s.setComposeVisible);
    const currentUser = useAuthStore((s) => s.currentUser);
    const toggleDrawer = () => navigation.toggleDrawer();
    const { width } = useWindowDimensions();
    const isLargeScreen = width >= 768;
    const isDockVisible = width >= 1000; // synced with AppNavigator dock visibility

    const [searchFocused, setSearchFocused] = useState(false);

    const folderLabel = FOLDER_LABELS[currentFolder] ?? currentFolder;

    const filteredEmails = useMemo(() => {
        return emails.filter((email) => {
            const matchesFolder =
                currentFolder === 'starred'
                    ? email.isStarred
                    : email.folder === currentFolder;

            const q = searchQuery.toLowerCase();
            const matchesSearch =
                !q ||
                email.subject.toLowerCase().includes(q) ||
                email.sender.name.toLowerCase().includes(q) ||
                email.snippet.toLowerCase().includes(q);

            return matchesFolder && matchesSearch;
        });
    }, [emails, currentFolder, searchQuery]);

    const unreadCount = useMemo(
        () => emails.filter((e) => e.folder === 'inbox' && !e.isRead).length,
        [emails]
    );

    const renderItem = ({ item }: { item: Email }) => (
        <EmailListItem
            email={item}
            onPress={() => {
                markAsRead(item.id);
                navigation.navigate('Thread', { emailId: item.id });
            }}
            onToggleStar={() => toggleStar(item.id)}
        />
    );

    const userInitials = currentUser ? initials(currentUser.displayName) : '?';
    const userColor = currentUser ? avatarColor(currentUser.displayName) : '#999';

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={[styles.headerRow, isLargeScreen && styles.headerRowDesktop]}>
                {!isDockVisible && (
                    <TouchableOpacity
                        style={styles.menuWrapper}
                        onPress={toggleDrawer}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    >
                        <Menu size={22} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                )}

                {/* Premium search pill */}
                <View style={[
                    styles.searchPill,
                    searchFocused && styles.searchPillFocused,
                    isLargeScreen && styles.searchPillDesktop,
                ]}>
                    <Search size={18} color={searchFocused ? '#0b57d0' : '#9AA0A6'} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={`Search in ${folderLabel}`}
                        placeholderTextColor="#9AA0A6"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
                            <Text style={styles.clearBtnText}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>

            </View>

            {/* Main Content Card */}
            <View style={[styles.mainCard, isLargeScreen && styles.mainCardDesktop]}>
                {/* Folder Title + unread badge */}
                <View style={styles.folderHeader}>
                    <Text style={styles.folderTitle}>{folderLabel}</Text>
                    {currentFolder === 'inbox' && unreadCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{unreadCount}</Text>
                        </View>
                    )}
                </View>

                {/* Email list */}
                <FlatList
                    data={filteredEmails}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={filteredEmails.length === 0 ? styles.emptyList : undefined}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyTitle}>No messages here</Text>
                            <Text style={styles.emptySubtitle}>
                                {searchQuery ? 'Try a different search.' : `Your ${folderLabel.toLowerCase()} is empty.`}
                            </Text>
                        </View>
                    }
                    initialNumToRender={12}
                    windowSize={5}
                    removeClippedSubviews
                />
            </View>

            {/* Compose FAB */}
            {!isDockVisible && (
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => setComposeVisible(true)}
                    activeOpacity={0.8}
                >
                    <PenSquare size={24} color="#001D35" />
                    <Text style={styles.fabText}>Compose</Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F6F8FC' },

    // Header row
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 14,
        gap: 12,
    },
    headerRowDesktop: {
        paddingHorizontal: 0,
        paddingTop: 0,
        paddingBottom: 16,
    },

    // Search pill
    searchPill: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 10,
        borderWidth: 1.5,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    searchPillFocused: {
        borderColor: '#0b57d0',
        shadowColor: '#0b57d0',
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },
    searchPillDesktop: {
        maxWidth: 720,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: theme.colors.textPrimary,
        padding: 0,
        margin: 0,
    },
    clearBtn: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#E0E0E0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    clearBtnText: {
        fontSize: 11,
        color: '#555',
        fontWeight: '700',
    },

    menuWrapper: {
        zIndex: 100,
    },
    avatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
    },
    avatarText: { color: '#fff', fontSize: 14, fontWeight: '700' },

    mainCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 1,
    },
    mainCardDesktop: {
        marginRight: 0,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#C2E7FF',
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    fabText: {
        color: '#001D35',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 12,
    },


    folderHeader: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8,
    },
    folderTitle: {
        fontSize: 15, fontWeight: '600', color: theme.colors.textSecondary,
    },
    badge: {
        backgroundColor: theme.colors.unreadDot, borderRadius: 10,
        paddingHorizontal: 7, paddingVertical: 1, marginLeft: 8,
    },
    badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },

    emptyList: { flexGrow: 1 },
    emptyContainer: {
        flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80,
    },
    emptyTitle: { fontSize: 18, fontWeight: '500', color: theme.colors.textSecondary },
    emptySubtitle: { fontSize: 14, color: theme.colors.textMuted, marginTop: 8 },
});
