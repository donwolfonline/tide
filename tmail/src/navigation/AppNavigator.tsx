import React, { useEffect, useState } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, createNavigationContainerRef, DrawerActions } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, useWindowDimensions, Platform } from 'react-native';
import { Inbox, Send, Star, Trash2, FileEdit, LogOut, PenSquare, Menu } from 'lucide-react-native';

import { InboxScreen } from '../screens/InboxScreen';
import { ThreadScreen } from '../screens/ThreadScreen';
import { ComposeModal } from '../components/ComposeModal';
import { SignInScreen } from '../screens/auth/SignInScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { CreateAccountScreen } from '../screens/auth/CreateAccountScreen';
import { AuthBridgeScreen } from '../screens/AuthBridgeScreen';
import { useAuthStore } from '../store/authStore';
import { useEmailStore } from '../store/emailStore';
import { theme, initials, avatarColor } from '../theme';

const Drawer = createDrawerNavigator();
const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();

export const navigationRef = createNavigationContainerRef<any>();

const linking = {
    prefixes: ['http://localhost:8081', 'exp://'],
    config: {
        screens: {
            SignIn: 'SignIn',
            SignUp: 'SignUp',
            CreateAccount: 'CreateAccount',
            MainDrawer: 'Main',
            Thread: 'Thread/:threadId',
        },
    },
};

// Auth flow navigator
const AuthNavigator = () => (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="SignIn" component={SignInScreen} />
        <AuthStack.Screen name="SignUp" component={SignUpScreen} />
        <AuthStack.Screen name="CreateAccount" component={CreateAccountScreen} />
    </AuthStack.Navigator>
);

const HoverableDockItem = ({ item, isActive, isExpanded, onPress }: any) => {
    const [isHovered, setIsHovered] = useState(false);
    const Icon = item.icon;

    return (
        <TouchableOpacity
            style={[
                styles.dockItem,
                isActive && styles.dockItemActive,
                isHovered && styles.dockItemHover,
                isExpanded && styles.dockItemExpanded
            ] as any}
            onPress={onPress}
            {...({
                onMouseEnter: () => setIsHovered(true),
                onMouseLeave: () => setIsHovered(false),
            } as any)}
            activeOpacity={0.7}
        >
            <Icon size={22} color={isActive ? '#fff' : '#444746'} />
            {isExpanded && (
                <Text style={[styles.dockLabel, isActive && styles.dockLabelActive]}>
                    {item.label}
                </Text>
            )}
            {isActive && !isExpanded && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
    );
};

const FloatingDock = ({ navigation }: any) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const currentFolder = useEmailStore((s) => s.currentFolder);
    const setFolder = useEmailStore((s) => s.setFolder);
    const setComposeVisible = useEmailStore((s) => s.setComposeVisible);
    const currentUser = useAuthStore((s) => s.currentUser);
    const { width } = useWindowDimensions();
    const isLargeScreen = width >= 1000;

    if (!isLargeScreen) return null;

    const items = [
        { id: 'inbox', icon: Inbox, label: 'Inbox' },
        { id: 'starred', icon: Star, label: 'Starred' },
        { id: 'sent', icon: Send, label: 'Sent' },
        { id: 'drafts', icon: FileEdit, label: 'Drafts' },
        { id: 'trash', icon: Trash2, label: 'Trash' },
    ];

    const userInitials = currentUser ? initials(currentUser.displayName) : '?';
    const userColor = currentUser ? avatarColor(currentUser.displayName) : '#999';

    return (
        <View style={styles.dockContainer}>
            {/* Menu Island */}
            <TouchableOpacity
                style={styles.menuIsland}
                onPress={() => setIsExpanded(!isExpanded)}
                activeOpacity={0.7}
            >
                <Menu size={22} color="#444746" />
            </TouchableOpacity>

            <View style={[styles.dock, isExpanded && styles.dockExpanded]}>
                {isExpanded && (
                    <View style={styles.expandedProfile}>
                        <View style={[styles.avatar, { backgroundColor: userColor }]}>
                            <Text style={styles.avatarText}>{userInitials}</Text>
                        </View>
                        <View style={styles.profileText}>
                            <Text style={styles.userName} numberOfLines={1}>{currentUser?.displayName}</Text>
                            <Text style={styles.userEmail} numberOfLines={1}>{currentUser?.email}</Text>
                        </View>
                    </View>
                )}

                {/* Compose Prism */}
                <TouchableOpacity
                    style={[styles.composePrism, isExpanded && styles.composePrismExpanded]}
                    onPress={() => setComposeVisible(true)}
                    activeOpacity={0.8}
                >
                    <PenSquare size={24} color="#fff" />
                    {isExpanded && <Text style={styles.composeLabel}>Compose</Text>}
                </TouchableOpacity>

                <View style={styles.dockDivider} />

                {items.map((item) => (
                    <HoverableDockItem
                        key={item.id}
                        item={item}
                        isActive={currentFolder === item.id}
                        isExpanded={isExpanded}
                        onPress={() => setFolder(item.id)}
                    />
                ))}

                {isExpanded && (
                    <TouchableOpacity
                        style={styles.signOutDock}
                        onPress={() => useAuthStore.getState().signOut()}
                    >
                        <LogOut size={20} color="#444746" />
                        <Text style={styles.signOutTextDock}>Sign out</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

// Custom drawer with account info + sign-out
const CustomDrawerContent = (props: any) => {
    const currentUser = useAuthStore((s) => s.currentUser);
    const signOut = useAuthStore((s) => s.signOut);
    const setFolder = useEmailStore((s) => s.setFolder);
    const setComposeVisible = useEmailStore((s) => s.setComposeVisible);
    const isDrawerExpanded = useEmailStore((s) => s.isDrawerExpanded);

    const userColor = currentUser ? avatarColor(currentUser.displayName) : '#999';
    const userInitials = currentUser ? initials(currentUser.displayName) : '?';

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, paddingHorizontal: isDrawerExpanded ? 0 : 4 }}>
            {/* Account header */}
            <View style={[styles.accountHeader, !isDrawerExpanded && styles.accountHeaderCollapsed]}>
                <View style={[styles.accountAvatar, { backgroundColor: userColor }, !isDrawerExpanded && styles.accountAvatarCollapsed]}>
                    <Text style={styles.accountAvatarText}>{userInitials}</Text>
                </View>
                {isDrawerExpanded && (
                    <>
                        <Text style={styles.accountName} numberOfLines={1}>{currentUser?.displayName}</Text>
                        <Text style={styles.accountEmail} numberOfLines={1}>{currentUser?.email}</Text>
                    </>
                )}
            </View>

            {/* Folder items */}
            <View style={{ flex: 1, overflow: 'hidden' }}>
                <DrawerItemList {...props} />
            </View>

            {/* Sign out */}
            <TouchableOpacity
                style={[styles.signOutBtn, !isDrawerExpanded && styles.signOutBtnCollapsed]}
                onPress={() => signOut()}
            >
                <LogOut size={20} color={theme.colors.textSecondary} />
                {isDrawerExpanded && <Text style={styles.signOutText}>Sign out</Text>}
            </TouchableOpacity>
        </DrawerContentScrollView>
    );
};

// Drawer with folders
const MainDrawer = ({ navigation }: any) => {
    const { width } = useWindowDimensions();
    const isLargeScreen = width >= 1000;

    if (isLargeScreen) {
        return (
            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#F6F8FC', gap: 12 }}>
                <FloatingDock navigation={navigation} />
                <View style={{ flex: 1, paddingRight: 20, paddingVertical: 20 }}>
                    <InboxScreen navigation={navigation} />
                </View>
            </View>
        );
    }

    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerType: 'front',
                drawerStyle: {
                    width: 280,
                    backgroundColor: '#F6F8FC',
                    borderRightWidth: 0,
                },
                overlayColor: 'rgba(0,0,0,0.5)',
                drawerActiveTintColor: '#0b57d0',
                drawerActiveBackgroundColor: '#D3E3FD',
                drawerInactiveTintColor: '#444746',
                drawerItemStyle: {
                    borderRadius: 24, marginBottom: 4, paddingHorizontal: 12,
                },
                drawerLabelStyle: {
                    fontSize: 14,
                    fontWeight: '600',
                    marginLeft: 0,
                },
            }}
        >
            <Drawer.Screen
                name="InboxDrawer"
                component={InboxScreen}
                options={{ title: 'Inbox', drawerIcon: ({ color, size }) => <Inbox color={color} size={size} /> }}
            />
            <Drawer.Screen
                name="StarredDrawer"
                component={InboxScreen}
                options={{ title: 'Starred', drawerIcon: ({ color, size }) => <Star color={color} size={size} /> }}
            />
            <Drawer.Screen
                name="SentDrawer"
                component={InboxScreen}
                options={{ title: 'Sent', drawerIcon: ({ color, size }) => <Send color={color} size={size} /> }}
            />
            <Drawer.Screen
                name="DraftsDrawer"
                component={InboxScreen}
                options={{ title: 'Drafts', drawerIcon: ({ color, size }) => <FileEdit color={color} size={size} /> }}
            />
            <Drawer.Screen
                name="TrashDrawer"
                component={InboxScreen}
                options={{ title: 'Trash', drawerIcon: ({ color, size }) => <Trash2 color={color} size={size} /> }}
            />
        </Drawer.Navigator>
    );
};

// Main app stack (drawer + thread)
const MainNavigator = () => (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
        <MainStack.Screen name="MainDrawer" component={MainDrawer} />
        <MainStack.Screen name="Thread" component={ThreadScreen as any} />
    </MainStack.Navigator>
);

// Root navigator — gates on auth
export const AppNavigator = () => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const isLoading = useAuthStore((s) => s.isLoading);
    const loadSession = useAuthStore((s) => s.loadSession);
    const isComposeVisible = useEmailStore((s) => s.isComposeVisible);
    const setComposeVisible = useEmailStore((s) => s.setComposeVisible);

    useEffect(() => { loadSession(); }, []);

    if (isLoading) {
        return (
            <View style={styles.loadingScreen}>
                <View style={styles.loadingLogo}>
                    <Text style={styles.loadingLogoText}>T</Text>
                </View>
                <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 20 }} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F6F8FC' }}>
            <NavigationContainer ref={navigationRef} linking={linking}>
                {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
            </NavigationContainer>

            {isAuthenticated && (
                <ComposeModal
                    visible={isComposeVisible}
                    onClose={() => setComposeVisible(false)}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    loadingScreen: {
        flex: 1, backgroundColor: theme.colors.surfaceAlt,
        justifyContent: 'center', alignItems: 'center',
    },
    loadingLogo: {
        width: 72, height: 72, borderRadius: 36,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center', alignItems: 'center',
    },
    loadingLogoText: { color: '#fff', fontSize: 40, fontWeight: '700' },

    accountHeader: {
        padding: 24, paddingBottom: 16,
        marginBottom: 8,
    },
    accountHeaderCollapsed: {
        alignItems: 'center',
        paddingHorizontal: 0,
        paddingTop: 16,
    },
    accountAvatar: {
        width: 48, height: 48, borderRadius: 24,
        justifyContent: 'center', alignItems: 'center', marginBottom: 12,
    },
    accountAvatarCollapsed: {
        marginBottom: 0,
    },
    accountAvatarText: { color: '#fff', fontSize: 20, fontWeight: '700' },
    accountName: { fontSize: 15, fontWeight: '600', color: theme.colors.textPrimary },
    accountEmail: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 2 },



    signOutBtn: {
        flexDirection: 'row', alignItems: 'center',
        margin: 16, marginTop: 'auto',
        padding: 12, borderRadius: 24,
    },
    signOutBtnCollapsed: {
        justifyContent: 'center', padding: 12, margin: 12,
    },
    signOutText: { fontSize: 14, color: theme.colors.textSecondary, fontWeight: '600', marginLeft: 16 },

    dockContainer: {
        paddingVertical: 20,
        paddingLeft: 20,
        paddingRight: 8,
        zIndex: 1000,
    },
    menuIsland: {
        width: 68,
        height: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        ...Platform.select({
            web: {
                backdropFilter: 'blur(25px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
            }
        })
    },
    dock: {
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        borderRadius: 40,
        padding: 8,
        width: 68,
        alignItems: 'center',
        transitionProperty: 'width',
        transitionDuration: '0.3s',
        ...Platform.select({
            web: {
                backdropFilter: 'blur(25px)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
            }
        })
    } as any,
    dockExpanded: {
        width: 240,
        alignItems: 'stretch',
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    expandedProfile: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        paddingHorizontal: 4,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    profileText: { marginLeft: 12, flex: 1 },
    userName: { fontSize: 14, fontWeight: '600', color: '#1f1f1f' },
    userEmail: { fontSize: 12, color: '#444746' },
    composePrism: {
        width: 52,
        height: 52,
        borderRadius: 20,
        backgroundColor: '#D93025',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        ...Platform.select({
            web: {
                boxShadow: '0 8px 20px rgba(217, 48, 37, 0.4)',
                transform: [{ rotate: '45deg' }],
            }
        })
    },
    composePrismExpanded: {
        width: '100%',
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        paddingHorizontal: 20,
        transform: [{ rotate: '0deg' }],
        justifyContent: 'flex-start',
    },
    composeLabel: {
        color: '#fff',
        fontWeight: '600',
        marginLeft: 15,
        fontSize: 14,
    },
    dockDivider: {
        width: 30,
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginVertical: 15,
        alignSelf: 'center',
    },
    dockItem: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        position: 'relative',
        transitionProperty: 'all',
        transitionDuration: '0.2s',
    } as any,
    dockItemHover: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        transform: [{ scale: 1.1 }],
    },
    dockItemExpanded: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    dockLabel: {
        marginLeft: 15,
        fontSize: 14,
        color: '#444746',
        fontWeight: '500',
    },
    dockLabelActive: {
        color: '#fff',
    },
    dockItemActive: {
        backgroundColor: '#0b57d0',
        ...Platform.select({
            web: {
                boxShadow: '0 6px 20px rgba(11, 87, 208, 0.3)',
            }
        })
    },
    signOutDock: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 'auto',
        paddingVertical: 15,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    signOutTextDock: {
        marginLeft: 15,
        fontSize: 14,
        color: '#444746',
        fontWeight: '500',
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 2,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#fff',
    },
});
