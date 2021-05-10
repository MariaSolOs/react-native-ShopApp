import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';

interface Props extends ViewProps {
    children: React.ReactNode;
}

const Card = (props: Props) => (
    <View style={[styles.card, props.style]}>
        { props.children }
    </View>
);

const styles = StyleSheet.create({
    card: {
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: '#FFF'
    }
});

export default Card;