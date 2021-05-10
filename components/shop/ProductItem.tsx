import React from 'react';
import { 
    View, 
    Text, 
    Image, 
    TouchableOpacity, 
    TouchableOpacityProps, 
    TouchableNativeFeedback,
    TouchableNativeFeedbackProps,
    Platform,
    StyleSheet 
} from 'react-native';

import Card from '../UI/Card';
import { Fonts } from '../../constants/fonts';
import { Product } from '../../models/product';

type Props = {
    children?: React.ReactNode;
    product: Product;
    onSelect: () => void;
}

const ProductItem = (props: Props) => {
    const Touchable = (Platform.OS === 'android' && Platform.Version >= 21 ?
        TouchableNativeFeedback : TouchableOpacity) as (
        React.ElementType<TouchableNativeFeedbackProps | TouchableOpacityProps>
    ); 

    return (
        <Card style={styles.product}>
            <View style={styles.touchable}>
                <Touchable onPress={props.onSelect} useForeground>
                    <View>
                        <View style={styles.imageView}>
                            <Image source={{ uri: props.product.imageUrl }} style={styles.image} />
                        </View>
                        <View style={styles.header}>
                            <Text style={styles.title}>{props.product.title}</Text>
                            <Text style={styles.price}>${props.product.price.toFixed(2)}</Text>
                        </View>
                        <View style={styles.actions}>
                            { props.children }
                        </View>
                    </View>
                </Touchable>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    product: {
        height: 300,
        margin: 15
    },
    
    touchable: {
        overflow: 'hidden',
        borderRadius: 10
    },

    imageView: {
        width: '100%',
        height: '60%',
        overflow: 'hidden',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },

    image: {
        width: '100%',
        height: '100%'
    },

    title: {
        fontSize: 18,
        marginTop: 4,
        fontFamily: Fonts.AssistantBold
    },

    header: {
        height: '15%',
        paddingTop: 5,
        alignItems: 'center'
    },

    price: {
        fontSize: 16,
        color: '#A9A9A9',
        fontFamily: Fonts.AssistantBold
    },

    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '25%'
    }
});

export default ProductItem;