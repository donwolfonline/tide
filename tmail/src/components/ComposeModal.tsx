import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    Modal, KeyboardAvoidingView, Platform, ScrollView,
    ActivityIndicator, Alert, useWindowDimensions
} from 'react-native';
import { X, Minus, ChevronDown, ChevronUp, Paperclip, Send } from 'lucide-react-native';
import { theme } from '../theme';
import { sendEmail } from '../services/emailService';

interface ComposeModalProps {
    visible: boolean;
    onClose: () => void;
}

export const ComposeModal = ({ visible, onClose }: ComposeModalProps) => {
    const [to, setTo] = useState('');
    const [cc, setCc] = useState('');
    const [bcc, setBcc] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [showCcBcc, setShowCcBcc] = useState(false);
    const [sending, setSending] = useState(false);

    const { width } = useWindowDimensions();
    const isLargeScreen = width >= 768;

    const reset = () => {
        setTo(''); setCc(''); setBcc(''); setSubject(''); setBody('');
        setShowCcBcc(false); setSending(false);
    };

    const handleClose = () => { reset(); onClose(); };

    const handleSend = async () => {
        if (!to.trim()) { Alert.alert('Missing recipient', 'Please add at least one To: address.'); return; }
        setSending(true);
        await new Promise((r) => setTimeout(r, 600)); // sim send delay
        sendEmail({ to: to.trim(), cc: cc.trim() || undefined, bcc: bcc.trim() || undefined, subject, body });
        setSending(false);
        Alert.alert('Sent', `Your email to "${to}" has been sent.`);
        handleClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View
                style={[styles.overlay, isLargeScreen && styles.overlayDesktop]}
                pointerEvents="box-none"
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={[styles.sheet, isLargeScreen && styles.sheetDesktop]}
                    pointerEvents="auto"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>New Message</Text>
                        <View style={styles.headerActions}>
                            <TouchableOpacity style={styles.iconBtn} onPress={handleClose}>
                                <X size={20} color="#444746" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView keyboardShouldPersistTaps="handled" style={styles.body}>
                        {/* To */}
                        <View style={styles.fieldRow}>
                            <Text style={styles.fieldLabel}>To</Text>
                            <TextInput
                                style={styles.fieldInput}
                                value={to}
                                onChangeText={setTo}
                                placeholder="Recipients"
                                placeholderTextColor={theme.colors.textMuted}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <TouchableOpacity onPress={() => setShowCcBcc(!showCcBcc)}>
                                {showCcBcc
                                    ? <ChevronUp size={18} color={theme.colors.textSecondary} />
                                    : <ChevronDown size={18} color={theme.colors.textSecondary} />
                                }
                            </TouchableOpacity>
                        </View>

                        {showCcBcc && (
                            <>
                                <View style={styles.fieldRow}>
                                    <Text style={styles.fieldLabel}>Cc</Text>
                                    <TextInput
                                        style={styles.fieldInput}
                                        value={cc}
                                        onChangeText={setCc}
                                        placeholder="Cc recipients"
                                        placeholderTextColor={theme.colors.textMuted}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>
                                <View style={styles.fieldRow}>
                                    <Text style={styles.fieldLabel}>Bcc</Text>
                                    <TextInput
                                        style={styles.fieldInput}
                                        value={bcc}
                                        onChangeText={setBcc}
                                        placeholder="Bcc recipients"
                                        placeholderTextColor={theme.colors.textMuted}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>
                            </>
                        )}

                        {/* Subject */}
                        <View style={styles.fieldRow}>
                            <TextInput
                                style={[styles.fieldInput, styles.subjectInput]}
                                value={subject}
                                onChangeText={setSubject}
                                placeholder="Subject"
                                placeholderTextColor={theme.colors.textMuted}
                            />
                        </View>

                        {/* Body */}
                        <TextInput
                            style={styles.bodyInput}
                            value={body}
                            onChangeText={setBody}
                            placeholder="Compose email"
                            placeholderTextColor={theme.colors.textMuted}
                            multiline
                            textAlignVertical="top"
                        />
                    </ScrollView>

                    {/* Toolbar */}
                    <View style={styles.toolbar}>
                        <TouchableOpacity
                            style={[styles.sendBtn, sending && styles.sendBtnDisabled]}
                            onPress={handleSend}
                            disabled={sending}
                        >
                            {sending
                                ? <ActivityIndicator color="#fff" size="small" />
                                : (
                                    <View style={styles.sendBtnContent}>
                                        <Text style={styles.sendBtnText}>Send</Text>
                                        <Send size={16} color="#fff" style={{ marginLeft: 6 }} />
                                    </View>
                                )
                            }
                        </TouchableOpacity>
                        <View style={styles.toolbarRight}>
                            <TouchableOpacity style={styles.iconBtn}>
                                <Paperclip size={20} color={theme.colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)',
    },
    overlayDesktop: {
        backgroundColor: 'transparent',
        alignItems: 'flex-end',
        paddingRight: 24, paddingBottom: 0,
    },
    sheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 16, borderTopRightRadius: 16,
        maxHeight: '90%', minHeight: 420,
        shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 20, elevation: 10,
    },
    sheetDesktop: {
        width: 500, height: 520,
        borderTopLeftRadius: 12, borderTopRightRadius: 12,
        shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 24, elevation: 12,
        borderWidth: 1, borderColor: '#E0E0E0',
    },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 12,
        backgroundColor: '#F2F6FC', borderTopLeftRadius: 12, borderTopRightRadius: 12,
        borderBottomWidth: 1, borderBottomColor: '#E0E0E0',
    },
    title: { fontSize: 14, fontWeight: '600', color: '#1F1F1F' },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    iconBtn: { padding: 4 },
    body: { flex: 1 },
    fieldRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 8,
        borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.border,
    },
    fieldLabel: {
        fontSize: 14, color: theme.colors.textMuted, width: 32, marginRight: 8,
    },
    fieldInput: { flex: 1, fontSize: 14, color: theme.colors.textPrimary, paddingVertical: 4 },
    subjectInput: { paddingLeft: 0 },
    bodyInput: {
        paddingHorizontal: 16, paddingVertical: 12,
        fontSize: 14, color: theme.colors.textPrimary, minHeight: 160,
    },
    toolbar: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 10,
        borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.border,
    },
    sendBtn: {
        backgroundColor: theme.colors.unreadDot,
        borderRadius: theme.radius.full, paddingVertical: 8, paddingHorizontal: 20,
    },
    sendBtnDisabled: { opacity: 0.6 },
    sendBtnContent: { flexDirection: 'row', alignItems: 'center' },
    sendBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
    toolbarRight: { flexDirection: 'row', gap: 16 },
});
