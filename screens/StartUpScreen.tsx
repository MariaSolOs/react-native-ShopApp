import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { NavigationSwitchScreenComponent } from 'react-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '../hooks/redux';
import { storeAuthData } from '../store/authSlice';

import Centered from '../components/UI/CenteredView';
import { Colors } from '../constants/colors';

const StartUpScreen: NavigationSwitchScreenComponent = (props) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const tryLogIn = async () => {
            const storedData = await AsyncStorage.getItem('userData');
            if (!storedData) {
                props.navigation.navigate('Auth');
            } else {
                const { token, userId, expiryDate } = JSON.parse(storedData);

                if (!token || !userId || new Date(expiryDate) <= new Date()) {
                    props.navigation.navigate('Auth');
                } else {
                    dispatch(storeAuthData({ token, userId }));
                    props.navigation.navigate('Shop');
                }
            }
        }

        tryLogIn();
    }, [dispatch]);

    return (
        <Centered>
            <ActivityIndicator size="large" color={Colors.Primary} />
        </Centered>
    );
}

export default StartUpScreen;