import {
    deleteSecureItem,
    getSecureItem,
    setSecureItem,
} from '@/storage/secureStorage';

const AUTH_STORAGE_KEYS = {
    ACCESS_TOKEN: 'auth.accessToken',
    REFRESH_TOKEN: 'auth.refreshToken',
} as const;

export type AuthTokens = {
    accessToken: string;
    refreshToken: string;
};

/**
 * Зберігає пару токенів.
 * Якщо запис не вдався, намагається відновити попередні значення.
 */
export async function saveTokens( tokens: AuthTokens ): Promise<void> {
    if ( !tokens.accessToken.trim() || !tokens.refreshToken.trim() ) {
        throw new Error( 'Access and refresh tokens must not be empty.' );
    }

    const previousTokens = await getTokens();

    try {
        await setSecureItem(
            AUTH_STORAGE_KEYS.ACCESS_TOKEN,
            tokens.accessToken,
        );

        await setSecureItem(
            AUTH_STORAGE_KEYS.REFRESH_TOKEN,
            tokens.refreshToken,
        );
    } catch ( error ) {
        try {
            if ( previousTokens ) {
                await setSecureItem(
                    AUTH_STORAGE_KEYS.ACCESS_TOKEN,
                    previousTokens.accessToken,
                );
                await setSecureItem(
                    AUTH_STORAGE_KEYS.REFRESH_TOKEN,
                    previousTokens.refreshToken,
                );
            } else {
                await clearTokens();
            }
        } catch {
            // Зберігаємо початкову помилку для виклику.
        }

        throw error;
    }
}

/** Повертає access-токен або null. */
export async function getAccessToken(): Promise<string | null> {
    return getSecureItem( AUTH_STORAGE_KEYS.ACCESS_TOKEN );
}

/** Повертає refresh-токен або null. */
export async function getRefreshToken(): Promise<string | null> {
    return getSecureItem( AUTH_STORAGE_KEYS.REFRESH_TOKEN );
}

/** Повертає обидва токени, якщо вони збережені. */
export async function getTokens(): Promise<AuthTokens | null> {
    const [ accessToken, refreshToken ] = await Promise.all( [
        getAccessToken(),
        getRefreshToken(),
    ] );

    if ( !accessToken || !refreshToken ) {
        return null;
    }

    return { accessToken, refreshToken };
}

/** Оновлює лише access-токен. */
export async function updateAccessToken(
    accessToken: string,
): Promise<void> {
    if ( !accessToken.trim() ) {
        throw new Error( 'Access token must not be empty.' );
    }

    await setSecureItem(
        AUTH_STORAGE_KEYS.ACCESS_TOKEN,
        accessToken,
    );
}

/** Оновлює лише refresh-токен. */
export async function updateRefreshToken(
    refreshToken: string,
): Promise<void> {
    if ( !refreshToken.trim() ) {
        throw new Error( 'Refresh token must not be empty.' );
    }

    await setSecureItem(
        AUTH_STORAGE_KEYS.REFRESH_TOKEN,
        refreshToken,
    );
}

/** Видаляє обидва токени. */
export async function clearTokens(): Promise<void> {
    const results = await Promise.allSettled( [
        deleteSecureItem( AUTH_STORAGE_KEYS.ACCESS_TOKEN ),
        deleteSecureItem( AUTH_STORAGE_KEYS.REFRESH_TOKEN ),
    ] );

    if ( results.some( ( result ) => result.status === 'rejected' ) ) {
        throw new Error( 'Failed to clear authentication tokens.' );
    }
}

/** Перевіряє, чи збережена повна пара токенів. */
export async function hasTokens(): Promise<boolean> {
    return ( await getTokens() ) !== null;
}