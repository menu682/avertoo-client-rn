import { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import Screen from '@/components/Screen';
import PinIndicator from '@/components/pin/PinIndicator';
import PinKeypad from '@/components/pin/PinKeypad';
import { useLocalization } from '@/localization/LocalizationProvider';
import type { TranslationKey } from '@/localization/translations';
import { useAppTheme } from '@/theme/ThemeProvider';

type PinEntryProps = {
    titleKey: TranslationKey;
    descriptionKey: TranslationKey;
    onComplete: (
        pin: string,
    ) => Promise<TranslationKey | null | void> | TranslationKey | null | void;
};

const PIN_LENGTH = 4;

export default function PinEntry( {
                                      titleKey,
                                      descriptionKey,
                                      onComplete,
                                  }: PinEntryProps ) {
    const { t } = useLocalization();
    const { theme } = useAppTheme();

    const [ pin, setPin ] = useState( '' );
    const [ errorKey, setErrorKey ] = useState<TranslationKey | null>( null );
    const [ busy, setBusy ] = useState( false );

    async function submitPin( nextPin: string ) {
        setBusy( true );
        setErrorKey( null );

        try {
            const error = await onComplete( nextPin );

            if ( error ) {
                setErrorKey( error );
                setPin( '' );
            }
        } catch {
            setErrorKey( 'pin.error.storage' );
            setPin( '' );
        } finally {
            setBusy( false );
        }
    }

    function handleDigit( digit: string ) {
        if ( busy || pin.length >= PIN_LENGTH ) {
            return;
        }

        const nextPin = pin + digit;
        setPin( nextPin );
        setErrorKey( null );

        if ( nextPin.length === PIN_LENGTH ) {
            void submitPin( nextPin );
        }
    }

    function handleBackspace() {
        if ( busy ) {
            return;
        }

        setPin( ( current ) => current.slice( 0, -1 ) );
        setErrorKey( null );
    }

    return (
        <Screen>
            <View style={ styles.container }>
                <View style={ styles.heading }>
                    <Text style={ [ styles.title, { color: theme.colors.text } ] }>
                        { t( titleKey ) }
                    </Text>

                    <Text
                        style={ [
                            styles.description,
                            { color: theme.colors.textSecondary },
                        ] }
                    >
                        { t( descriptionKey ) }
                    </Text>
                </View>

                <View style={ styles.inputArea }>
                    <PinIndicator length={ pin.length }/>

                    <View style={ styles.errorContainer }>
                        { errorKey ? (
                            <Text
                                accessibilityRole="alert"
                                style={ [ styles.error, { color: theme.colors.danger } ] }
                            >
                                { t( errorKey ) }
                            </Text>
                        ) : null }
                    </View>
                </View>

                <View style={ styles.keypadArea }>
                    <PinKeypad
                        onDigit={ handleDigit }
                        onBackspace={ handleBackspace }
                        backspaceLabel={ t( 'pin.keypad.backspace' ) }
                        disabled={ busy }
                    />
                </View>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 24,
    },
    heading: {
        alignItems: 'center',
        gap: 12,
        marginTop: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 23,
    },
    inputArea: {
        alignItems: 'center',
        gap: 16,
    },
    errorContainer: {
        minHeight: 42,
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    error: {
        fontSize: 14,
        textAlign: 'center',
    },
    keypadArea: {
        paddingBottom: 12,
    },
} );