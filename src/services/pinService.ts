import {
    getSecureItem,
    setSecureItem,
} from '@/storage/secureStorage';

const PIN_STORAGE_KEY = 'security.pins';
const PIN_LENGTH = 4;

type StoredPins = {
    loginPin: string;
    wipePin: string;
};

export type PinServiceErrorCode =
    | 'INVALID_PIN'
    | 'PINS_MUST_DIFFER'
    | 'PINS_NOT_CONFIGURED';

export class PinServiceError extends Error {
    constructor( public readonly code: PinServiceErrorCode ) {
        super( code );
        this.name = 'PinServiceError';
    }
}

function isValidPin( pin: string ): boolean {
    return new RegExp( `^\\d{${ PIN_LENGTH }}$` ).test( pin );
}

export async function savePins(
    loginPin: string,
    wipePin: string,
): Promise<void> {
    if ( !isValidPin( loginPin ) || !isValidPin( wipePin ) ) {
        throw new PinServiceError( 'INVALID_PIN' );
    }

    if ( loginPin === wipePin ) {
        throw new PinServiceError( 'PINS_MUST_DIFFER' );
    }

    const pins: StoredPins = {
        loginPin,
        wipePin,
    };

    await setSecureItem( PIN_STORAGE_KEY, JSON.stringify( pins ) );
}

async function readPins(): Promise<StoredPins> {
    const value = await getSecureItem( PIN_STORAGE_KEY );

    if ( !value ) {
        throw new PinServiceError( 'PINS_NOT_CONFIGURED' );
    }

    try {
        const pins: unknown = JSON.parse( value );

        if (
            typeof pins === 'object' &&
            pins !== null &&
            'loginPin' in pins &&
            'wipePin' in pins &&
            typeof pins.loginPin === 'string' &&
            typeof pins.wipePin === 'string' &&
            isValidPin( pins.loginPin ) &&
            isValidPin( pins.wipePin )
        ) {
            return pins as StoredPins;
        }
    } catch {
        // Неправильний формат даних обробляється нижче.
    }

    throw new PinServiceError( 'PINS_NOT_CONFIGURED' );
}

export async function verifyLoginPin( pin: string ): Promise<boolean> {
    if ( !isValidPin( pin ) ) {
        return false;
    }

    const pins = await readPins();
    return pins.loginPin === pin;
}

export async function verifyWipePin( pin: string ): Promise<boolean> {
    if ( !isValidPin( pin ) ) {
        return false;
    }

    const pins = await readPins();
    return pins.wipePin === pin;
}