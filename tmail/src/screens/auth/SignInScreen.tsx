import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ActivityIndicator, KeyboardAvoidingView,
    Platform, ScrollView, Alert, Image, Linking
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { theme } from '../../theme';
import { useAuthStore } from '../../store/authStore';

export const SignInScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [focusedInput, setFocusedInput] = useState<'email' | 'password' | null>(null);

    const { signIn, isLoading, error, clearError } = useAuthStore();

    const handleSignIn = async () => {
        if (!email.trim() || !password) {
            Alert.alert('Missing fields', 'Please enter your email and password.');
            return;
        }
        clearError();
        await signIn(email.trim().toLowerCase(), password);
    };

    const handleBackToSearch = () => {
        if (Platform.OS === 'web') {
            window.location.href = 'http://localhost:3000';
        } else {
            Linking.openURL('http://localhost:3000');
        }
    };

    return (
        <View style={styles.wrapper}>
            <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

                    <View style={styles.formContainer}>

                        {/* Nicely Designed Back Button inside the form flow */}
                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={handleBackToSearch}
                            activeOpacity={0.7}
                        >
                            <ArrowLeft size={16} color="#444746" />
                            <Text style={styles.backBtnText}>Tide Search</Text>
                        </TouchableOpacity>

                        <View style={styles.logoArea}>
                            <Image
                                source={require('../../../assets/tide-logo.png')}
                                style={styles.logoImage}
                                resizeMode="contain"
                            />
                            <Text style={styles.appName}>Sign in</Text>
                            <Text style={styles.tagline}>Access your Tmail account to continue to Tide</Text>
                        </View>

                        {error ? (
                            <View style={styles.errorBox}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Email or Tmail address</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    focusedInput === 'email' && styles.inputFocused
                                ]}
                                placeholder="Enter your email"
                                placeholderTextColor={theme.colors.textMuted}
                                value={email}
                                onChangeText={setEmail}
                                onFocus={() => setFocusedInput('email')}
                                onBlur={() => setFocusedInput(null)}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                autoCorrect={false}
                            />

                            <Text style={[styles.label, { marginTop: 24 }]}>Password</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    focusedInput === 'password' && styles.inputFocused
                                ]}
                                placeholder="Enter your password"
                                placeholderTextColor={theme.colors.textMuted}
                                value={password}
                                onChangeText={setPassword}
                                onFocus={() => setFocusedInput('password')}
                                onBlur={() => setFocusedInput(null)}
                                secureTextEntry
                            />

                            <TouchableOpacity style={styles.forgotBtn}>
                                <Text style={styles.linkText}>Forgot password?</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={styles.ghostBtn}
                                onPress={() => navigation.navigate('SignUp')}
                            >
                                <Text style={styles.linkText}>Create account</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.primaryBtn, isLoading && styles.disabledBtn]}
                                onPress={handleSignIn}
                                disabled={isLoading}
                                activeOpacity={0.8}
                            >
                                {isLoading
                                    ? <ActivityIndicator color="#fff" size="small" />
                                    : <Text style={styles.primaryBtnText}>Sign In</Text>
                                }
                            </TouchableOpacity>
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

    container: {
        flexGrow: 1, alignItems: 'center', paddingTop: '8%', paddingBottom: 60, paddingHorizontal: 20,
    },

    formContainer: {
        width: '100%', maxWidth: 460,
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
        paddingVertical: 16, fontSize: 16, color: '#1F1F1F',
        backgroundColor: '#F8F9FA',
    },
    inputFocused: {
        borderColor: '#0b57d0', backgroundColor: '#FFFFFF',
    },

    forgotBtn: { marginTop: 16, alignSelf: 'flex-start' },

    actions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    ghostBtn: { paddingVertical: 12, paddingHorizontal: 8 },
    linkText: { color: '#0b57d0', fontSize: 15, fontWeight: '600' },

    primaryBtn: {
        backgroundColor: '#0b57d0', borderRadius: 8,
        paddingVertical: 14, paddingHorizontal: 32,
        minWidth: 120, alignItems: 'center',
        shadowColor: '#0b57d0', shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
    },
    primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
    disabledBtn: { opacity: 0.6 },
});
