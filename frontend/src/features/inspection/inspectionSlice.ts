import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { Inspection } from './types'
import { InspectionService } from '@/services/inspection.service'


export const fetchAppointments = createAsyncThunk(
    'inspection/fetchInspection',
    async () => {
        const response = await InspectionService.getInspections()
        return response
    }
)

const inspectionSlice = createSlice({
    name: 'inspection',
    initialState: {
        data: [] as Inspection[],
        loading: false,
        error: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAppointments.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchAppointments.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
                state.error = null
            })
            .addCase(fetchAppointments.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to fetch appointments'
            })
    },
})


export default inspectionSlice.reducer