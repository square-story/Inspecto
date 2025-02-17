import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IPayments } from "./types";
import { PaymentService } from "@/services/payment.service";


export const fetchPayments = createAsyncThunk(
    'inspection/featchPayments',
    async () => {
        const response = await PaymentService.getPayments()
        return response
    }
)


const paymentSlice = createSlice({
    name: 'payments',
    initialState: {
        data: [] as IPayments[],
        loading: false,
        error: null as string | null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPayments.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchPayments.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
                state.error = null
            })
            .addCase(fetchPayments.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to fetch Payments'
            })
    },
})


export default paymentSlice.reducer