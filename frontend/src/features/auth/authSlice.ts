import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    accessToken: string | null;
    role: 'admin' | 'user' | 'inspector' | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    status: boolean;
    blockReason: string
}

const initialState: AuthState = {
    accessToken: localStorage.getItem('accessToken'),
    role: localStorage.getItem('role') as AuthState['role'],
    isAuthenticated: !!localStorage.getItem('accessToken'),
    isLoading: false,
    error: null,
    status: true,
    blockReason: ''
};



const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials(state, action: PayloadAction<{ accessToken: string; role: AuthState['role'], status: boolean }>) {
            const { accessToken, role, status } = action.payload;
            state.accessToken = accessToken;
            state.status = status
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
            state.status = true
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        setBlockedStatus: (state, action) => {
            state.status = action.payload.status;
            state.blockReason = action.payload.blockReason
        }
    },
});

export const { setCredentials, clearCredentials, setLoading, setError, setBlockedStatus } = authSlice.actions;

export default authSlice.reducer;