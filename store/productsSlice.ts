import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from './store';
import { Product } from '../models/product';

interface ProductState {
    availableProducts: Product[];
    userProducts: Product[];
}

const initialState: ProductState = {
    availableProducts: [],
    userProducts: [],
}

type DeleteProductPayload = { productId: string; }
type CreateProductPayload = { 
    title: string; 
    imageUrl: string;
    price: number;
    description: string; 
}
type UpdateProductPayload = { 
    id: string;
    title: string; 
    imageUrl: string;
    description: string; 
}

export const createProduct = createAsyncThunk(
    'products/createStatus',
    async (payload: CreateProductPayload, { getState }) => {
        const token = (getState() as RootState).auth.token;
        const userId = (getState() as RootState).auth.userId;
        
        const res = await fetch(
            `https://rn-learning-d9297-default-rtdb.firebaseio.com/products.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...payload,
                ownerId: userId
            })
        });

        if (!res.ok) { throw new Error(); }

        const resJSON: { name: string } = await res.json();
        
        return {
            ...payload,
            id: resJSON.name,
            ownerId: userId
        }
    }
);

export const fetchProducts = createAsyncThunk(
    'products/fetchAllStatus',
    async (_, { getState }) => {
        const userId = (getState() as RootState).auth.userId;

        const res = await fetch('https://rn-learning-d9297-default-rtdb.firebaseio.com/products.json');

        const resJSON: Record<string, CreateProductPayload & { ownerId: string; }> = await res.json();   
        
        const allProducts = Object.entries(resJSON).map(([ id, data ]) => 
            new Product(
                id,
                data.ownerId,
                data.title,
                data.imageUrl,
                data.description,
                data.price
            )
        );

        return {
            allProducts,
            userProducts: allProducts.filter(({ ownerId }) => ownerId === userId)
        }
    }
);

export const updateProduct = createAsyncThunk(
    'products/updateStatus',
    async (payload: UpdateProductPayload, { getState }) => {
        const token = (getState() as RootState).auth.token;
        
        const res = await fetch(
            `https://rn-learning-d9297-default-rtdb.firebaseio.com/products/${payload.id}.json?auth=${token}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: payload.title,
                description: payload.description,
                imageUrl: payload.imageUrl
            })
        });

        if (!res.ok) { throw new Error(); }

        return payload;
    }
)

export const deleteProduct = createAsyncThunk(
    'products/delete',
    async (payload: DeleteProductPayload, { getState }) => {
        const token = (getState() as RootState).auth.token;
        
        await fetch(`https://rn-learning-d9297-default-rtdb.firebaseio.com/products/${payload.productId}.json?auth=${token}`, {
            method: 'DELETE'
        });

        return payload;
    }
)

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(createProduct.fulfilled, (state, { payload }) => {
            const createdProduct = new Product(
                payload.id,
                payload.ownerId!,
                payload.title,
                payload.imageUrl,
                payload.description,
                payload.price
            );
            state.availableProducts.push(createdProduct);
            state.userProducts.push(createdProduct);
        }),
        builder.addCase(fetchProducts.fulfilled, (state, { payload }) => {
            state.availableProducts = payload.allProducts;
            state.userProducts = payload.userProducts;
        }),
        builder.addCase(updateProduct.fulfilled, (state, { payload }) => {
            const toUpdate = state.userProducts.find(({ id }) => 
                payload.id === id
            )!;

            const updatedProduct = new Product(
                toUpdate.id,
                toUpdate.ownerId,
                payload.title,
                payload.imageUrl,
                payload.description,
                toUpdate.price
            );
            
            let idx = state.availableProducts.findIndex(({ id }) => id === toUpdate.id);
            state.availableProducts[idx] = updatedProduct;
            idx = state.userProducts.findIndex(({ id }) => id === toUpdate.id);
            state.userProducts[idx] = updatedProduct;
        }),
        builder.addCase(deleteProduct.fulfilled, (state, { payload }) => {
            state.availableProducts = state.availableProducts.filter(({ id }) => 
                id !== payload.productId
            );
            state.userProducts = state.userProducts.filter(({ id }) => 
                id !== payload.productId
            );
        })
    }
});

export default productsSlice.reducer;
