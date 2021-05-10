import React from 'react';
import { Platform, SafeAreaView, Button, View } from 'react-native';
import { 
    createAppContainer, 
    NavigationScreenConfig, 
    createSwitchNavigator
} from 'react-navigation';
import { 
    createStackNavigator, 
    NavigationStackScreenComponent, 
    NavigationStackOptions 
} from 'react-navigation-stack';
import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch } from '../hooks/redux';
import { logout } from '../store/authSlice';

import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import ProductDetailsScreen from '../screens/shop/ProductDetailsScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import UserProductsScreen from '../screens/user/UserProductsScreen';
import EditProductScreen from '../screens/user/EditProductScreen';
import AuthScreen from '../screens/user/AuthScreen';
import StartUpScreen from '../screens/StartUpScreen';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/fonts';

const defaultNavOptions: NavigationScreenConfig<NavigationStackOptions, any> = {
    ...Platform.OS === 'android' && {
        headerStyle: {
            backgroundColor: Colors.Primary
        },
    },
    headerTintColor: Platform.OS === 'android' ? '#FFF' : Colors.Primary,
    headerTitleStyle: {
        fontFamily: Fonts.AssistantBold
    },
    headerBackTitleStyle: {
        fontFamily: Fonts.Assistant
    }
}

const ProductsNavigator = createStackNavigator({
    ProductsOverview: ProductsOverviewScreen,
    ProductDetails: ProductDetailsScreen as NavigationStackScreenComponent,
    Cart: CartScreen
}, { defaultNavigationOptions: defaultNavOptions });

const OrdersNavigator = createStackNavigator({
    Orders: OrdersScreen
}, { defaultNavigationOptions: defaultNavOptions });

const UserNavigator = createStackNavigator({
    UserProducts: UserProductsScreen,
    EditProduct: EditProductScreen as NavigationStackScreenComponent
}, { defaultNavigationOptions: defaultNavOptions });

const ShopNavigator = createDrawerNavigator({
    Products: {
        screen: ProductsNavigator,
        navigationOptions: {
            drawerIcon: ({ tintColor }) => (
                <Ionicons
                name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                size={25}
                color={tintColor} />
            )
        }
    },
    Orders: {
        screen: OrdersNavigator,
        navigationOptions: {
            drawerIcon: ({ tintColor }) => (
                <Ionicons
                name="basket"
                size={25}
                color={tintColor} />
            )
        }
    },
    User: {
        screen: UserNavigator,
        navigationOptions: {
            drawerIcon: ({ tintColor }) => (
                <Ionicons
                name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                size={25}
                color={tintColor} />
            )
        }
    }
}, {
    contentComponent: props => {
        const dispatch = useAppDispatch();

        return (
            <View style={{ flex: 1 }}>
                <SafeAreaView >
                    <DrawerNavigatorItems { ...props } />
                    <Button 
                    color={Colors.Primary}
                    title="Log out" 
                    onPress={() => {
                        dispatch(logout());
                    }} />
                </SafeAreaView>
            </View>
        );
    },
    contentOptions: {
        activeTintColor: Colors.Primary,
        itemsContainerStyle: {
            marginTop: 25
        }
    }
});

const AuthNavigator = createStackNavigator({
    Auth: AuthScreen
}, { defaultNavigationOptions: defaultNavOptions });

const MainNavigator = createSwitchNavigator({
    StartUp: StartUpScreen,
    Auth: AuthNavigator,
    Shop: ShopNavigator
});

export default createAppContainer(MainNavigator);