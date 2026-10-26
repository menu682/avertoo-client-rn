import { API_CONFIG, API_ENDPOINTS } from '@/config/api';
import { getRefreshToken, saveTokens } from '@/storage/authStorage';

export type AuthRequest = {
    userId: string;
    password: string;
    captchaToken: string;
};

export type AuthResponse = {
    accessToken: string;
    refreshToken: string;
};

export type RefreshRequest = {
    refreshToken: string;
};

export type AuthErrorCode =
    | 'network'
    | 'timeout'
    | 'invalidResponse'
    | 'storage'
    | 'validation'
    | 'unauthorized'
    | 'forbidden'
    | 'conflict'
    | 'rateLimited'
    | 'server'
    | 'unknown';

export class AuthError extends Error {
    constructor(
        public readonly code: AuthErrorCode,
        public readonly status?: number,
        public readonly serverMessage?: string,
    ) {
        super( code );
        this.name = 'AuthError';
    }
}

export function getUserIdFromAccessToken(
    accessToken: string,
): string | null {
    try {
        const parts = accessToken.split( '.' );

        if ( parts.length !== 3 ) {
            return null;
        }

        const payload = parts[ 1 ]
            .replace( /-/g, '+' )
            .replace( /_/g, '/' );

        const decoded = globalThis.atob(
            payload.padEnd( Math.ceil( payload.length / 4 ) * 4, '=' ),
        );

        const data: unknown = JSON.parse( decoded );

        if ( typeof data !== 'object' || data === null ) {
            return null;
        }

        const claims = data as Record<string, unknown>;

        for ( const key of [ 'userId', 'user_id', 'sub' ] ) {
            const value = claims[ key ];

            if (
                ( typeof value === 'string' ||
                    typeof value === 'number' ) &&
                /^[1-9]\d{9}$/.test( String( value ) )
            ) {
                return String( value );
            }
        }

        return null;
    } catch {
        return null;
    }
}

async function requestAuth(
    endpoint: string,
    data: AuthRequest | RefreshRequest,
): Promise<AuthResponse> {
    let response: Response;

    try {
        response = await fetch(
            `${ API_CONFIG.BASE_URL }${ endpoint }`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify( data ),
                signal: AbortSignal.timeout( API_CONFIG.TIMEOUT_MS ),
            },
        );
    } catch ( error ) {
        if (
            error instanceof Error &&
            ( error.name === 'TimeoutError' ||
                error.name === 'AbortError' )
        ) {
            throw new AuthError( 'timeout' );
        }

        throw new AuthError( 'network' );
    }

    const responseData: unknown = await response
        .json()
        .catch( () => null );

    if ( !response.ok ) {
        throw new AuthError(
            getErrorCode( response.status ),
            response.status,
            extractServerMessage( responseData ),
        );
    }

    if (
        typeof responseData !== 'object' ||
        responseData === null ||
        !( 'accessToken' in responseData ) ||
        !( 'refreshToken' in responseData ) ||
        typeof responseData.accessToken !== 'string' ||
        typeof responseData.refreshToken !== 'string' ||
        !responseData.accessToken ||
        !responseData.refreshToken
    ) {
        throw new AuthError( 'invalidResponse' );
    }

    const tokens: AuthResponse = {
        accessToken: responseData.accessToken,
        refreshToken: responseData.refreshToken,
    };

    try {
        await saveTokens( tokens );
    } catch {
        throw new AuthError( 'storage' );
    }

    return tokens;
}

function getErrorCode( status: number ): AuthErrorCode {
    switch ( status ) {
        case 400:
            return 'validation';
        case 401:
            return 'unauthorized';
        case 403:
            return 'forbidden';
        case 409:
            return 'conflict';
        case 429:
            return 'rateLimited';
        default:
            return status >= 500 ? 'server' : 'unknown';
    }
}

function extractServerMessage( data: unknown ): string | undefined {
    if (
        typeof data === 'object' &&
        data !== null &&
        'message' in data
    ) {
        const { message } = data;

        if ( typeof message === 'string' ) {
            return message;
        }

        if (
            Array.isArray( message ) &&
            message.every( ( item ) => typeof item === 'string' )
        ) {
            return message.join( '\n' );
        }
    }

    return undefined;
}

export function login( data: AuthRequest ): Promise<AuthResponse> {
    return requestAuth( API_ENDPOINTS.LOGIN, data );
}

export function register( data: AuthRequest ): Promise<AuthResponse> {
    return requestAuth( API_ENDPOINTS.REGISTER, data );
}

export async function refresh(): Promise<AuthResponse> {
    const refreshToken = await getRefreshToken();

    if ( !refreshToken ) {
        throw new AuthError( 'unauthorized' );
    }

    return requestAuth( API_ENDPOINTS.REFRESH, { refreshToken } );
}