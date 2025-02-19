// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import userReducer from '@/features/user/userSlice'
import inspectorReducer from '@/features/inspector/inspectorSlice'
import vehicleReducer from '@/features/vehicle/vehicleSlice'
import inspectionReducer from '@/features/inspection/inspectionSlice'
import paymentReducer from '@/features/payments/paymentSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        inspector: inspectorReducer,
        vehicle: vehicleReducer,
        inspections: inspectionReducer,
        payments: paymentReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;