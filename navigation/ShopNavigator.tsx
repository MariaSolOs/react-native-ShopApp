import React from 'react';
import { Platform, SafeAreaView, Button, View } from 'react-native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import { useAppDispatch } from '../hooks/redux';
import { logout } from '../store/authSlice';
import { 
    ProductsStackParamList, 
    OrdersStackParamList,
    UserStackParamList,
    ShopDrawerParamList,
    AuthStackParamList
} from './types';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/fonts';

import ProductsOverviewScreen, { ProductsOverviewScreenOptions } from '../screens/shop/ProductsOverviewScreen';
import ProductDetailsScreen, { ProductDetailsScreenOptions } from '../screens/shop/ProductDetailsScreen';
import CartScreen, { CartScreenOptions } from '../screens/shop/CartScreen';
import OrdersScreen, { OrdersScreenOptions } from '../screens/shop/OrdersScreen';
import UserProductsScreen, { UserProductsScreenOptions } from '../screens/user/UserProductsScreen';
import EditProductScreen, { EditProductScreenOptions } from '../screens/user/EditProductScreen';
import AuthScreen, { AuthScreenOptions } from '../screens/user/AuthScreen';

const defaultNavOptions: StackNavigationOptions = {
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

const ProductsStack = createStackNavigator<ProductsStackParamList>();
export const ProductsNavigator = () => (
    <ProductsStack.Navigator screenOptions={defaultNavOptions}>
        <ProductsStack.Screen 
        name="ProductsOverview"
        component={ProductsOverviewScreen}
        options={ProductsOverviewScreenOptions} />
        <ProductsStack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={ProductDetailsScreenOptions} />
        <ProductsStack.Screen
        name="Cart"
        component={CartScreen}
        options={CartScreenOptions} />
    </ProductsStack.Navigator>
);

const OrdersStack = createStackNavigator<OrdersStackParamList>();
const OrdersNavigator = () => (
    <OrdersStack.Navigator screenOptions={defaultNavOptions}>
        <OrdersStack.Screen 
        name="Orders"
        component={OrdersScreen}
        options={OrdersScreenOptions} />
    </OrdersStack.Navigator>
);

const UserStack = createStackNavigator<UserStackParamList>();
const UserNavigator = () => (
    <UserStack.Navigator>
        <UserStack.Screen
        name="UserProducts"
        component={UserProductsScreen}
        options={UserProductsScreenOptions} />
        <UserStack.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={EditProductScreenOptions} />
    </UserStack.Navigator>
);

const ShopDrawer = createDrawerNavigator<ShopDrawerParamList>();
export const ShopNavigator = () => {
    const dispatch = useAppDispatch();

    return (
        <ShopDrawer.Navigator 
        drawerContentOptions={{ activeTintColor: Colors.Primary }}
        drawerContent={props => (
            <View style={{ flex: 1 }}>
                <SafeAreaView >
                    <DrawerItemList { ...props } />
                    <Button 
                    color={Colors.Primary}
                    title="Log out" 
                    onPress={() => {
                        dispatch(logout());
                    }} />
                </SafeAreaView>
            </View>
        )}>
            <ShopDrawer.Screen 
            name="Products" 
            component={ProductsNavigator}
            options={{
                drawerIcon: ({ color }) => (
                    <Ionicons
                    name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                    size={25}
                    color={color} />
                )
            }} />
            <ShopDrawer.Screen 
            name="Orders" 
            component={OrdersNavigator}
            options={{
                drawerIcon: ({ color }) => (
                    <Ionicons
                    name="basket"
                    size={25}
                    color={color} />
                )
            }} />
            <ShopDrawer.Screen 
            name="User" 
            component={UserNavigator}
            options={{
                drawerIcon: ({ color }) => (
                    <Ionicons
                    name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                    size={25}
                    color={color} />
                )
            }} />
        </ShopDrawer.Navigator>
    );
}

const AuthStack = createStackNavigator<AuthStackParamList>();
export const AuthNavigator = () => (   
    <AuthStack.Navigator screenOptions={defaultNavOptions}>
        <AuthStack.Screen 
        name="Auth"
        component={AuthScreen}
        options={AuthScreenOptions} />
    </AuthStack.Navigator>
);