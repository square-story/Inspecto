import axiosInstance from "@/api/axios"
import { InspectionType, InspectionTypeCreateValues, InspectionTypeEditValues } from "@/pages/admin/InspectionTypes/types"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { AxiosError } from "axios"

interface InspectionTypeState {
    inspectionTypes: InspectionType[]
    activeInspectionTypes: InspectionType[]
    loading: boolean
    error: string | null
}

const initialState: InspectionTypeState = {
    inspectionTypes: [],
    activeInspectionTypes: [],
    loading: false,
    error: null,
}

export const featchAllInspectionTypes = createAsyncThunk<InspectionType[], void, { rejectValue: string }>(
    "inspectionType/featchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<{ data: InspectionType[] }>("/inspection-types")
            return response.data.data
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            return rejectWithValue(error.response?.data?.message || "Failed to fetch inspection types")
        }
    }
)

export const featchActiveInspectionTypes = createAsyncThunk<InspectionType[], void, { rejectValue: string }>(
    "inspectionType/featchActive",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<{ data: InspectionType[] }>("/inspection-types/active")
            return response.data.data
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            return rejectWithValue(error.response?.data?.message || "Failed to fetch active inspection types")
        }
    }
)

export const createInspectionType = createAsyncThunk<InspectionType, InspectionTypeCreateValues, { rejectValue: string }>(
    "inspectionType/create",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post<{ data: InspectionType }>("/inspection-types", data)
            return response.data.data
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            return rejectWithValue(error.response?.data?.message || "Failed to create inspection type")
        }
    }
)

export const updateInspectionType = createAsyncThunk<
    InspectionType,
    { id: string; data: InspectionTypeEditValues },
    { rejectValue: string }
>("inspectionType/update", async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.put<{ data: InspectionType }>(`/inspection-types/${id}`, data)
        return response.data.data
    } catch (err) {
        const error = err as AxiosError<{ message: string }>
        return rejectWithValue(error.response?.data?.message || "Failed to update inspection type")
    }
})

export const toggleInspectionTypeStatus = createAsyncThunk<InspectionType, string, { rejectValue: string }>(
    "inspectionType/toggleStatus",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch<{ data: InspectionType }>(`/inspection-types/${id}/toggle-status`)
            return response.data.data
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            return rejectWithValue(error.response?.data?.message || "Failed to toggle inspection type status")
        }
    }
)

export const deleteInspectionType = createAsyncThunk<string, string, { rejectValue: string }>(
    "inspectionType/delete",
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/inspection-types/${id}`)
            return id
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            return rejectWithValue(error.response?.data?.message || "Failed to delete inspection type")
        }
    }
)


const inspectionTypeSlice = createSlice({
    name: "inspectionType",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(featchAllInspectionTypes.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(featchAllInspectionTypes.fulfilled, (state, action) => {
                state.loading = false
                state.inspectionTypes = action.payload
            })
            .addCase(featchAllInspectionTypes.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || "Unknown error"
            })

            // Fetch active
            .addCase(featchActiveInspectionTypes.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(featchActiveInspectionTypes.fulfilled, (state, action) => {
                state.loading = false
                state.activeInspectionTypes = action.payload
            })
            .addCase(featchActiveInspectionTypes.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || "Unknown error"
            })

            // Create
            .addCase(createInspectionType.fulfilled, (state, action) => {
                state.inspectionTypes.push(action.payload)
                if (action.payload.isActive) {
                    state.activeInspectionTypes.push(action.payload)
                }
            })

            // Update
            .addCase(updateInspectionType.fulfilled, (state, action) => {
                const index = state.inspectionTypes.findIndex((type) => type._id === action.payload._id)
                if (index !== -1) state.inspectionTypes[index] = action.payload

                const activeIndex = state.activeInspectionTypes.findIndex((type) => type._id === action.payload._id)
                if (action.payload.isActive) {
                    if (activeIndex !== -1) {
                        state.activeInspectionTypes[activeIndex] = action.payload
                    } else {
                        state.activeInspectionTypes.push(action.payload)
                    }
                } else if (activeIndex !== -1) {
                    state.activeInspectionTypes.splice(activeIndex, 1)
                }
            })

            // Toggle Status
            .addCase(toggleInspectionTypeStatus.fulfilled, (state, action) => {
                const index = state.inspectionTypes.findIndex((type) => type._id === action.payload._id)
                if (index !== -1) state.inspectionTypes[index] = action.payload

                const activeIndex = state.activeInspectionTypes.findIndex((type) => type._id === action.payload._id)
                if (action.payload.isActive) {
                    if (activeIndex === -1) state.activeInspectionTypes.push(action.payload)
                } else if (activeIndex !== -1) {
                    state.activeInspectionTypes.splice(activeIndex, 1)
                }
            })

            // Delete
            .addCase(deleteInspectionType.fulfilled, (state, action) => {
                state.inspectionTypes = state.inspectionTypes.filter((type) => type._id !== action.payload)
                state.activeInspectionTypes = state.activeInspectionTypes.filter((type) => type._id !== action.payload)
            })
    },
})

export default inspectionTypeSlice.reducer
