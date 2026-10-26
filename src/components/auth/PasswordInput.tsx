import { useState } from 'react';
import {
    Pressable,
    StyleSheet,
    TextInput,
    View,
    type TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useLocalization } from '@/localization/LocalizationProvider';
import { useAppTheme } from '@/theme/ThemeProvider';

type PasswordInputProps = Omit<
    TextInputProps,
    'secureTextEntry' | 'accessibilityLabel'
> & {
    label?: string;
};

export default function PasswordInput( {
                                           label,
                                           style,
                                           ...inputProps
                                       }: PasswordInputProps ) {
    const [ passwordVisible, setPasswordVisible ] = useState( false );

    const { theme } = useAppTheme();
    const { t } = useLocalization();

    const eyeLabel = passwordVisible
        ? t( 'auth.password.hide' )
        : t( 'auth.password.show' );

    return (
        <View
            style={ [
                styles.container,
                {
                    backgroundColor: theme.colors.inputBackground,
                    borderColor: theme.colors.border,
                },
            ] }
        >
            <TextInput
                { ...inputProps }
                style={ [
                    styles.input,
                    {
                        color: theme.colors.text,
                    },
                    style,
                ] }
                placeholderTextColor={ theme.colors.placeholder }
                secureTextEntry={ !passwordVisible }
                accessibilityLabel={ label }
                autoCapitalize="none"
                autoCorrect={ false }
            />

            <Pressable
                onPress={ () =>
                    setPasswordVisible( ( visible ) => !visible )
                }
                accessibilityRole="button"
                accessibilityLabel={ eyeLabel }
                accessibilityHint={ eyeLabel }
                hitSlop={ 10 }
                style={ styles.toggle }
            >
                <Ionicons
                    name={ passwordVisible ? 'eye-off-outline' : 'eye-outline' }
                    size={ 23 }
                    color={ theme.colors.textSecondary }
                />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create( {
    container: {
        minHeight: 52,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
    },
    input: {
        flex: 1,
        minWidth: 0,
        paddingHorizontal: 14,
        paddingVertical: 14,
        fontSize: 16,
    },
    toggle: {
        width: 48,
        minHeight: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
} );