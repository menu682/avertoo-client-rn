import {
    createContext,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from 'react';

import {
    translations,
    type Language,
    type TranslationKey,
} from './translations';

type LocalizationContextValue = {
    language: Language;
    setLanguage: ( language: Language ) => void;
    t: ( key: TranslationKey ) => string;
};

const LocalizationContext =
    createContext<LocalizationContextValue | null>( null );

type LocalizationProviderProps = {
    children: ReactNode;
};

export function LocalizationProvider( {
                                          children,
                                      }: LocalizationProviderProps ) {
    const [ language, setLanguage ] = useState<Language>( 'uk' );

    const value = useMemo<LocalizationContextValue>(
        () => ( {
            language,
            setLanguage,
            t: ( key ) => translations[ language ][ key ],
        } ),
        [ language ],
    );

    return (
        <LocalizationContext.Provider value={ value }>
            { children }
        </LocalizationContext.Provider>
    );
}

export function useLocalization(): LocalizationContextValue {
    const context = useContext( LocalizationContext );

    if ( !context ) {
        throw new Error(
            'useLocalization must be used within LocalizationProvider',
        );
    }

    return context;
}