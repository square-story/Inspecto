import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    address: string | null;
    profile_image: string | null;
    status: boolean;
    role: string;
}

const initialState: UserState = {
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    address: null,
    profile_image: '',
    status: true,
    role: 'user',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<Partial<UserState>>) => {
            // Update individual fields in the state
            Object.assign(state, action.payload);
            localStorage.setItem('user', JSON.stringify(action.payload))
        },
        clearUser: (state) => {
            // Reset the state to the initial state
            Object.assign(state, initialState);
            localStorage.removeItem('user')
        },
        updateField: (state, action: PayloadAction<{ key: keyof UserState; value: string | boolean | null }>) => {
            const { key, value } = action.payload;
            (state[key] as typeof value) = value; // Dynamically update the field
            // Update localStorage with the new state
            localStorage.setItem('user', JSON.stringify(state));
        },
    },
});

export const { setUser, clearUser, updateField } = userSlice.actions;

export default userSlice.reducer;
