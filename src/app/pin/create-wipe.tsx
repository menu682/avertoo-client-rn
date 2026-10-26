import { router } from 'expo-router';

import PinEntry from '@/components/pin/PinEntry';
import { usePinSetup } from '@/features/pin/PinSetupContext';

export default function CreateWipePinScreen() {
    const { loginPin, setWipePin } = usePinSetup();

    return (
        <PinEntry
            titleKey="pin.createWipe.title"
            descriptionKey="pin.createWipe.description"
            onComplete={ ( pin ) => {
                if ( pin === loginPin ) {
                    return 'pin.errorSameCodes';
                }

                setWipePin( pin );
                router.push( '/pin/confirm-wipe' );
            } }
        />
    );
}