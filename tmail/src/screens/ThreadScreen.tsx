import React from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, SafeAreaView, useWindowDimensions
} from 'react-native';
import { ArrowLeft, Star, Trash2, Reply } from 'lucide-react-native';
import { Email } from '../types';
import { theme, avatarColor, initials } from '../theme';
import { useEmailStore } from '../store/emailStore';

interface ThreadScreenProps {
    navigation: any;
    route: { params: { emailId: string } };
}

export const ThreadScreen = ({ navigation, route }: ThreadScreenProps) => {
    const { emailId } = route.params;
    const emails = useEmailStore((s) => s.emails);
    const toggleStar = useEmailStore((s) => s.toggleStar);
    const deleteEmail = useEmailStore((s) => s.deleteEmail);
    const email = emails.find((e) => e.id === emailId);

    const { width } = useWindowDimensions();
    const isLargeScreen = width >= 768;

    if (!email) {
        return (
            <SafeAreaView style={styles.container}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <ArrowLeft size={22} color={theme.colors.textSecondary} />
                </TouchableOpacity>
                <Text style={{ padding: 16, color: theme.colors.textSecondary }}>Email not found.</Text>
            </SafeAreaView>
        );
    }

    const bgColor = avatarColor(email.sender.name);
    const initial = initials(email.sender.name);
    const date = new Date(email.timestamp).toLocaleString([], {
        weekday: 'long', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });

    const handleDelete = () => {
        deleteEmail(email.id);
        navigation.goBack();
    };

    // Render basic HTML as plain text (strip tags)
    const plainBody = email.body.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.mainCard, isLargeScreen && styles.mainCardDesktop]}>
                {/* Toolbar */}
                <View style={styles.toolbar}>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                        <ArrowLeft size={22} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                    <View style={styles.toolbarRight}>
                        <TouchableOpacity style={styles.iconBtn} onPress={() => toggleStar(email.id)}>
                            <Star
                                size={22}
                                color={email.isStarred ? theme.colors.starYellow : theme.colors.textSecondary}
                                fill={email.isStarred ? theme.colors.starYellow : 'transparent'}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn} onPress={handleDelete}>
                            <Trash2 size={22} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                    {/* Subject */}
                    <Text style={styles.subject}>{email.subject}</Text>

                    {/* Sender row */}
                    <View style={styles.senderRow}>
                        <View style={[styles.avatar, { backgroundColor: bgColor }]}>
                            <Text style={styles.avatarText}>{initial}</Text>
                        </View>
                        <View style={styles.senderInfo}>
                            <Text style={styles.senderName}>{email.sender.name}</Text>
                            <Text style={styles.senderEmail}>{'<'}{email.sender.email}{'>'}</Text>
                            <Text style={styles.date}>{date}</Text>
                        </View>
                    </View>

                    {/* Body */}
                    <View style={styles.bodyContainer}>
                        <Text style={styles.bodyText}>{plainBody}</Text>
                    </View>

                    {/* Attachments */}
                    {email.attachments.length > 0 && (
                        <View style={styles.attachmentsSection}>
                            <Text style={styles.attachmentsLabel}>{email.attachments.length} attachment(s)</Text>
                            {email.attachments.map((att) => (
                                <View key={att.id} style={styles.attachmentChip}>
                                    <Text style={styles.attachmentName}>{att.filename}</Text>
                                    <Text style={styles.attachmentSize}>{att.size}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </ScrollView>

                {/* Reply bar */}
                <View style={styles.replyBar}>
                    <TouchableOpacity style={styles.replyBtn}>
                        <Reply size={16} color={theme.colors.textSecondary} style={{ marginRight: 6 }} />
                        <Text style={styles.replyBtnText}>Reply</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F6F8FC', paddingTop: 16 },
    mainCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: 'hidden',
    },
    mainCardDesktop: {
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 10, elevation: 1,
    },
    toolbar: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 8, paddingVertical: 8,
        borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.border,
    },
    toolbarRight: { flexDirection: 'row', gap: 4 },
    iconBtn: { padding: 8, borderRadius: 20 },
    scroll: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 40 },
    subject: {
        fontSize: 22, fontWeight: '400', color: theme.colors.textPrimary, marginBottom: 16,
    },
    senderRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24 },
    avatar: {
        width: 44, height: 44, borderRadius: 22,
        justifyContent: 'center', alignItems: 'center', marginRight: 12, flexShrink: 0,
    },
    avatarText: { color: '#fff', fontSize: 18, fontWeight: '600' },
    senderInfo: { flex: 1 },
    senderName: { fontSize: 14, fontWeight: '600', color: theme.colors.textPrimary },
    senderEmail: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },
    date: { fontSize: 12, color: theme.colors.textMuted, marginTop: 4 },
    bodyContainer: { marginBottom: 24 },
    bodyText: { fontSize: 15, color: theme.colors.textPrimary, lineHeight: 24 },
    attachmentsSection: { marginTop: 8 },
    attachmentsLabel: {
        fontSize: 12, color: theme.colors.textSecondary, marginBottom: 8, fontWeight: '600',
    },
    attachmentChip: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.radius.sm,
        padding: 12, marginBottom: 6,
    },
    attachmentName: { fontSize: 13, color: theme.colors.textPrimary, fontWeight: '500' },
    attachmentSize: { fontSize: 12, color: theme.colors.textMuted },
    replyBar: {
        padding: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.border,
        backgroundColor: theme.colors.background,
    },
    replyBtn: {
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.full,
        paddingVertical: 8, paddingHorizontal: 20, alignSelf: 'flex-start',
    },
    replyBtnText: { fontSize: 14, color: theme.colors.textSecondary, fontWeight: '500' },
});
