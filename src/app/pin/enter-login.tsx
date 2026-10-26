import { useRef } from 'react';
import { router } from 'expo-router';

import PinEntry from '@/components/pin/PinEntry';
import { usePinSetup } from '@/features/pin/PinSetupContext';
import {
    deleteSecureItem,
    getSecureItem,
    setSecureItem,
} from '@/storage/secureStorage';
import { verifyLoginPin, verifyWipePin } from '@/services/pinService';
import { AuthError, refresh } from '@/services/authService';
import { wipeAllLocalData } from '@/services/wipeService';
import type { TranslationKey } from '@/localization/translations';
import { getRefreshToken } from '@/storage/authStorage';

const FAILED_ATTEMPTS_KEY = 'security.pinFailedAttempts';
const MAX_FAILED_ATTEMPTS = 5;

export default function EnterLoginPinScreen() {
    const processing = useRef( false );
    const { clearPins } = usePinSetup();

    async function handleComplete(
        pin: string,
    ): Promise<TranslationKey | null> {
        if ( processing.current ) {
            return null;
        }

        processing.current = true;

        try {
            const isWipePin = await verifyWipePin( pin );

            if ( isWipePin ) {
                await wipeAllLocalData();
                clearPins();
                router.replace( '/pin/create-login' );
                return null;
            }

            const isLoginPin = await verifyLoginPin( pin );

            if ( !isLoginPin ) {
                const savedAttempts = await getSecureItem(
                    FAILED_ATTEMPTS_KEY,
                );

                const previousAttempts =
                    savedAttempts && /^\d+$/.test( savedAttempts )
                        ? Number( savedAttempts )
                        : 0;

                const attempts = previousAttempts + 1;

                if ( attempts >= MAX_FAILED_ATTEMPTS ) {
                    await wipeAllLocalData();
                    clearPins();
                    router.replace( '/pin/create-login' );
                    return null;
                }

                await setSecureItem(
                    FAILED_ATTEMPTS_KEY,
                    String( attempts ),
                );

                return 'pin.error.incorrect';
            }

            await deleteSecureItem( FAILED_ATTEMPTS_KEY );

            const refreshToken = await getRefreshToken();

            if ( !refreshToken ) {
                router.replace( '/auth/login' );
                return null;
            }

            try {
                await refresh();
                router.replace( '/chats/chats' );
            } catch {
                // Токен відсутній, протермінований або недійсний.
                // Потрібно пройти авторизацію заново.
                router.replace( '/auth/login' );
            }

            return null;
        } catch ( error ) {
            console.error( 'PIN processing failed:', error );
            return 'pin.error.storage';
        } finally {
            processing.current = false;
        }
    }

    return (
        <PinEntry
            titleKey="pin.enterLogin.title"
            descriptionKey="pin.enterLogin.description"
            onComplete={ handleComplete }
        />
    );
}