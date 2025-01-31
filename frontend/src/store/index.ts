// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import userReducer from '@/features/user/userSlice'
import inspectorReducer from '@/features/inspector/inspectorSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        inspector: inspectorReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;