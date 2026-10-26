import { deleteSecureItem } from '@/storage/secureStorage';

const WIPE_STORAGE_KEYS = [
    'security.pins',
    'security.pinFailedAttempts',
    'auth.accessToken',
    'auth.refreshToken',
    'onboarding.completed',
] as const;

export async function wipeAllLocalData(): Promise<void> {
    const results = await Promise.allSettled(
        WIPE_STORAGE_KEYS.map( ( key ) => deleteSecureItem( key ) ),
    );

    const failedKeys = WIPE_STORAGE_KEYS.filter(
        ( _, index ) => results[ index ].status === 'rejected',
    );

    if ( failedKeys.length > 0 ) {
        throw new Error(
            `Failed to clear local data: ${ failedKeys.join( ', ' ) }`,
        );
    }
}