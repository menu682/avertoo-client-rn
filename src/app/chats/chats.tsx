import { StyleSheet, Text, View } from 'react-native';

import Screen from '@/components/Screen';
import { useAppTheme } from '@/theme/ThemeProvider';

export default function ChatsScreen() {
    const { theme } = useAppTheme();

    return (
        <Screen>
            <View style={ styles.container }>
                <Text
                    style={ [
                        styles.logo,
                        { color: theme.colors.primary },
                    ] }
                >
                    Avertoo
                </Text>

                <Text
                    style={ [
                        styles.title,
                        { color: theme.colors.text },
                    ] }
                >
                    Чати
                </Text>

                <View
                    style={ [
                        styles.emptyState,
                        {
                            backgroundColor: theme.colors.surface,
                            borderColor: theme.colors.border,
                        },
                    ] }
                >
                    <Text
                        style={ [
                            styles.emptyTitle,
                            { color: theme.colors.text },
                        ] }
                    >
                        Поки що немає чатів
                    </Text>

                    <Text
                        style={ [
                            styles.description,
                            { color: theme.colors.textSecondary },
                        ] }
                    >
                        Тут буде список приватних чатів Avertoo.
                    </Text>
                </View>

                <Text
                    style={ [
                        styles.footer,
                        { color: theme.colors.textSecondary },
                    ] }
                >
                    Тимчасова заглушка
                </Text>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        paddingTop: 24,
    },
    logo: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 28,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 20,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 16,
        padding: 28,
        minHeight: 180,
        gap: 12,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    description: {
        fontSize: 14,
        lineHeight: 21,
        textAlign: 'center',
    },
    footer: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 24,
    },
} );