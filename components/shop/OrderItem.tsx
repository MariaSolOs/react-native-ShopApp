import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import Card from '../UI/Card';
import CartItem from './CartItem';
import { Order } from '../../models/order';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';

type Props = {
    order: Order;
}

const OrderItem = (props: Props) => {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <Card style={styles.orderItem}>
            <View style={styles.summary}>
                <Text style={styles.totalAmount}>
                    ${props.order.totalAmount.toFixed(2)}
                </Text>
                <Text style={styles.date}>
                    {props.order.date}
                </Text>
            </View>
            <Button
            color={Colors.Primary}
            title={showDetails ? 'Hide details' : 'Show details'}
            onPress={() => setShowDetails((show) => !show)} />
            {showDetails && 
                <View style={styles.detailedItems}>
                    {props.order.items.map(cartItem => (
                        <CartItem key={cartItem.productId} item={cartItem} />
                    ))}
                </View>}
        </Card>
    );
}

const styles = StyleSheet.create({
    orderItem: {
        margin: 10,
        padding: 10,
        alignItems: 'center'
    },

    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10
    },

    totalAmount: {
        fontSize: 16,
        fontFamily: Fonts.AssistantBold
    },

    date: {
        fontFamily: Fonts.Assistant,
        fontSize: 16,
        color: '#2F4F4F'
    },

    detailedItems: {
        width: '100%'
    }
});

export default OrderItem;