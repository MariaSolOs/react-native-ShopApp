import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { 
    ScrollView, 
    KeyboardAvoidingView, 
    View, 
    Alert, 
    ActivityIndicator,
    StyleSheet 
} from 'react-native';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { createProduct, updateProduct } from '../../store/productsSlice';
import { unwrapResult, SerializedError } from '@reduxjs/toolkit';

import Centered from '../../components/UI/CenteredView';
import HeaderButton from '../../components/UI/HeaderButton';
import Input from '../../components/UI/Input';
import { Colors } from '../../constants/colors';

type FormField = 'title' | 'imageUrl' | 'price' | 'description';

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

type Props = {
    productId?: string; 
    onSubmit: () => void;
}

const EditProductScreen: NavigationStackScreenComponent<Props> = (props) => {
    const editProduct = useAppSelector(state => state.products.userProducts.find(({ id }) => 
        id === props.navigation.getParam('productId')
    ));

    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const dispatch = useAppDispatch();

    const initialState: FormState = {
        values: {
            title: editProduct?.title || '',
            imageUrl: editProduct?.imageUrl || '',
            description: editProduct?.description || '',
            price: ''
        },
        validities: {
            title: Boolean(editProduct),
            imageUrl: Boolean(editProduct),
            description: Boolean(editProduct),
            price: Boolean(editProduct)
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

    const handleSubmit = useCallback(async () => {
        const isFormValid = Object.values(formState.validities).reduce((acc, curr) => 
            acc && curr
        );
        if (!isFormValid) {
            Alert.alert("You haven't completed the form properly!");
            return;
        }

        setErrorMsg('');
        setIsLoading(true);

        try { 
            if (editProduct) {
                await dispatch(updateProduct({ 
                    id: editProduct.id,
                    title: formState.values.title, 
                    imageUrl: formState.values.imageUrl,
                    description: formState.values.description
                })).then(unwrapResult);
            } else {
                await dispatch(createProduct({
                    title: formState.values.title, 
                    imageUrl: formState.values.imageUrl,
                    description: formState.values.description,
                    price: +formState.values.price
                })).then(unwrapResult);
            }
            props.navigation.goBack();
        } catch (e) {
            setErrorMsg((e as SerializedError | Error).message || 
            `We couldn't ${editProduct ? 'update' : 'create'} your product :(`);
        }

        setIsLoading(false);
    }, [dispatch, editProduct?.id, formState]);

    useEffect(() => {
        if (errorMsg) {
            Alert.alert('An error occurred', errorMsg, [
                { text: 'Okay' }
            ]);
        }
    }, [errorMsg]);

    useEffect(() => {
        props.navigation.setParams({ onSubmit: handleSubmit });
    }, [handleSubmit]);

    if (isLoading) {
        return (
            <Centered>
                <ActivityIndicator size="large" color={Colors.Primary} />
            </Centered>
        );
    }

    return (
        <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior="padding" 
        keyboardVerticalOffset={100}>
            <ScrollView>
                <View style={styles.form}>
                    <Input
                    inputId="title"
                    label="Title"
                    inputProps={{
                        autoCapitalize: 'sentences',
                        autoCorrect: true,
                        returnKeyType: 'next'
                    }}
                    onInputChange={handleInputChange}
                    initialValue={initialState.values.title}
                    initialValidity={initialState.validities.title}
                    required
                    minLength={5} />
                    <Input
                    inputId="imageUrl"
                    label="Image URL"
                    inputProps={{
                        returnKeyType: 'next'
                    }}
                    onInputChange={handleInputChange}
                    initialValue={initialState.values.imageUrl}
                    initialValidity={initialState.validities.imageUrl}
                    required />
                    {!editProduct && 
                        <Input 
                        inputId="price"
                        label="Price"
                        inputProps={{
                            keyboardType: 'decimal-pad',
                            returnKeyType: 'next'
                        }}
                        onInputChange={handleInputChange}
                        required
                        min={1} /> }
                    <Input
                    inputId="description"
                    label="Description"
                    inputProps={{
                        returnKeyType: 'done',
                        multiline: true,
                        numberOfLines: 3
                    }}
                    onInputChange={handleInputChange}
                    initialValue={initialState.values.description}
                    initialValidity={initialState.validities.description}
                    required />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

EditProductScreen.navigationOptions = ({ navigation }) => {
    const isEditing = navigation.getParam('productId');
    const onSubmit = navigation.getParam('onSubmit');

    return {
        headerTitle: isEditing ? 'Edit product' : 'Add product',
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                title="Save"
                iconName="checkmark-circle-outline"
                onPress={onSubmit} />
            </HeaderButtons>
        )
    }
}

const styles = StyleSheet.create({
    form: {
        margin: 15
    }
});

export default EditProductScreen;