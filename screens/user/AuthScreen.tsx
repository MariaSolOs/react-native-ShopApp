import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
    ScrollView,
    View,
    Button,
    KeyboardAvoidingView,
    ActivityIndicator,
    Alert,
    StyleSheet 
} from 'react-native';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { useAppDispatch } from '../../hooks/redux';
import { authUser } from '../../store/authSlice';
import { unwrapResult, SerializedError } from '@reduxjs/toolkit';

import { LinearGradient } from 'expo-linear-gradient';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import { Colors } from '../../constants/colors';

type FormField = 'email' | 'password';

interface FormState {
    values: Record<FormField, string>;
    validities: Record<FormField, boolean>;
}

type Action = { 
    type: 'inputUpdate'; 
    value: string; 
    isValid: boolean;
    inputField: FormField;
};

const formReducer = (state: FormState, action: Action): FormState => {
    switch(action.type) {
        case 'inputUpdate':
            return {
                ...state,
                values: {
                    ...state.values,
                    [action.inputField]: action.value
                },
                validities: {
                    ...state.validities,
                    [action.inputField]: action.isValid
                }
            }
        default: return state;
    }
}

const AuthScreen: NavigationStackScreenComponent = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLogIn, setIsLogIn] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {   
        if (errorMsg) {
            Alert.alert('Oh no!', errorMsg, [
                { text: 'Okay' }
            ]);
        }
    }, [errorMsg]);

    const dispatch = useAppDispatch();

    const initialState: FormState = {
        values: {
            email: '',
            password: ''
        },
        validities: {
            email: false,
            password: false
        }
    }

    const [formState, formDispatch] = useReducer(formReducer, initialState);

    const handleInputChange = useCallback((inputField: string, value: string, isValid: boolean) => {
        formDispatch({
            type: 'inputUpdate',
            value,
            isValid,
            inputField: inputField as FormField
        });
    }, [formDispatch]);

    const handleAuth = async () => {
        setIsLoading(true);
        setErrorMsg('');
        try {
            await dispatch(authUser({ 
                ...formState.values,
                mode: isLogIn ? 'login' : 'signup'
            })).then(unwrapResult);
            props.navigation.navigate('Shop');
        } catch (e) {
            setIsLoading(false);
            setErrorMsg((e as SerializedError | Error).message || 'Something went wrong...');
        }
    }

    return (
        <KeyboardAvoidingView 
        behavior="padding" 
        keyboardVerticalOffset={50} 
        style={styles.screen}>
            <LinearGradient 
            style={styles.gradient}
            colors={['#E0FFFF', '#D8BFD8', '#800080']}>
                <Card style={styles.card}>
                    <ScrollView>
                        {isLoading ? 
                        <ActivityIndicator
                        size="large"
                        color={Colors.Primary} /> :
                        <>
                            <Input
                            inputId="email"
                            initialValue=""
                            onInputChange={handleInputChange}
                            label="Email"
                            email
                            required
                            inputProps={{
                                keyboardType: 'email-address',
                                autoCapitalize: 'none'
                            }} />
                            <Input
                            inputId="password"
                            initialValue=""
                            onInputChange={handleInputChange}
                            label="Password"
                            required
                            minLength={5}
                            inputProps={{
                                secureTextEntry: true,
                                autoCapitalize: 'none'
                            }} />
                            <View style={styles.buttonView}>
                                <Button 
                                title={isLogIn ? 'Log in' : 'Sign up'} 
                                color={Colors.Primary}
                                onPress={handleAuth} />
                            </View>
                            <View style={styles.buttonView}>
                                <Button 
                                title={isLogIn ? 
                                    "Don't have an account? Sign up" : 
                                    'Already have an account? Log in'
                                }
                                color={Colors.Primary}
                                onPress={() => setIsLogIn(val => !val)} />
                            </View>
                        </>}
                    </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}

AuthScreen.navigationOptions = {
    headerTitle: 'Authenticate'
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },

    card: {
        width: '85%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 15
    },

    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonView: {
        marginTop: 10
    }
});

export default AuthScreen;