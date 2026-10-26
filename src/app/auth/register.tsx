import { Link, router } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import Captcha from '@/components/auth/Captcha';
import PasswordInput from '@/components/auth/PasswordInput';
import Screen from '@/components/Screen';
import { setRegistrationHandoff } from '@/services/registrationHandoff';
import { AuthError, register, getUserIdFromAccessToken } from '@/services/authService';
import { useLocalization } from '@/localization/LocalizationProvider';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { TranslationKey } from '@/localization/translations';
import { completeOnboarding } from '@/services/onboardingService';

const errorKeys: Record<string, TranslationKey> = {
    network: 'auth.error.network',
    timeout: 'auth.error.timeout',
    invalidResponse: 'auth.error.invalidResponse',
    storage: 'auth.error.storage',
    validation: 'auth.error.validation',
    unauthorized: 'auth.error.unauthorized',
    forbidden: 'auth.error.forbidden',
    conflict: 'auth.error.conflict',
    rateLimited: 'auth.error.rateLimited',
    server: 'auth.error.server',
    unknown: 'auth.error.unknown',
};

export default function RegisterScreen() {
    const { t } = useLocalization();
    const { theme } = useAppTheme();

    const [ userId, setUserId ] = useState( '' );
    const [ password, setPassword ] = useState( '' );
    const [ confirmPassword, setConfirmPassword ] = useState( '' );
    const [ captchaToken, setCaptchaToken ] = useState( '' );
    const [ errorKey, setErrorKey ] = useState<TranslationKey | null>( null );
    const [ loading, setLoading ] = useState( false );
    const [ captchaKey, setCaptchaKey ] = useState( 0 );

    async function handleRegister() {
        setErrorKey( null );

        const normalizedUserId = userId.trim();

        if (
            ( normalizedUserId !== '' &&
                !/^[1-9]\d{9}$/.test( normalizedUserId ) ) ||
            password.length < 8 ||
            password.length > 128 ||
            password !== confirmPassword
        ) {
            setErrorKey( 'auth.error.validation' );
            return;
        }

        if ( !captchaToken ) {
            setErrorKey( 'auth.error.forbidden' );
            return;
        }

        setLoading( true );

        try {
            const response = await register( {
                userId: normalizedUserId,
                password,
                captchaToken,
            } );

            const assignedUserId =
                getUserIdFromAccessToken( response.accessToken ) ??
                normalizedUserId;

            setRegistrationHandoff( {
                userId: assignedUserId,
                password,
            } );

            try {
                await completeOnboarding();
            } catch {
                // Реєстрація вже успішна.
            }

            router.replace( '/auth/registration-success' );
        } catch ( error ) {
            const code =
                error instanceof AuthError ? error.code : 'unknown';

            setErrorKey( errorKeys[ code ] ?? 'auth.error.unknown' );
            setCaptchaToken( '' );
            setCaptchaKey( ( current ) => current + 1 );
        } finally {
            setLoading( false );
        }
    }

    return (
        <Screen>
            <ScrollView
                contentContainerStyle={ styles.content }
                keyboardShouldPersistTaps="handled"
            >
                <View style={ styles.header }>
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
                        { t( 'registration.title' ) }
                    </Text>

                    <Text
                        style={ [
                            styles.description,
                            { color: theme.colors.textSecondary },
                        ] }
                    >
                        { t( 'registration.description' ) }
                    </Text>
                </View>

                <View style={ styles.form }>
                    <Text
                        style={ [
                            styles.label,
                            { color: theme.colors.text },
                        ] }
                    >
                        { t( 'auth.userId' ) }
                    </Text>

                    <TextInput
                        value={ userId }
                        onChangeText={ ( value ) => {
                            setUserId( value.replace( /\D/g, '' ).slice( 0, 10 ) );
                            setErrorKey( null );
                        } }
                        placeholder="1234567890"
                        placeholderTextColor={ theme.colors.placeholder }
                        keyboardType="number-pad"
                        maxLength={ 10 }
                        editable={ !loading }
                        accessibilityLabel={ t( 'auth.userId' ) }
                        style={ [
                            styles.input,
                            {
                                color: theme.colors.text,
                                backgroundColor: theme.colors.inputBackground,
                                borderColor: theme.colors.border,
                            },
                        ] }
                    />

                    <Text
                        style={ [
                            styles.hint,
                            { color: theme.colors.textSecondary },
                        ] }
                    >
                        { t( 'registration.userIdHint' ) }
                    </Text>

                    <PasswordInput
                        label={ t( 'auth.password' ) }
                        value={ password }
                        onChangeText={ ( value ) => {
                            setPassword( value );
                            setErrorKey( null );
                        } }
                        editable={ !loading }
                        autoCapitalize="none"
                        autoCorrect={ false }
                    />

                    <PasswordInput
                        label={ t( 'registration.confirmPassword' ) }
                        value={ confirmPassword }
                        onChangeText={ ( value ) => {
                            setConfirmPassword( value );
                            setErrorKey( null );
                        } }
                        editable={ !loading }
                        autoCapitalize="none"
                        autoCorrect={ false }
                    />

                    <Captcha
                        key={ captchaKey }
                        onToken={ setCaptchaToken }
                        onError={ () => setCaptchaToken( '' ) }
                    />

                    { errorKey && (
                        <Text
                            accessibilityRole="alert"
                            style={ [
                                styles.error,
                                { color: theme.colors.danger },
                            ] }
                        >
                            { t( errorKey ) }
                        </Text>
                    ) }

                    <Pressable
                        onPress={ () => void handleRegister() }
                        disabled={ loading }
                        accessibilityRole="button"
                        style={ ( { pressed } ) => [
                            styles.button,
                            {
                                backgroundColor: theme.colors.primary,
                                opacity: loading ? 0.6 : pressed ? 0.85 : 1,
                            },
                        ] }
                    >
                        { loading ? (
                            <ActivityIndicator color={ theme.colors.onPrimary }/>
                        ) : (
                            <Text
                                style={ [
                                    styles.buttonText,
                                    { color: theme.colors.onPrimary },
                                ] }
                            >
                                { t( 'registration.submit' ) }
                            </Text>
                        ) }
                    </Pressable>

                    <View style={ styles.footer }>
                        <Text style={ { color: theme.colors.textSecondary } }>
                            { t( 'registration.loginPrompt' ) }
                        </Text>

                        <Link href="/auth/login">
                            <Text
                                style={ [
                                    styles.link,
                                    { color: theme.colors.primary },
                                ] }
                            >
                                { t( 'registration.loginLink' ) }
                            </Text>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create( {
    content: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 32,
    },
    header: {
        alignItems: 'center',
        marginBottom: 28,
        gap: 8,
    },
    logo: {
        fontSize: 34,
        fontWeight: '700',
        letterSpacing: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
    },
    form: {
        gap: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: -8,
    },
    input: {
        minHeight: 50,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 14,
        fontSize: 16,
    },
    hint: {
        fontSize: 12,
        marginTop: -10,
    },
    error: {
        fontSize: 14,
        lineHeight: 20,
    },
    button: {
        minHeight: 50,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        marginTop: 4,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 8,
    },
    link: {
        fontSize: 14,
        fontWeight: '600',
    },
} );