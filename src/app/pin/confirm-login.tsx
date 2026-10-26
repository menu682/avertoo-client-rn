import { useEffect } from 'react';
import { router } from 'expo-router';

import PinEntry from '@/components/pin/PinEntry';
import { usePinSetup } from '@/features/pin/PinSetupContext';

export default function ConfirmLoginPinScreen() {
    const { loginPin } = usePinSetup();

    useEffect( () => {
        if ( !loginPin ) {
            router.replace( '/pin/create-login' );
        }
    }, [ loginPin ] );

    if ( !loginPin ) {
        return null;
    }

    return (
        <PinEntry
            titleKey="pin.confirmLogin.title"
            descriptionKey="pin.confirmLogin.description"
            onComplete={ ( pin ) => {
                if ( pin !== loginPin ) {
                    return 'pin.errorMismatch';
                }

                router.replace( '/pin/create-wipe' );
            } }
        />
    );
}