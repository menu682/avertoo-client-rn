import { router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '@/components/Screen';
import { useLocalization } from '@/localization/LocalizationProvider';
import { useAppTheme } from '@/theme/ThemeProvider';
import {
    clearRegistrationHandoff,
    getRegistrationHandoff,
} from '@/services/registrationHandoff';

export default function RegistrationSuccessScreen() {
    const { t } = useLocalization();
    const { theme } = useAppTheme();

    const [ credentials ] = useState( () => getRegistrationHandoff() );
    const [ passwordVisible, setPasswordVisible ] = useState( false );

    async function copyValue( value: string ) {
        if ( !value ) {
            return;
        }

        await Clipboard.setStringAsync( value );
        Alert.alert( t( 'registration.success.copied' ) );
    }

    function continueToChats() {
        clearRegistrationHandoff();
        router.replace( '/chats/chats' );
    }

    const muted = theme.colors.textSecondary;
    const text = theme.colors.text;
    const primary = theme.colors.primary;

    return (
        <Screen>
            <ScrollView
                contentContainerStyle={ styles.content }
                keyboardShouldPersistTaps="handled"
            >
                <View style={ styles.header }>
                    <Text style={ [ styles.logo, { color: primary } ] }>
                        Avertoo
                    </Text>

                    <Text style={ [ styles.title, { color: text } ] }>
                        { t( 'registration.success.title' ) }
                    </Text>

                    <Text style={ [ styles.description, { color: muted } ] }>
                        { t( 'registration.success.description' ) }
                    </Text>
                </View>

                <View
                    style={ [
                        styles.warning,
                        {
                            backgroundColor: theme.colors.inputBackground,
                            borderColor: theme.colors.border,
                        },
                    ] }
                >
                    <Text style={ [ styles.warningTitle, { color: text } ] }>
                        { t( 'registration.success.warningTitle' ) }
                    </Text>

                    <Text style={ [ styles.warningText, { color: muted } ] }>
                        { t( 'registration.success.warning' ) }
                    </Text>
                </View>

                <View style={ styles.fields }>
                    <Text style={ [ styles.label, { color: text } ] }>
                        { t( 'auth.userId' ) }
                    </Text>

                    <View
                        style={ [
                            styles.valueBox,
                            {
                                backgroundColor: theme.colors.inputBackground,
                                borderColor: theme.colors.border,
                            },
                        ] }
                    >
                        <Text selectable style={ [ styles.value, { color: text } ] }>
                            { credentials?.userId ||
                                t( 'registration.success.idUnavailable' ) }
                        </Text>

                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={ t( 'registration.success.copy' ) }
                            onPress={ () => void copyValue( credentials?.userId ?? '' ) }
                            disabled={ !credentials?.userId }
                            style={ styles.iconButton }
                        >
                            <Ionicons
                                name="copy-outline"
                                size={ 22 }
                                color={ primary }
                            />
                        </Pressable>
                    </View>

                    <Text style={ [ styles.label, { color: text } ] }>
                        { t( 'auth.password' ) }
                    </Text>

                    <View
                        style={ [
                            styles.valueBox,
                            {
                                backgroundColor: theme.colors.inputBackground,
                                borderColor: theme.colors.border,
                            },
                        ] }
                    >
                        <Text
                            selectable
                            style={ [ styles.value, { color: text } ] }
                        >
                            { passwordVisible
                                ? credentials?.password ?? ''
                                : '••••••••••••' }
                        </Text>

                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={
                                passwordVisible
                                    ? t( 'auth.password.hide' )
                                    : t( 'auth.password.show' )
                            }
                            onPress={ () => setPasswordVisible( ( visible ) => !visible ) }
                            style={ styles.iconButton }
                        >
                            <Ionicons
                                name={ passwordVisible ? 'eye-off-outline' : 'eye-outline' }
                                size={ 22 }
                                color={ primary }
                            />
                        </Pressable>

                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={ t( 'registration.success.copy' ) }
                            onPress={ () => void copyValue( credentials?.password ?? '' ) }
                            disabled={ !credentials?.password }
                            style={ styles.iconButton }
                        >
                            <Ionicons
                                name="copy-outline"
                                size={ 22 }
                                color={ primary }
                            />
                        </Pressable>
                    </View>
                </View>

                <Pressable
                    accessibilityRole="button"
                    onPress={ continueToChats }
                    style={ ( { pressed } ) => [
                        styles.button,
                        {
                            backgroundColor: primary,
                            opacity: pressed ? 0.85 : 1,
                        },
                    ] }
                >
                    <Text
                        style={ [
                            styles.buttonText,
                            { color: theme.colors.onPrimary },
                        ] }
                    >
                        { t( 'common.continue' ) }
                    </Text>
                </Pressable>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create( {
    content: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 32,
        gap: 24,
    },
    header: {
        alignItems: 'center',
        gap: 10,
    },
    logo: {
        fontSize: 34,
        fontWeight: '700',
        letterSpacing: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
    },
    description: {
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
    },
    warning: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        gap: 8,
    },
    warningTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    warningText: {
        fontSize: 14,
        lineHeight: 21,
    },
    fields: {
        gap: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 4,
    },
    valueBox: {
        minHeight: 54,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    value: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    iconButton: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    action: {
        fontSize: 13,
        fontWeight: '600',
    },
    button: {
        minHeight: 50,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
} );