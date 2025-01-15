import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';
import { clearCredentials } from './authSlice';

interface LoginCredentials {
    email: string,
    password: string,
    role: string
}

interface LoginResponse {
    accessToken: string,
    role: string,
    userDetails?: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        address: string | null;
        profile_image: string | null;
        status: boolean;
        role: string;
    }
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
                role: credentials.role,
                userDetails: response.data?.userDetails
            };
        } catch (error: unknown) {
            return rejectWithValue(error);
        }
    }
)

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            await axiosInstance.post('/logout', {}, { withCredentials: true });
            dispatch(clearCredentials());
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);