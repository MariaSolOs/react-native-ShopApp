import React, { useReducer, useEffect } from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet } from 'react-native';

import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';

interface InputState {
    value: string;
    isValid: boolean;
    modified: boolean;
}

type Action = { type: 'inputChange'; value: string; isValid: boolean; } | 
              { type: 'inputBlur' };

const inputReducer = (state: InputState, action: Action): InputState => {
    switch(action.type) {
        case 'inputChange':
            return {
                ...state,
                value: action.value,
                isValid: action.isValid
            }
        case 'inputBlur':
            return {
                ...state,
                modified: true
            }
        default: return state;
    }
}

type Props = {
    inputId: string;
    label: string;
    inputProps: TextInputProps;
    onInputChange: (inputId: string, value: string, isValid: boolean) => void;
    initialValue?: string;
    initialValidity?: boolean;
    required?: boolean;
    email?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
}

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const Input = (props: Props) => {
    const initialState: InputState = {
        value: props?.initialValue || '',
        isValid: Boolean(props.initialValidity),
        modified: false
    }

    const [state, dispatch] = useReducer(inputReducer, initialState);

    const handleInputChange = (value: string) => {
        let isValid = true;
        if ((props.required && value.trim().length === 0) ||
            (props.email && !emailRegex.test(value.toLowerCase())) ||
            (props.min && +value < props.min) ||
            (props.max && +value > props.max) ||
            (props.minLength && value.length < props.minLength)) {
            isValid = false;
        }
        
        dispatch({
            type: 'inputChange',
            value,
            isValid
        });
    }

    const handleInputBlur = () => {
        dispatch({ type: 'inputBlur' });
    }

    useEffect(() => {
        if (state.modified) {
            props.onInputChange(props.inputId, state.value, state.isValid);
        }
    }, [state, props.inputId, props.onInputChange]);

    return (
        <View style={styles.formField}>
            <Text style={styles.label}>{props.label}</Text>
            <TextInput 
            { ...props.inputProps }
            style={styles.input}
            value={state.value}
            onBlur={handleInputBlur}
            onChangeText={handleInputChange} />
            {!state.isValid && state.modified &&
                <View style={styles.errorView}>
                    <Text style={styles.errorText}>
                        Invalid {props.label}!
                    </Text>
                </View>}
        </View>
    );
}

const styles = StyleSheet.create({
    formField: {  
        width: '100%',
        marginVertical: 15
    },

    label: {
        fontFamily: Fonts.AssistantBold,
        marginBottom: 8
    },

    input: {
        paddingHorizontal: 2,
        paddingVertical: 4,
        borderBottomColor: Colors.Secondary,
        borderBottomWidth: 1
    },

    errorView: {
        marginVertical: 5
    },

    errorText: {
        fontFamily: Fonts.AssistantBold,
        color: 'red',
        fontSize: 14
    }
});

export default Input;