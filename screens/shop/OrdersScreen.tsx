import React, { useState, useEffect } from 'react';
import { Text, FlatList, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { DrawerActions } from 'react-navigation-drawer';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { fetchOrders } from '../../store/ordersSlice';

import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import Centered from '../../components/UI/CenteredView';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';

const OrdersScreen: NavigationStackScreenComponent = () => {
    const orders = useAppSelector(state => state.orders.orders);

    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        dispatch(fetchOrders()).then(() => setIsLoading(false));
    }, [dispatch]);

    if (isLoading) {
        return (
            <Centered>
                <ActivityIndicator size="large" color={Colors.Primary} />
            </Centered>
        );  
    }

    if (orders.length === 0) {
        return (
            <Centered>
                <Text style={styles.emptyText}>
                    You haven't placed any orders yet!
                </Text>
            </Centered>
        );
    }

    return (
        <FlatList
        data={orders}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => (
            <OrderItem order={item} />
        )} />
    );
}

OrdersScreen.navigationOptions = ({ navigation }) => {
    return {
        headerTitle: 'Your orders',
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

const styles = StyleSheet.create({
    emptyText: {
        fontFamily: Fonts.AssistantBold,
        color: Colors.Secondary,
        fontSize: 18
    }
});

export default OrdersScreen;