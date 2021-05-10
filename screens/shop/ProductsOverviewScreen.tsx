import React, { useState, useEffect, useCallback } from 'react';
import { 
    FlatList, 
    Button, 
    Platform, 
    Text,
    ActivityIndicator, 
} from 'react-native';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { DrawerActions } from 'react-navigation-drawer';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { fetchProducts } from '../../store/productsSlice';
import { addToCart } from '../../store/cartSlice';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import Centered from '../../components/UI/CenteredView';
import ProductItem from '../../components/shop/ProductItem';
import HeaderButton from '../../components/UI/HeaderButton';
import { Colors } from '../../constants/colors';
import { Product } from '../../models/product';

const ProductsOverviewScreen: NavigationStackScreenComponent = (props) => {
    const products = useAppSelector(state => state.products.availableProducts);

    const dispatch = useAppDispatch();

    const handleProductNavigate = (item: Product) => {
        props.navigation.navigate({
            routeName: 'ProductDetails',
            params: {
                productId: item.id,
                productTitle: item.title
            }
        });
    }

    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const loadProducts = useCallback(async () => {
        setErrorMsg('');
        setIsRefreshing(true);
        try {
            await dispatch(fetchProducts()).then(unwrapResult);
        } catch (_) {
            setErrorMsg('Oh no! Loading failed...');
        }
        setIsRefreshing(false);
    }, [dispatch]);

    useEffect(() => {
        setIsLoading(true);
        loadProducts().then(() => setIsLoading(false));
    }, [loadProducts]);

    useEffect(() => {
        const focusListener = props.navigation.addListener('willFocus', loadProducts);

        return () => { focusListener.remove(); }
    }, [loadProducts]);

    if (isLoading) {
        return (
            <Centered>
                <ActivityIndicator size="large" color={Colors.Primary} />
            </Centered>
        );
    }

    if (products.length === 0) {
        return (
            <Centered>
                <Text>No products found! Start creating some ;)</Text>
            </Centered>
        );
    }

    if (errorMsg) {
        return (
            <Centered>
                <Text>{errorMsg}</Text>
                <Button 
                title="Try again" 
                onPress={loadProducts}
                color={Colors.Primary} />
            </Centered>
        );
    }

    return (
        <FlatList 
        refreshing={isRefreshing}
        onRefresh={loadProducts}
        data={products}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => (
            <ProductItem 
            product={item}
            onSelect={() => handleProductNavigate(item)}>
                <Button 
                color={Colors.Primary}
                title="View details" 
                onPress={() => handleProductNavigate(item)} />
                <Button 
                color={Colors.Primary}
                title="Add to cart" 
                onPress={() => dispatch(addToCart({ product: item }))} />
            </ProductItem>
        )} />
    );
}

ProductsOverviewScreen.navigationOptions = ({ navigation }) => {
    return {
        headerTitle: 'Products',
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                title="Cart"
                iconName="cart-outline"
                onPress={() => {
                    navigation.navigate('Cart');
                }} />
            </HeaderButtons>
        ),
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                title="Menu"
                iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                onPress={() => {
                    navigation.dispatch(DrawerActions.toggleDrawer());
                }} />
            </HeaderButtons>
        )
    }
}

export default ProductsOverviewScreen;
