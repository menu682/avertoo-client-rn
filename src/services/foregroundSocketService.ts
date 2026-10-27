import { io, type Socket } from 'socket.io-client';

import { API_CONFIG } from '@/config/api';
import { getAccessToken } from '@/storage/authStorage';

export type ForegroundConnectionState = 'disconnected' | 'connecting' | 'connected';

type Listener = ( state: ForegroundConnectionState ) => void;

let socket: Socket | null = null;
let startup: Promise<void> | null = null;
let state: ForegroundConnectionState = 'disconnected';
const listeners = new Set<Listener>();

function publish( nextState: ForegroundConnectionState ) {
    state = nextState;
    listeners.forEach( ( listener ) => listener( state ) );
}

export function getForegroundConnectionState(): ForegroundConnectionState {
    return state;
}

export function subscribeForegroundConnection( listener: Listener ) {
    listeners.add( listener );
    listener( state );

    return () => listeners.delete( listener );
}

/** Starts the process-wide foreground socket once. It intentionally outlives screens. */
export function startForegroundConnection(): Promise<void> {
    if ( socket?.connected ) {
        publish( 'connected' );
        return Promise.resolve();
    }

    if ( startup ) {
        return startup;
    }

    publish( 'connecting' );

    startup = getAccessToken()
        .then( ( accessToken ) => {
            if ( !accessToken ) {
                publish( 'disconnected' );
                return;
            }

            if ( !socket ) {
                socket = io( `${ API_CONFIG.BASE_URL }/foreground`, {
                    autoConnect: false,
                    transports: [ 'websocket' ],
                    // Read the latest token for every initial/reconnect handshake.
                    auth: ( callback ) => {
                        void getAccessToken().then( ( currentToken ) => {
                            callback( { token: currentToken ?? '' } );
                        } ).catch( () => callback( { token: '' } ) );
                    },
                    reconnection: true,
                    reconnectionDelay: 1_000,
                    reconnectionDelayMax: 10_000,
                    // Socket.IO's Engine.IO heartbeat is handled by the server.
                } );

                socket.on( 'connect', () => publish( 'connected' ) );
                socket.on( 'disconnect', () => publish( 'disconnected' ) );
                socket.on( 'connect_error', () => publish( 'disconnected' ) );
                socket.io.on( 'reconnect_attempt', () => publish( 'connecting' ) );
            }

            if ( !socket.connected ) {
                publish( 'connecting' );
                socket.connect();
            }
        } )
        .catch( () => publish( 'disconnected' ) )
        .finally( () => {
            startup = null;
        } );

    return startup;
}
