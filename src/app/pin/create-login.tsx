import { router } from 'expo-router';

import PinEntry from '@/components/pin/PinEntry';
import { usePinSetup } from '@/features/pin/PinSetupContext';

export default function CreateLoginPinScreen() {
    const { setLoginPin } = usePinSetup();

    return (
        <PinEntry
            titleKey="pin.createLogin.title"
            descriptionKey="pin.createLogin.description"
            onComplete={ ( pin ) => {
                setLoginPin( pin );
                router.push( '/pin/confirm-login' );
            } }
        />
    );
}