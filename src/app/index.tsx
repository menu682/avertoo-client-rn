import { useEffect } from 'react';
import { router } from 'expo-router';

import { getSecureItem } from '@/storage/secureStorage';

export default function IndexScreen() {
    useEffect( () => {
        let active = true;

        async function openInitialScreen() {
            try {
                const savedPins = await getSecureItem( 'security.pins' );

                if ( active ) {
                    router.replace(
                        savedPins
                            ? '/pin/enter-login'
                            : '/pin/create-login',
                    );
                }
            } catch {
                if ( active ) {
                    router.replace( '/pin/create-login' );
                }
            }
        }

        void openInitialScreen();

        return () => {
            active = false;
        };
    }, [] );

    return null;
}