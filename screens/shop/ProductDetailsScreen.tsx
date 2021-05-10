import React from 'react';
import { 
    ScrollView, 
    View,
    Text,
    Image, 
    Button,
    StyleSheet 
} from 'react-native';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { addToCart } from '../../store/cartSlice';

import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';

type Props = {
    productId: string;
    productTitle: string;
}

const ProductDetailsScreen: NavigationStackScreenComponent<Props> = (props) => {
    const productId = props.navigation.getParam('productId');
    const product = useAppSelector(state => state.products.availableProducts.find(({ id }) => (
        id === productId
    )))!;

    const dispatch = useAppDispatch();

    return (
        <ScrollView>
            <Image source={{ uri: product.imageUrl }} style={styles.image} />
            <View style={styles.actions}>
                <Button 
                color={Colors.Primary} 
                title="Add to cart"
                onPress={() => {
                    dispatch(addToCart({ product }));
                }} />
            </View>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            <Text style={styles.description}>{product.description}</Text>
        </ScrollView>
    );
}

ProductDetailsScreen.navigationOptions = ({ navigation }) => {
    const productTitle = navigation.getParam('productTitle');
    return {
        headerTitle: productTitle
    }
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 300
    },

    price: {
        fontSize: 20,
        color: '#A9A9A9',
        textAlign: 'center',
        marginVertical: 10,
        fontFamily: Fonts.AssistantBold
    },

    description: {
        fontSize: 16,
        textAlign: 'center',
        marginHorizontal: 15,
        fontFamily: Fonts.Assistant
    },

    actions: {
        alignItems: 'center',
        marginTop: 10
    }
});

export default ProductDetailsScreen;
