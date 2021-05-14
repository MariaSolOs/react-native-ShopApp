import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { useAppSelector } from '../hooks/redux';

import { ShopNavigator, AuthNavigator } from './ShopNavigator';
import StartUpScreen from '../screens/StartUpScreen';

const AppNavigator = () => {
    const isAuth = useAppSelector(state => Boolean(state.auth.token));
    const didTryAutoLogIn = useAppSelector(state => state.auth.didTryAutoLogin);

    return (
        <NavigationContainer>
            {isAuth ? 
                <ShopNavigator /> :
                didTryAutoLogIn ? 
                    <AuthNavigator /> : 
                    <StartUpScreen />}
        </NavigationContainer>
    );
}

export default AppNavigator;