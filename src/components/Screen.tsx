import type { ReactNode } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenProps = {
    children: ReactNode;
};

export default function Screen( { children }: ScreenProps ) {
    return (
        <SafeAreaView
            style={ styles.safeArea }
            edges={ [ 'top', 'right', 'bottom', 'left' ] }
        >
            <KeyboardAvoidingView
                style={ styles.keyboard }
                behavior={ Platform.OS === 'ios' ? 'padding' : 'height' }
            >
                <View style={ styles.content }>
                    { children }
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create( {
    safeArea: {
        flex: 1,
    },
    keyboard: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
} );