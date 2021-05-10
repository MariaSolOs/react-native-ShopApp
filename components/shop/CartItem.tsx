import React from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Fonts } from '../../constants/fonts';

import { CartItem as ItemType } from '../../models/cartItem';
import { Colors } from '../../constants/colors';

type Props = {
    item: ItemType;
    onRemove?: () => void;
}

const CartItem = (props: Props) => (
    <View style={styles.cartItem}>
        <View style={styles.itemData}>
            <Text style={styles.quantity}>{props.item.quantity} </Text>
            <Text style={styles.title}>{props.item.title}</Text>
        </View>
        <View style={styles.itemData}>
            <Text style={styles.title}>
                ${(props.item.price * props.item.quantity).toFixed(2)}
            </Text>
            {props.onRemove &&
                <TouchableOpacity onPress={props.onRemove} style={styles.removeButton}>
                    <Ionicons
                    name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
                    size={25}
                    color="#000" />
                </TouchableOpacity>}
        </View>
    </View>
);

const styles = StyleSheet.create({
    cartItem: {
        padding: 10,
        backgroundColor: '#FFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 8
    },

    quantity: {
        fontFamily: Fonts.AssistantBold,
        fontSize: 18,
        color: Colors.Secondary
    },

    title: {
        fontFamily: Fonts.Assistant,
        fontSize: 18
    },

    removeButton: {
        marginLeft: 20
    },

    itemData: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export default CartItem;