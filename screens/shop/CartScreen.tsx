import React, { useState } from 'react';
import { View, Text, FlatList, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { removeFromCart } from '../../store/cartSlice';
import { addOrder } from '../../store/ordersSlice';

import Card from '../../components/UI/Card';
import CartItem from '../../components/shop/CartItem';

const CartScreen: NavigationStackScreenComponent = () => {
    const totalAmount = Math.max(useAppSelector(state => state.cart.totalAmount), 0);
    const cartItems = useAppSelector(state => Object.entries(state.cart.items).map(entry => (
        { productId: entry[0], ...entry[1] }
    )).sort((p1, p2) => p1.productId > p2.productId ? 1 : -1));

    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(false);

    const handleCompleteOrder = async () => {
        setIsLoading(true);
        await dispatch(addOrder({ cartItems, totalAmount }));
        setIsLoading(false);
    }

    return (
        <View style={styles.screen}>
            <Card style={styles.summary}>
                <Text style={styles.summaryText}>
                    Total: <Text style={styles.amount}>${totalAmount.toFixed(2)}</Text>
                </Text>
                {isLoading ? 
                    <ActivityIndicator size="small" color={Colors.Primary} /> : 
                    <Button 
                    color={Colors.Primary} 
                    title="Complete order"
                    disabled={cartItems.length === 0}
                    onPress={handleCompleteOrder} />}
            </Card>
            <View>
                <Text style={styles.summaryText}>In your cart:</Text>
                <FlatList
                data={cartItems}
                keyExtractor={({ productId }) => productId}
                renderItem={({ item }) => (
                    <CartItem 
                    item={item}
                    onRemove={() => {
                        dispatch(removeFromCart({ productId: item.productId }));
                    }} />
                )} />
            </View>
        </View>
    );
}

CartScreen.navigationOptions = {
    headerTitle: 'Your cart'
}

const styles = StyleSheet.create({
    screen: {
        margin: 15
    },

    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding: 10
    },

    summaryText: {
        fontFamily: Fonts.Assistant,
        fontSize: 16
    },

    amount: {
        fontFamily: Fonts.AssistantBold
    }
});

export default CartScreen;