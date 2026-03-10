import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ActivityIndicator, KeyboardAvoidingView,
    Platform, ScrollView, Alert, Image
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { theme } from '../../theme';
import { useAuthStore } from '../../store/authStore';

export const SignUpScreen = ({ navigation }: any) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [focusedInput, setFocusedInput] = useState<'first' | 'last' | null>(null);
    const { isLoading } = useAuthStore();

    const handleNext = () => {
        if (!firstName.trim() || !lastName.trim()) {
            Alert.alert('Required', 'Please enter your first and last name.');
            return;
        }
        navigation.navigate('CreateAccount', { firstName: firstName.trim(), lastName: lastName.trim() });
    };

    const previewEmail = firstName && lastName
        ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}@tmail.com`
        : null;

    return (
        <View style={styles.wrapper}>
            <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.formWrapper}>
                        <View style={styles.formContainer}>
                            <TouchableOpacity
                                style={styles.backBtn}
                                onPress={() => navigation.navigate('SignIn')}
                                activeOpacity={0.7}
                            >
                                <ArrowLeft size={16} color="#444746" />
                                <Text style={styles.backBtnText}>Back to Sign In</Text>
                            </TouchableOpacity>

                            <View style={styles.logoArea}>
                                <Image
                                    source={require('../../../assets/tide-logo.png')}
                                    style={styles.logoImage}
                                    resizeMode="contain"
                                />
                                <Text style={styles.appName}>Create a Tmail account</Text>
                                <Text style={styles.tagline}>Enter your name to get started</Text>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>First name</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        focusedInput === 'first' && styles.inputFocused
                                    ]}
                                    placeholder="Enter first name"
                                    placeholderTextColor={theme.colors.textMuted}
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    onFocus={() => setFocusedInput('first')}
                                    onBlur={() => setFocusedInput(null)}
                                    autoCapitalize="words"
                                />

                                <Text style={[styles.label, { marginTop: 24 }]}>Last name</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        focusedInput === 'last' && styles.inputFocused
                                    ]}
                                    placeholder="Enter last name"
                                    placeholderTextColor={theme.colors.textMuted}
                                    value={lastName}
                                    onChangeText={setLastName}
                                    onFocus={() => setFocusedInput('last')}
                                    onBlur={() => setFocusedInput(null)}
                                    autoCapitalize="words"
                                />
                            </View>

                            {previewEmail ? (
                                <View style={styles.previewBox}>
                                    <Text style={styles.previewLabel}>Your new Tmail address will be:</Text>
                                    <Text style={styles.previewEmail}>{previewEmail}</Text>
                                </View>
                            ) : (
                                <View style={styles.previewPlaceholder} />
                            )}

                            <View style={styles.actions}>
                                <TouchableOpacity style={styles.ghostBtn} onPress={() => navigation.navigate('SignIn')}>
                                    <Text style={styles.linkText}>Sign in instead</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.primaryBtn, isLoading && styles.disabledBtn]}
                                    onPress={handleNext}
                                    disabled={isLoading}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.primaryBtnText}>Next</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: '#FFFFFF' },
    flex: { flex: 1 },

    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    formWrapper: {
        width: '100%',
        alignItems: 'center',
    },
    formContainer: {
        width: '100%',
        maxWidth: 400, // Reduced from 460 for better proportions
    },

    backBtn: {
        flexDirection: 'row', alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#F8F9FA',
        paddingVertical: 8, paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1, borderColor: '#E0E0E0',
        marginBottom: 40,
    },
    backBtnText: { marginLeft: 6, fontSize: 13, fontWeight: '600', color: '#444746' },

    logoArea: { alignItems: 'flex-start', marginBottom: 40 },
    logoImage: { width: 120, height: 38, marginBottom: 24 },
    appName: { fontSize: 36, fontWeight: '600', color: '#1F1F1F', marginBottom: 12 },
    tagline: { fontSize: 16, color: '#444746', lineHeight: 24 },

    formGroup: { marginBottom: 32 },
    label: { fontSize: 14, fontWeight: '600', color: '#1F1F1F', marginBottom: 8 },
    input: {
        borderWidth: 1.5, borderColor: '#DADCE0',
        borderRadius: 8, paddingHorizontal: 16,
        paddingVertical: 16, fontSize: 16, color: '#1F1F1F', backgroundColor: '#F8F9FA',
    },
    inputFocused: { borderColor: '#0b57d0', backgroundColor: '#FFFFFF' },

    previewBox: {
        backgroundColor: '#F3F8FB', borderRadius: 8, padding: 20,
        borderLeftWidth: 4, borderLeftColor: '#0b57d0', marginBottom: 32
    },
    previewLabel: { fontSize: 14, color: '#444746', marginBottom: 6 },
    previewEmail: { fontSize: 18, fontWeight: '600', color: '#0b57d0' },
    previewPlaceholder: { height: 90, marginBottom: 32 },

    actions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    ghostBtn: { paddingVertical: 12, paddingHorizontal: 8 },
    linkText: { color: '#0b57d0', fontSize: 15, fontWeight: '600' },
    primaryBtn: {
        backgroundColor: '#0b57d0', borderRadius: 8,
        paddingVertical: 14, paddingHorizontal: 32, minWidth: 120, alignItems: 'center',
        shadowColor: '#0b57d0', shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
    },
    primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
    disabledBtn: { opacity: 0.6 },
});
