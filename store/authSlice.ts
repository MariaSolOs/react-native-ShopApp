import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
    token: string | null;
    userId: string | null;
}

const initialState: AuthState = {
    token: null,
    userId: null
}

let timer: NodeJS.Timeout;

type AuthPayload = { email: string; password: string; mode: 'login' | 'signup' }

const setLogoutTimer = createAsyncThunk(
    'auth/logoutStatus',
    (expirationTime: number, { dispatch }) => {
    timer = setTimeout(() => {
        dispatch(logout());
    }, expirationTime);
});

export const authUser = createAsyncThunk(
    'auth/authUserStatus',
    async (payload: AuthPayload, { dispatch }) => {
        const authMode = payload.mode === 'signup' ? 'signUp' : 'signInWithPassword';
        
        const res = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:${authMode}?key=AIzaSyAkMdrwaoiaMqNgIIMO4FThcMM8OoP3PI8`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...payload,
                returnSecureToken: true
            })
        });
        
        const resJSON = await res.json();

        if (!res.ok) { 
            throw new Error(resJSON.error.message);
        }

        const expiryDate = new Date(new Date().getTime() + (+resJSON.expiresIn * 1000));
        AsyncStorage.setItem('userData', JSON.stringify({ 
            token: resJSON.idToken, 
            userId: resJSON.localId, 
            expiryDate: expiryDate.toISOString() 
        }));

        dispatch(storeAuthData({ token: resJSON.idToken, userId: resJSON.localId }));
        dispatch(setLogoutTimer(+resJSON.expiresIn * 1000));

        return { token: resJSON.idToken, userId: resJSON.localId }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        storeAuthData: (state, { payload }: PayloadAction<AuthState>) => {
            state.token = payload.token;
            state.userId = payload.userId;
        },
        logout: () => {
            if (timer) { clearTimeout(timer); }
            AsyncStorage.removeItem('userData');
            return initialState;
        }
    }
});

export const { storeAuthData, logout } = authSlice.actions;

export default authSlice.reducer;