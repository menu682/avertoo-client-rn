import { useEffect } from 'react';
import { router } from 'expo-router';

import PinEntry from '@/components/pin/PinEntry';
import { usePinSetup } from '@/features/pin/PinSetupContext';
import {
    PinServiceError,
    savePins,
} from '@/services/pinService';

export default function ConfirmWipePinScreen() {
    const { loginPin, wipePin } = usePinSetup();

    useEffect( () => {
        if ( !loginPin || !wipePin ) {
            router.replace( '/pin/create-login' );
        }
    }, [ loginPin, wipePin ] );

    if ( !loginPin || !wipePin ) {
        return null;
    }

    return (
        <PinEntry
            titleKey="pin.confirmWipe.title"
            descriptionKey="pin.confirmWipe.description"
            onComplete={ async ( pin ) => {
                if ( pin !== wipePin ) {
                    return 'pin.errorMismatch';
                }

                if ( pin === loginPin ) {
                    return 'pin.errorSameCodes';
                }

                try {
                    await savePins( loginPin, wipePin );
                    router.replace( '/auth/login' );
                } catch ( error ) {
                    if ( error instanceof PinServiceError ) {
                        if ( error.code === 'PINS_MUST_DIFFER' ) {
                            return 'pin.errorSameCodes';
                        }

                        if ( error.code === 'INVALID_PIN' ) {
                            return 'pin.error.invalid';
                        }
                    }

                    return 'pin.error.storage';
                }
            } }
        />
    );
}