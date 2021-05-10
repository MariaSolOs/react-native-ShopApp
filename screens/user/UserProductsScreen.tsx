import React from 'react';
import { Text, FlatList, Button, Alert, Platform, StyleSheet } from 'react-native';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { DrawerActions } from 'react-navigation-drawer';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { deleteProduct } from '../../store/productsSlice';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import Centered from '../../components/UI/CenteredView';
import HeaderButton from '../../components/UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';

const UserProductsScreen: NavigationStackScreenComponent = (props) => {
    const userProducts = useAppSelector(state => state.products.userProducts);

    const dispatch = useAppDispatch();
    
    const handleEditProduct = (productId: string) => {
        props.navigation.navigate({
            routeName: 'EditProduct',
            params: { productId }
        });
    }
    
    const handleDelete = (productId: string) => {
        Alert.alert('Are you sure?', "You're about to delete this product.", [
            { text: 'No', style: 'cancel' },
            { 
                text: 'Yes', 
                style: 'destructive',
                onPress: () => dispatch(deleteProduct({ productId }))
            }
        ]);
    }

    if (userProducts.length === 0) {
        return (
            <Centered>
                <Text style={styles.emptyText}>
                    You haven't created any products yet!
                </Text>
            </Centered>
        );
    }

    return (
        <FlatList
        data={userProducts}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => (
            <ProductItem product={item} onSelect={() => handleEditProduct(item.id)}>
                <Button 
                color={Colors.Primary}
                title="Edit"
                onPress={() => handleEditProduct(item.id)} />
                <Button 
                color={Colors.Primary}
                title="Delete"
                onPress={() => handleDelete(item.id)} />
            </ProductItem>
        )} />
    );
}

UserProductsScreen.navigationOptions = ({ navigation }) => {
    return {
        headerTitle: 'Your products',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                title="Menu"
                iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                onPress={() => {
                    navigation.dispatch(DrawerActions.toggleDrawer());
                }} />
            </HeaderButtons>
        ),
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                title="Add product"
                iconName={Platform.OS === 'android' ? 
                    'md-add-circle-outline' : 'ios-add-circle-outline'}
                onPress={() => {
                    navigation.navigate('EditProduct');
                }} />
            </HeaderButtons>
        )
    }
}

const styles = StyleSheet.create({
    emptyText: {
        fontFamily: Fonts.AssistantBold,
        color: Colors.Secondary,
        fontSize: 18
    }
});

export default UserProductsScreen;