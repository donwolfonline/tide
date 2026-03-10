import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ActivityIndicator, KeyboardAvoidingView,
    Platform, ScrollView, Alert, Image
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { theme } from '../../theme';
import { useAuthStore } from '../../store/authStore';

export const CreateAccountScreen = ({ route, navigation }: any) => {
    const { firstName, lastName } = route.params;
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [focusedInput, setFocusedInput] = useState<'password' | 'confirm' | null>(null);

    const { signUp, isLoading, error, clearError } = useAuthStore();

    const tmailAddress = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@tmail.com`;

    const handleCreate = async () => {
        clearError();
        if (password.length < 8) {
            Alert.alert('Weak password', 'Password must be at least 8 characters.');
            return;
        }
        if (password !== confirm) {
            Alert.alert('Mismatch', 'Passwords do not match.');
            return;
        }
        const result = await signUp(firstName, lastName, tmailAddress, password);
        if (!result.success && result.error) {
            Alert.alert('Sign up failed', result.error);
        }
    };

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
                                onPress={() => navigation.goBack()}
                                activeOpacity={0.7}
                            >
                                <ArrowLeft size={16} color="#444746" />
                                <Text style={styles.backBtnText}>Back</Text>
                            </TouchableOpacity>

                            <View style={styles.logoArea}>
                                <Image
                                    source={require('../../../assets/tide-logo.png')}
                                    style={styles.logoImage}
                                    resizeMode="contain"
                                />
                                <Text style={styles.appName}>Choose your password</Text>
                                <Text style={styles.tagline}>For {tmailAddress}</Text>
                            </View>

                            {error ? (
                                <View style={styles.errorBox}>
                                    <Text style={styles.errorText}>{error}</Text>
                                </View>
                            ) : null}

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Create password</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        focusedInput === 'password' && styles.inputFocused
                                    ]}
                                    placeholder="Must be at least 8 characters"
                                    placeholderTextColor={theme.colors.textMuted}
                                    value={password}
                                    onChangeText={setPassword}
                                    onFocus={() => setFocusedInput('password')}
                                    onBlur={() => setFocusedInput(null)}
                                    secureTextEntry
                                />

                                <Text style={[styles.label, { marginTop: 24 }]}>Confirm password</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        focusedInput === 'confirm' && styles.inputFocused
                                    ]}
                                    placeholder="Type your password again"
                                    placeholderTextColor={theme.colors.textMuted}
                                    value={confirm}
                                    onChangeText={setConfirm}
                                    onFocus={() => setFocusedInput('confirm')}
                                    onBlur={() => setFocusedInput(null)}
                                    secureTextEntry
                                />

                                <Text style={styles.hint}>
                                    By creating a Tmail account, you agree to Tide's Terms of Service and Privacy Policy.
                                </Text>
                            </View>

                            <View style={styles.actions}>
                                <View style={styles.ghostBtn} /> {/* spacer placeholder if needed */}
                                <TouchableOpacity
                                    style={[styles.primaryBtn, isLoading && styles.disabledBtn]}
                                    onPress={handleCreate}
                                    disabled={isLoading}
                                    activeOpacity={0.8}
                                >
                                    {isLoading
                                        ? <ActivityIndicator color="#fff" size="small" />
                                        : <Text style={styles.primaryBtnText}>Create Account</Text>
                                    }
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
        maxWidth: 400, // Reduced for better proportions
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
    tagline: { fontSize: 18, color: '#0b57d0', fontWeight: '500' },

    errorBox: {
        backgroundColor: '#FCE8E6', padding: 16, borderRadius: 8, marginBottom: 24,
        borderLeftWidth: 4, borderLeftColor: '#D93025'
    },
    errorText: { color: '#B31412', fontSize: 14, fontWeight: '500' },

    formGroup: { marginBottom: 40 },
    label: { fontSize: 14, fontWeight: '600', color: '#1F1F1F', marginBottom: 8 },
    input: {
        borderWidth: 1.5, borderColor: '#DADCE0',
        borderRadius: 8, paddingHorizontal: 16,
        paddingVertical: 16, fontSize: 16, color: '#1F1F1F', backgroundColor: '#F8F9FA',
    },
    inputFocused: { borderColor: '#0b57d0', backgroundColor: '#FFFFFF' },

    hint: { fontSize: 14, color: '#444746', marginTop: 24, lineHeight: 22 },

    actions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    ghostBtn: { flex: 1 },
    primaryBtn: {
        backgroundColor: '#0b57d0', borderRadius: 8,
        paddingVertical: 14, paddingHorizontal: 32, minWidth: 120, alignItems: 'center',
        shadowColor: '#0b57d0', shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
    },
    primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
    disabledBtn: { opacity: 0.6 },
});
