import { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import ChatCard, { type ChatCardData } from '@/components/chats/ChatCard';
import PyramidIndicator from '@/components/PyramidIndicator';
import Screen from '@/components/Screen';
import { getUserIdFromAccessToken } from '@/services/authService';
import {
    getForegroundConnectionState,
    startForegroundConnection,
    subscribeForegroundConnection,
    type ForegroundConnectionState,
} from '@/services/foregroundSocketService';
import { getAccessToken } from '@/storage/authStorage';
import { useAppTheme } from '@/theme/ThemeProvider';
import { useLocalization } from '@/localization/LocalizationProvider';

const DEMO_CHATS: ChatCardData[] = [
    {
        id: 'demo-active',
        peerId: '2847610395',
        name: 'Олена',
        status: 'active',
        lastMessageAt: '2026-10-27T10:42:00.000Z',
    },
    {
        id: 'demo-pending',
        peerId: '7391052846',
        status: 'pending',
    },
];

const CONNECTION_COLORS: Record<ForegroundConnectionState, string> = {
    disconnected: '#ef4444',
    connecting: '#facc15',
    connected: '#22c55e',
};

export default function ChatsScreen() {
    const { theme } = useAppTheme();
    const { t } = useLocalization();
    const [ userId, setUserId ] = useState<string | null>( null );
    const [ connection, setConnection ] = useState( getForegroundConnectionState );
    const [ chats, setChats ] = useState( DEMO_CHATS );
    const [ selectedChat, setSelectedChat ] = useState<ChatCardData | null>( null );

    useEffect( () => {
        const unsubscribe = subscribeForegroundConnection( setConnection );
        void startForegroundConnection();

        let active = true;
        void getAccessToken().then( ( token ) => {
            if ( active ) {
                setUserId( token ? getUserIdFromAccessToken( token ) : null );
            }
        } ).catch( () => {
            if ( active ) setUserId( null );
        } );

        return () => {
            active = false;
            unsubscribe();
            // The process-wide socket intentionally stays connected across routes.
        };
    }, [] );

    function requestNewChat() {
        Alert.alert( t( 'chats.newChat' ), t( 'chats.newChatLater' ) );
    }

    function deleteSelectedChat() {
        if ( selectedChat ) {
            setChats( ( current ) => current.filter( ( chat ) => chat.id !== selectedChat.id ) );
            setSelectedChat( null );
        }
    }

    const connectionLabel = t( `chats.connection.${ connection }` );

    return (
        <Screen>
            <View style={ styles.container }>
                <View
                    style={ [
                        styles.topBar,
                        {
                            backgroundColor: theme.colors.background,
                            shadowColor: CONNECTION_COLORS[ connection ],
                            borderBottomColor: theme.isDark
                                ? 'rgba(255,255,255,0.18)'
                                : 'rgba(0,0,0,0.12)',
                        },
                    ] }
                >
                    <View style={ styles.userBlock }>
                        <Text style={ [ styles.userId, { color: theme.colors.text } ] }>
                            { userId ?? '—' }
                        </Text>
                    </View>
                    <View
                        accessibilityRole="image"
                        accessibilityLabel={ connectionLabel }
                        style={ styles.connection }
                    >
                        <PyramidIndicator
                            color={ CONNECTION_COLORS[ connection ] }
                            size={ 42 }
                            label={ connectionLabel }
                        />
                    </View>
                </View>

                <FlatList
                    style={ styles.list }
                    data={ chats }
                    keyExtractor={ ( chat ) => chat.id }
                    renderItem={ ( { item } ) => (
                        <ChatCard chat={ item } onLongPress={ setSelectedChat }/>
                    ) }
                    contentContainerStyle={ styles.listContent }
                    ItemSeparatorComponent={ () => <View style={ styles.separator }/> }
                    showsVerticalScrollIndicator={ false }
                />

                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={ t( 'chats.newChat' ) }
                    onPress={ requestNewChat }
                    style={ ( { pressed } ) => [
                        styles.fab,
                        {
                            backgroundColor: theme.colors.primary,
                            opacity: pressed ? 0.82 : 1,
                        },
                    ] }
                >
                    <MaterialCommunityIcons name="fountain-pen" size={ 27 } color={ theme.colors.onPrimary }/>
                </Pressable>
            </View>

            <Modal
                visible={ selectedChat !== null }
                transparent
                animationType="fade"
                onRequestClose={ () => setSelectedChat( null ) }
            >
                <View style={ styles.modalBackdrop }>
                    <View style={ [ styles.dialog, { backgroundColor: theme.colors.surface } ] }>
                        <View style={ styles.warningIcon }>
                            <Ionicons name="warning-outline" size={ 28 } color={ theme.colors.danger }/>
                        </View>
                        <Text style={ [ styles.dialogTitle, { color: theme.colors.text } ] }>
                            { t( 'chats.deleteTitle' ) }
                        </Text>
                        <Text style={ [ styles.dialogText, { color: theme.colors.textSecondary } ] }>
                            { t( 'chats.deleteWarning' ) }
                        </Text>
                        <View style={ styles.dialogActions }>
                            <Pressable
                                onPress={ () => setSelectedChat( null ) }
                                style={ [ styles.actionButton, { backgroundColor: theme.colors.surfaceSecondary } ] }
                            >
                                <Text style={ [ styles.actionText, { color: theme.colors.text } ] }>
                                    { t( 'common.cancel' ) }
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={ deleteSelectedChat }
                                style={ [ styles.actionButton, { backgroundColor: theme.colors.danger } ] }
                            >
                                <Text style={ [ styles.actionText, { color: '#fff' } ] }>
                                    { t( 'chats.delete' ) }
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </Screen>
    );
}

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        paddingTop: 12,
    },
    topBar: {
        minHeight: 54,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        marginHorizontal: -16,
        paddingHorizontal: 30,
        paddingVertical: 8,
        flexShrink: 0,
        zIndex: 2,
        borderBottomWidth: StyleSheet.hairlineWidth,
        shadowOpacity: 0.22,
        shadowRadius: 9,
        shadowOffset: { width: 0, height: 7 },
        elevation: 8,
    },
    userBlock: {
        gap: 2,
    },
    userId: {
        fontSize: 16,
        fontWeight: '700',
    },
    connection: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingBottom: 100,
    },
    separator: {
        height: 10,
    },
    fab: {
        position: 'absolute',
        right: 8,
        bottom: 24,
        width: 58,
        height: 58,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    modalBackdrop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: 'rgba(0,0,0,0.56)',
    },
    dialog: {
        width: '100%',
        maxWidth: 420,
        borderRadius: 22,
        padding: 22,
        alignItems: 'center',
        gap: 14,
    },
    warningIcon: {
        width: 54,
        height: 54,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(239,68,68,0.12)',
    },
    dialogTitle: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
    },
    dialogText: {
        fontSize: 14,
        lineHeight: 21,
        textAlign: 'center',
    },
    dialogActions: {
        width: '100%',
        flexDirection: 'row',
        gap: 10,
        marginTop: 6,
    },
    actionButton: {
        flex: 1,
        minHeight: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionText: {
        fontSize: 15,
        fontWeight: '600',
    },
} );
