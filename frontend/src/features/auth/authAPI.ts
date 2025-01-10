import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

interface LoginCredentials {
    email: string,
    password: string,
    role: string
}

interface LoginResponse {
    accessToken: string,
}

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post<LoginResponse>(
                `/${credentials.role}/login`,
                {
                    email: credentials.email,
                    password: credentials.password,
                }
            );
            return {
                accessToken: response.data.accessToken,
                role: credentials.role
            };
        } catch (error: unknown) {
            return rejectWithValue(error);
        }
    }
)

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await axiosInstance.post('/logout');
            return;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);