import { createSlice } from '@reduxjs/toolkit';
import { loginUser, logoutUser } from './authAPI';

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

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { accessToken, role } = action.payload;
            state.accessToken = accessToken;
            state.role = role;
            state.isAuthenticated = true;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('role', role || '');
        },
        clearError: (state) => {
            state.error = null;
        },
        clearCredentials(state) {
            state.accessToken = null;
            state.role = null;
            state.isAuthenticated = false;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('role');
        }
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
                localStorage.setItem('role', action.payload.role);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.accessToken = null;
                state.role = null;
                state.isAuthenticated = false;
                localStorage.clear();
            });
    },
});

export const { setCredentials, clearError, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
