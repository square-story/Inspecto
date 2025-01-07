import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
    user: { id: string; name: string; email: string } | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logOut: (state) => {
            state.user = null;
            state.token = null
        }
    }
})

export const { logOut } = authSlice.actions
export default authSlice.reducer