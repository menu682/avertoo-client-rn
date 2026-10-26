import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { PinSetupProvider } from '@/features/pin/PinSetupContext';
import { LocalizationProvider } from '@/localization/LocalizationProvider';
import { ThemeProvider, useAppTheme } from '@/theme/ThemeProvider';

function AppNavigator() {
    const { theme } = useAppTheme();

    return (
        <>
            <StatusBar style={ theme.isDark ? 'light' : 'dark' }/>

            <Stack
                screenOptions={ {
                    headerShown: false,
                    contentStyle: {
                        backgroundColor: theme.colors.background,
                    },
                } }
            />
        </>
    );
}

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <LocalizationProvider>
                <ThemeProvider>
                    <PinSetupProvider>
                        <AppNavigator/>
                    </PinSetupProvider>
                </ThemeProvider>
            </LocalizationProvider>
        </SafeAreaProvider>
    );
}