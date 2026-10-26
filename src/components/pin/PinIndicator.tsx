import { View, StyleSheet } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

type PinIndicatorProps = {
    length: number;
};

const PIN_LENGTH = 4;

export default function PinIndicator( { length }: PinIndicatorProps ) {
    const { theme } = useAppTheme();

    return (
        <View style={ styles.container } accessibilityLabel={ `${ length } з ${ PIN_LENGTH }` }>
            { Array.from( { length: PIN_LENGTH }, ( _, index ) => {
                const filled = index < length;

                return (
                    <View
                        key={ index }
                        style={ [
                            styles.square,
                            {
                                backgroundColor: filled
                                    ? theme.colors.primary
                                    : theme.colors.surfaceSecondary,
                                borderColor: filled
                                    ? theme.colors.primary
                                    : theme.colors.border,
                            },
                        ] }
                    />
                );
            } ) }
        </View>
    );
}

const styles = StyleSheet.create( {
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    square: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 1,
    },
} );