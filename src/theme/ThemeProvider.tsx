import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';

import { useLocalization } from '@/localization/LocalizationProvider';

import {
    getSecureItem,
    setSecureItem,
} from '@/storage/secureStorage';
import {
    darkTheme,
    lightTheme,
    type AppTheme,
    type ThemeMode,
} from '@/theme/themes';


const THEME_STORAGE_KEY = 'settings.theme';

type ThemeContextValue = {
    mode: ThemeMode;
    setMode: ( mode: ThemeMode ) => Promise<void>;
    theme: AppTheme;
    ready: boolean;
    storageError: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>( null );

type ThemeProviderProps = {
    children: ReactNode;
};

function isThemeMode( value: string | null ): value is ThemeMode {
    return value === 'system' || value === 'light' || value === 'dark';
}

export function ThemeProvider( { children }: ThemeProviderProps ) {
    const systemColorScheme = useColorScheme();

    const [ mode, setModeState ] = useState<ThemeMode>( 'system' );
    const [ ready, setReady ] = useState( false );
    const [ storageError, setStorageError ] = useState( false );
    const { t } = useLocalization();

    useEffect( () => {
        let active = true;

        async function loadTheme() {
            try {
                const savedMode = await getSecureItem( THEME_STORAGE_KEY );

                if ( !active ) return;

                if ( isThemeMode( savedMode ) ) {
                    setModeState( savedMode );
                }

                setStorageError( false );
            } catch {
                if ( active ) {
                    setStorageError( true );
                }
            } finally {
                if ( active ) {
                    setReady( true );
                }
            }
        }

        void loadTheme();

        return () => {
            active = false;
        };
    }, [] );

    const setMode = useCallback(
        async ( nextMode: ThemeMode ) => {
            if ( !ready || storageError ) {
                throw new Error( t( 'theme.error.notReady' ) );
            }

            await setSecureItem( THEME_STORAGE_KEY, nextMode );
            setModeState( nextMode );
        },
        [ t, ready, storageError ],
    );

    const theme = useMemo<AppTheme>( () => {
        const useDarkTheme =
            mode === 'dark' ||
            ( mode === 'system' && systemColorScheme === 'dark' );

        return useDarkTheme ? darkTheme : lightTheme;
    }, [ mode, systemColorScheme ] );

    const value = useMemo(
        () => ( {
            mode,
            setMode,
            theme,
            ready,
            storageError,
        } ),
        [ mode, setMode, theme, ready, storageError ],
    );

    return (
        <ThemeContext.Provider value={ value }>
            { children }
        </ThemeContext.Provider>
    );
}

export function useAppTheme(): ThemeContextValue {
    const context = useContext( ThemeContext );

    if ( !context ) {
        throw new Error(
            'useAppTheme must be used within ThemeProvider.',
        );
    }

    return context;
}