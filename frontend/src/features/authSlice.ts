import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
    isLoggedIn: boolean;
    loading: boolean;
    error: string | null;
    userId: string | null;
    lastLoginAt: string | null;
}

const initialState: AuthState = {
    isLoggedIn: false,
    loading: false,
    error: null,
    userId: null,
    lastLoginAt: null,
};

export const checkLoggedInStatus = createAsyncThunk(
    'auth/checkLoggedInStatus',
    async (_, thunkAPI) => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/status`,
                {},
                { withCredentials: true }
            );
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'An error occurred');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.isLoggedIn = false;
            state.userId = null;
            state.lastLoginAt = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkLoggedInStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkLoggedInStatus.fulfilled, (state, action) => {
                state.loading = false;
                const { message, userId, lastLoginAt } = action.payload;
                state.isLoggedIn = message === 'User is logged in';
                state.userId = userId || null;
                state.lastLoginAt = lastLoginAt || null;
            })
            .addCase(checkLoggedInStatus.rejected, (state, action) => {
                state.loading = false;
                state.isLoggedIn = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
