export type ProductsStackParamList = {
    ProductsOverview: undefined;
    ProductDetails: { 
        productId: string; 
        productTitle: string;
    };
    Cart: undefined;
}

export type OrdersStackParamList = {
    Orders: undefined;
}

export type UserStackParamList = {
    UserProducts: undefined;
    EditProduct: {
        productId?: string;
    }
}

export type ShopDrawerParamList = {
    Products: undefined;
    Orders: undefined;
    User: undefined;
}

export type AuthStackParamList = {
    Auth: undefined;
}