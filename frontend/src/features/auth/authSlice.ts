import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
    },
});

export const { setCredentials, clearCredentials, setLoading, setError } = authSlice.actions;

export default authSlice.reducer;