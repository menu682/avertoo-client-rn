import { useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    View,
} from 'react-native';
import {
    WebView,
    type WebViewMessageEvent,
} from 'react-native-webview';

import { API_CONFIG, CAPTCHA_CONFIG } from '@/config/api';
import { useAppTheme } from '@/theme/ThemeProvider';

type CaptchaProps = {
    onToken: ( token: string ) => void;
    onError?: () => void;
};

type TypedWebView = WebView<object>;

export default function Captcha( {
                                     onToken,
                                     onError,
                                 }: CaptchaProps ) {
    const { theme } = useAppTheme();
    const [ loading, setLoading ] = useState( true );

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        >
        <script
          src="${CAPTCHA_CONFIG.SCRIPT_URL}"
          async
          defer
        ></script>
        <style>
          body {
            margin: 0;
            padding: 0;
            background: ${ theme.isDark ? '#111318' : '#FFFFFF' };
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 75px;
          }
        </style>
      </head>
      <body>
        <div
          class="cf-turnstile"
          data-sitekey="${ CAPTCHA_CONFIG.SITE_KEY }"
          data-callback="onSuccess"
          data-expired-callback="onExpired"
          data-error-callback="onFailure"
          data-theme="${ theme.isDark ? 'dark' : 'light' }"
        ></div>

        <script>
          function send(type, token) {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({
                type: type,
                token: token || ''
              })
            );
          }

          function onSuccess(token) {
            send('success', token);
          }

          function onExpired() {
            send('expired', '');
          }

          function onFailure() {
            send('error', '');
          }
        </script>
      </body>
    </html>
  `;

    function handleMessage( event: WebViewMessageEvent ) {
        try {
            const message = JSON.parse( event.nativeEvent.data ) as {
                type: string;
                token?: string;
            };

            if ( message.type === 'success' && message.token ) {
                onToken( message.token );
                return;
            }

            if (
                message.type === 'expired' ||
                message.type === 'error'
            ) {
                onToken( '' );
                onError?.();
            }
        } catch {
            onToken( '' );
            onError?.();
        }
    }

    return (
        <View
            style={ [
                styles.container,
                { backgroundColor: theme.colors.background },
            ] }
        >
            { loading && (
                <ActivityIndicator
                    color={ theme.colors.primary }
                    style={ styles.loader }
                />
            ) }

            <WebView<object>
                source={ {
                    html,
                    baseUrl: API_CONFIG.SITE_URL,
                } }
                originWhitelist={ [ '*' ] }
                onMessage={ handleMessage }
                onLoadEnd={ () => setLoading( false ) }
                onError={ () => {
                    setLoading( false );
                    onToken( '' );
                    onError?.();
                } }
                javaScriptEnabled
                domStorageEnabled
                style={ styles.webView }
            />
        </View>
    );
}

const styles = StyleSheet.create( {
    container: {
        minHeight: 75,
        justifyContent: 'center',
        borderRadius: 8,
        overflow: 'hidden',
    },
    webView: {
        height: 75,
        backgroundColor: 'transparent',
    },
    loader: {
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 1,
    },
} );