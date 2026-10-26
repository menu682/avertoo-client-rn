import { Pressable, Text, View, StyleSheet } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

type PinKeypadProps = {
    onDigit: ( digit: string ) => void;
    onBackspace: () => void;
    backspaceLabel: string;
    disabled?: boolean;
};

const ROWS = [
    [ '1', '2', '3' ],
    [ '4', '5', '6' ],
    [ '7', '8', '9' ],
    [ '', '0', 'backspace' ],
] as const;

export default function PinKeypad( {
                                       onDigit,
                                       onBackspace,
                                       backspaceLabel,
                                       disabled = false,
                                   }: PinKeypadProps ) {
    const { theme } = useAppTheme();

    return (
        <View style={ styles.container }>
            { ROWS.map( ( row, rowIndex ) => (
                <View key={ rowIndex } style={ styles.row }>
                    { row.map( ( key, keyIndex ) => {
                        if ( key === '' ) {
                            return <View key={ `empty-${ keyIndex }` } style={ styles.key }/>;
                        }

                        const isBackspace = key === 'backspace';

                        return (
                            <Pressable
                                key={ key }
                                accessibilityRole="button"
                                accessibilityLabel={ isBackspace ? backspaceLabel : key }
                                disabled={ disabled }
                                onPress={ () => {
                                    if ( isBackspace ) {
                                        onBackspace();
                                    } else {
                                        onDigit( key );
                                    }
                                } }
                                style={ ( { pressed } ) => [
                                    styles.key,
                                    {
                                        backgroundColor: theme.colors.surfaceSecondary,
                                        opacity: disabled ? 0.5 : pressed ? 0.65 : 1,
                                    },
                                ] }
                            >
                                <Text
                                    style={ [
                                        styles.keyText,
                                        { color: theme.colors.text },
                                    ] }
                                >
                                    { isBackspace ? '⌫' : key }
                                </Text>
                            </Pressable>
                        );
                    } ) }
                </View>
            ) ) }
        </View>
    );
}

const styles = StyleSheet.create( {
    container: {
        width: '100%',
        maxWidth: 340,
        alignSelf: 'center',
        gap: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
    },
    key: {
        flex: 1,
        height: 62,
        maxWidth: 100,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    keyText: {
        fontSize: 25,
        fontWeight: '500',
    },
} );