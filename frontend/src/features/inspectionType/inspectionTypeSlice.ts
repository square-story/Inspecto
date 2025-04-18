import axiosInstance from "@/api/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface InspectionType {
    _id: string;
    name: string;
    price: number;
    platformFee: number;
    duration: string;
    features: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface InspectionTypeState {
    inspectionTypes: InspectionType[];
    activeInspectionTypes: InspectionType[];
    loading: boolean;
    error: string | null;
}

const initialState: InspectionTypeState = {
    inspectionTypes: [],
    activeInspectionTypes: [],
    loading: false,
    error: null
}

export const featchAllInspectionTypes = createAsyncThunk(
    'inspectionType/featchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/inspection-types');
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch inspection types');
        }
    }
)

export const featchActiveInspectionTypes = createAsyncThunk(
    'inspectionType/featchActive',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/inspection-types/active');
            console.log(response.data.data, 'something thisoifdskjkfdsjkadfsjklaj');
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch inspection types');
        }
    }
)

export const createInspectionType = createAsyncThunk(
    'inspectionType/create',
    async (inspectionTypeData: Omit<InspectionType, '_id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/inspection-types', inspectionTypeData);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create inspection type');
        }
    }
)

export const updateInspectionType = createAsyncThunk(
    'inspectionType/update',
    async ({ id, data }: { id: string, data: Partial<InspectionType> }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put('/inspection-types/' + id, data);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update inspection type');
        }
    }
)


export const toggleInspectionTypeStatus = createAsyncThunk(
    'inspectionType/toggleStatus',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(`/inspection-types/${id}/toggle-status`);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to toggle inspection type status');
        }
    }
)

export const deleteInspectionType = createAsyncThunk(
    'inspectionType/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/inspection-types/${id}`);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete inspection type');
        }
    }
)

const inspectionTypeSlice = createSlice({
    name: 'inspectionType',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(featchAllInspectionTypes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(featchAllInspectionTypes.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.inspectionTypes = action.payload;
                }
            )
            .addCase(featchAllInspectionTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(featchActiveInspectionTypes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(featchActiveInspectionTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.activeInspectionTypes = action.payload;
            })
            .addCase(featchActiveInspectionTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(createInspectionType.fulfilled, (state, action) => {
                state.inspectionTypes.push(action.payload as unknown as InspectionType);
                if ((action.payload as unknown as InspectionType).isActive) {
                    state.activeInspectionTypes.push(action.payload as unknown as InspectionType);
                }
            })

            .addCase(updateInspectionType.fulfilled, (state, action) => {
                const index = state.inspectionTypes.findIndex((type) => type._id === (action.payload as unknown as InspectionType)._id);
                if (index !== -1) {
                    state.inspectionTypes[index] = action.payload as unknown as InspectionType;
                }

                const activeIndex = state.activeInspectionTypes.findIndex(type => type._id === (action.payload as unknown as InspectionType)._id);
                if ((action.payload as unknown as InspectionType).isActive) {
                    if (activeIndex !== -1) {
                        state.activeInspectionTypes[activeIndex] = action.payload as unknown as InspectionType;

                    } else {
                        state.activeInspectionTypes.push(action.payload as unknown as InspectionType);
                    }
                } else if (activeIndex !== -1) {
                    state.activeInspectionTypes.splice(activeIndex, 1);
                }
            })

            .addCase(toggleInspectionTypeStatus.fulfilled, (state, action) => {
                const index = state.inspectionTypes.findIndex(type => type._id === action.payload._id);
                if (index !== -1) {
                    state.inspectionTypes[index] = action.payload;
                }

                const activeIndex = state.activeInspectionTypes.findIndex(type => type._id === action.payload._id);
                if (action.payload.isActive) {
                    if (activeIndex === -1) {
                        state.activeInspectionTypes.push(action.payload);
                    }
                } else if (activeIndex !== -1) {
                    state.activeInspectionTypes.splice(activeIndex, 1);
                }
            })

            .addCase(deleteInspectionType.fulfilled, (state, action) => {
                state.inspectionTypes = state.inspectionTypes.filter(type => type._id !== action.payload);
                state.activeInspectionTypes = state.activeInspectionTypes.filter(type => type._id !== action.payload);
            })
    }
})

export default inspectionTypeSlice.reducer;