import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from 'react';

type PinSetupContextValue = {
    loginPin: string | null;
    wipePin: string | null;
    setLoginPin: ( pin: string ) => void;
    setWipePin: ( pin: string ) => void;
    clearPins: () => void;
};

const PinSetupContext = createContext<PinSetupContextValue | null>( null );

export function PinSetupProvider( { children }: { children: ReactNode } ) {
    const [ loginPin, setLoginPin ] = useState<string | null>( null );
    const [ wipePin, setWipePin ] = useState<string | null>( null );

    function clearPins() {
        setLoginPin( null );
        setWipePin( null );
    }

    return (
        <PinSetupContext.Provider
            value={ {
                loginPin,
                wipePin,
                setLoginPin,
                setWipePin,
                clearPins,
            } }
        >
            { children }
        </PinSetupContext.Provider>
    );
}

export function usePinSetup() {
    const context = useContext( PinSetupContext );

    if ( !context ) {
        throw new Error( 'usePinSetup must be used within PinSetupProvider.' );
    }

    return context;
}