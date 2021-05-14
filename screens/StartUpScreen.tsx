import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAppDispatch } from '../hooks/redux';
import { storeAuthData, setTryAutoLogIn } from '../store/authSlice';

import Centered from '../components/UI/CenteredView';
import { Colors } from '../constants/colors';

const StartUpScreen = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const tryLogIn = async () => {
            const storedData = await AsyncStorage.getItem('userData');
            if (storedData) {
                const { token, userId, expiryDate } = JSON.parse(storedData);

                if (!token || !userId || new Date(expiryDate) <= new Date()) {
                    dispatch(setTryAutoLogIn());

                } else {
                    dispatch(storeAuthData({ token, userId }));
                }
            } else {
                dispatch(setTryAutoLogIn());
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