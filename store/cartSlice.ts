import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addOrder } from './ordersSlice';
import { deleteProduct } from './productsSlice';

import { Product } from '../models/product';
import { CartItem } from '../models/cartItem';

interface CartState {
    items: Record<string, CartItem>; 
    totalAmount: number; 
}

const initialState: CartState = {
    items: {},
    totalAmount: 0
}

type AddToCartActionPayload = PayloadAction<{ product: Product; }>;
type RemoveFromCartActionPayload = PayloadAction<{ productId: string; }>;

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, { payload }: AddToCartActionPayload) => {
            const { product } = payload;
            if (state.items[product.id]) {
                state.items[product.id].quantity++;
            } else {
                state.items[product.id] = {
                    quantity: 1,
                    price: product.price,
                    title: product.title,
                    pushToken: product.ownerPushToken
                }
            }
            state.totalAmount += product.price;
        },
        removeFromCart: (state, { payload }: RemoveFromCartActionPayload) => {
            const toRemove = state.items[payload.productId];
            state.totalAmount -= toRemove.price;

            if (toRemove.quantity === 1) {
                delete state.items[payload.productId];
            } else {
                state.items[payload.productId].quantity--;
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addOrder.fulfilled, () => initialState);
        builder.addCase(deleteProduct.fulfilled, (state, { payload }) => {
            const delItem = state.items[payload.productId];
            if (delItem) {
                state.totalAmount -= (delItem.price * delItem.quantity);
                delete state.items[payload.productId];
            }
        });
    }
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;