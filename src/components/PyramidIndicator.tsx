import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

type PyramidIndicatorProps = {
    color: string;
    size?: number;
    label: string;
};

export default function PyramidIndicator( {
    color,
    size = 42,
    label,
}: PyramidIndicatorProps ) {
    const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"><style>
      *{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;background:transparent!important;background-color:transparent!important;overflow:hidden}
      body{display:grid;place-items:center}.stage{width:${ size }px;height:${ size }px;display:grid;place-items:center;position:relative;background:transparent}
      .halo{position:absolute;width:100%;height:62%;bottom:42%;pointer-events:none;background:radial-gradient(ellipse at center,${ color }88 0%,${ color }44 28%,${ color }18 48%,transparent 73%)}
      .pyramid{position:relative;width:55%;height:auto;aspect-ratio:1.1547;filter:drop-shadow(0 2px 3px ${ color })}
      .face{position:absolute;inset:0;clip-path:polygon(50% 0,0 100%,50% 82%);background:linear-gradient(145deg,${ color },${ color });filter:brightness(1.35) saturate(1.15)}
      .right{clip-path:polygon(50% 0,100% 100%,50% 82%);background:${ color };filter:brightness(.68) saturate(1.2)}
      .base{clip-path:polygon(0 100%,100% 100%,50% 82%);background:${ color };filter:brightness(.42) saturate(1.2)}
    </style></head><body><div class="stage" role="img" aria-label="${ label }"><div class="halo"></div><div class="pyramid"><i class="face"></i><i class="face right"></i><i class="face base"></i></div></div></body></html>`;

    return (
        <View
            accessible
            accessibilityLabel={ label }
            style={ [ styles.container, { width: size, height: size } ] }
        >
            <WebView
                source={ { html } }
                originWhitelist={ [ '*' ] }
                scrollEnabled={ false }
                bounces={ false }
                javaScriptEnabled={ false }
                containerStyle={ styles.webViewContainer }
                style={ styles.webView }
            />
        </View>
    );
}

const styles = StyleSheet.create( {
    container: {
        backgroundColor: 'transparent',
        overflow: 'hidden',
    },
    webView: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    webViewContainer: {
        backgroundColor: 'transparent',
    },
} );
