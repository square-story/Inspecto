import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../../api/axios';

interface AuthState {
    accessToken: string | null;
    role: 'admin' | 'user' | 'inspector' | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    accessToken: localStorage.getItem('accessToken'),
    role: localStorage.getItem('role') as AuthState['role'],
    isAuthenticated: !!localStorage.getItem('accessToken'),
    isLoading: false,
    error: null,
};

// Declare the async actions
const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: { email: string; password: string; role: AuthState['role'] }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post<{ accessToken: string }>(
                `/${credentials.role}/login`,
                {
                    email: credentials.email,
                    password: credentials.password,
                },
                { withCredentials: true }
            );
            return {
                accessToken: response.data.accessToken,
                role: credentials.role,
            };
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            await axiosInstance.post('/logout', {}, { withCredentials: true });
            dispatch(clearCredentials());
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials(state, action: PayloadAction<{ accessToken: string; role: AuthState['role'] }>) {
            const { accessToken, role } = action.payload;
            state.accessToken = accessToken;
            state.role = role;
            state.isAuthenticated = true;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('role', role || '');
        },
        clearCredentials(state) {
            state.accessToken = null;
            state.role = null;
            state.isAuthenticated = false;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('role');
            if (localStorage.getItem('user')) {
                localStorage.removeItem('user')
            }
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.accessToken = action.payload.accessToken;
                state.role = action.payload.role as AuthState['role'];

                localStorage.setItem('accessToken', action.payload.accessToken);
                localStorage.setItem('role', action.payload.role || '');
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.accessToken = null;
                state.role = null;

                localStorage.removeItem('accessToken');
                localStorage.removeItem('role');
            });
    },
});

export const { setCredentials, clearCredentials, setLoading, setError } = authSlice.actions;

export default authSlice.reducer;