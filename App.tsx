import React, { useState } from 'react';
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import store from './store/store';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';

import AppNavigator from './navigation/AppNavigator';
import { Fonts } from './constants/fonts';

const fetchFonts = () => {
    return Font.loadAsync({
        [Fonts.Assistant]: require('./assets/fonts/Assistant-Light.ttf'),
        [Fonts.AssistantBold]: require('./assets/fonts/Assistant-Bold.ttf')
    });
}

LogBox.ignoreLogs(['interpolate()']);

export default function App() {
    const [fontLoading, setFontLoading] = useState(true);

    if (fontLoading) {
        return (
            <AppLoading
            startAsync={fetchFonts}
            onFinish={() => setFontLoading(false) }
            onError={(err) => console.error(err) } />
        );
    }

    return (
        <Provider store={store}>
            <AppNavigator />
        </Provider>
    );
}
