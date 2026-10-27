import { Pressable, StyleSheet, Text, View } from 'react-native';

import PyramidIndicator from '@/components/PyramidIndicator';
import { useAppTheme } from '@/theme/ThemeProvider';

export type ChatCardData = {
    id: string;
    peerId: string;
    name?: string;
    status: 'pending' | 'active';
    lastMessageAt?: string;
};

type ChatCardProps = {
    chat: ChatCardData;
    onLongPress: ( chat: ChatCardData ) => void;
};

export default function ChatCard( { chat, onLongPress }: ChatCardProps ) {
    const { theme } = useAppTheme();
    const isActive = chat.status === 'active';
    const subtitle = chat.lastMessageAt
        ? new Date( chat.lastMessageAt ).toLocaleString( 'uk-UA' )
        : null;

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityHint="Натисніть і утримуйте, щоб відкрити дії чату"
            onLongPress={ () => onLongPress( chat ) }
            delayLongPress={ 450 }
            style={ ( { pressed } ) => [
                styles.card,
                {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                    opacity: pressed ? 0.86 : 1,
                },
            ] }
        >
            <PyramidIndicator
                size={ 46 }
                color={ isActive ? '#47a7ff' : '#9ca3af' }
                label={ isActive ? 'Чат активний' : 'Чат очікує' }
            />
            <View style={ styles.textGroup }>
                <Text
                    numberOfLines={ 1 }
                    style={ [ styles.title, { color: theme.colors.text } ] }
                >
                    { chat.name || chat.peerId }
                </Text>
                { subtitle ? (
                    <Text
                        numberOfLines={ 1 }
                        style={ [ styles.subtitle, { color: theme.colors.textSecondary } ] }
                    >
                        { subtitle }
                    </Text>
                ) : null }
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create( {
    card: {
        minHeight: 78,
        borderRadius: 16,
        borderWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 12,
        gap: 12,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
    },
    textGroup: {
        flex: 1,
        gap: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 12,
    },
} );
