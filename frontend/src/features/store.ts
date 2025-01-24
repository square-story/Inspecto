// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import userReducer from './user/userSlice'
import inspectorReducer from './inspector/inspectorSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        inspector: inspectorReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;