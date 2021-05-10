import { configureStore } from '@reduxjs/toolkit';
import reduxThunk from 'redux-thunk';

import productsReducer from './productsSlice';
import cartReducer from './cartSlice';
import ordersReducer from './ordersSlice';
import authReducer from './authSlice';

const store = configureStore({
    reducer: {
        products: productsReducer,
        cart: cartReducer,
        orders: ordersReducer,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(reduxThunk)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;