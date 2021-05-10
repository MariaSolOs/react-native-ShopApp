import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from './store';
import { CartItem } from '../models/cartItem';
import { Order } from '../models/order';

interface OrdersState {
    orders: Order[];
}

const initialState: OrdersState = {
    orders: []
}

type OrderInfo = { 
    date: string; 
    totalAmount: number; 
    cartItems: CartItem[] 
}
type AddOrderPayload = { 
    cartItems: CartItem[]; 
    totalAmount: number; 
}

export const fetchOrders = createAsyncThunk(
    'orders/fetchAllStatus',
    async (_, { getState }) => {
        const userId = (getState() as RootState).auth.userId;

        const res = await fetch(`https://rn-learning-d9297-default-rtdb.firebaseio.com/orders/${userId}.json`);
        const resJSON: Record<string, OrderInfo> = await res.json();   

        return Object.entries(resJSON).map(([ id, data ]) => 
            new Order(
                id, 
                data.cartItems,
                data.totalAmount,
                new Date(data.date)
            )
        );
    }
);

export const addOrder = createAsyncThunk(
    'orders/addOrderStatus', 
    async (payload: AddOrderPayload, { getState }) => {
        const token = (getState() as RootState).auth.token;
        const userId = (getState() as RootState).auth.userId;
        const date = new Date();

        const res = await fetch(
            `https://rn-learning-d9297-default-rtdb.firebaseio.com/orders/${userId}.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...payload,
                date: date.toISOString()
            }) 
        });

        if (!res.ok) { throw new Error(); }

        const resJSON: { name: string } = await res.json();
        
        return {
            ...payload,
            id: resJSON.name,
            date
        }
    }
);

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchOrders.fulfilled, (state, { payload }) => {
            state.orders = payload;
        }),
        builder.addCase(addOrder.fulfilled, (state, { payload }) => {
            const newOrder = new Order(
                payload.id,
                payload.cartItems,
                payload.totalAmount,
                payload.date
            );

            state.orders.push(newOrder);
        })
    }
});

export default ordersSlice.reducer;