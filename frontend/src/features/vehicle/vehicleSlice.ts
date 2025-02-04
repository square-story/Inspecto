import axiosInstance from "@/api/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


// Async thunk for fetching vehicles
export const fetchVehicles = createAsyncThunk("vehicles/fetchVehicles", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get("/vehicles");
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return rejectWithValue(error.response.data);
        }
        return rejectWithValue(error);
    }
});


// Async thunk for adding a vehicle
export const addVehicle = createAsyncThunk("vehicles/addVehicle", async (vehicleData: Partial<Vehicle>, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/vehicles", vehicleData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return rejectWithValue({
                status: error.response.status,
                error: error.response.data.error,
                duplicateField: error.response.data.duplicateField
            });
        }
        return rejectWithValue({
            error: "An unexpected error occurred",
            status: 500
        });
    }
});

// Async thunk for updating a vehicle
export const updateVehicle = createAsyncThunk("vehicles/updateVehicle", async (vehicleData: Vehicle, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.put(`/vehicles/${vehicleData._id}`, vehicleData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return rejectWithValue({
                status: error.response.status,
                error: error.response.data.error,
                duplicateField: error.response.data.duplicateField
            });
        }
        return rejectWithValue({
            error: "An unexpected error occurred",
            status: 500
        });
    }
});

// Async thunk for deleting a vehicle
export const deleteVehicle = createAsyncThunk<string, string>("vehicles/deleteVehicle", async (vehicleId, { rejectWithValue }) => {
    try {
        await axiosInstance.delete(`/vehicles/${vehicleId}`);
        return vehicleId; // Returning vehicleId to delete from state
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return rejectWithValue(error.response.data);
        }
        return rejectWithValue(error);
    }
});

// Enum for inspector status
export enum VehicleType {
    SEDAN = "sedan",
    SUV = "suv",
    TRUCK = "truck",
    MUSCLE = "muscle",
}

export enum Transmission {
    MANUAL = "manual",
    AUTOMATIC = "automatic"
}

// Vehicle interface
export interface Vehicle {
    _id: string;
    make: string;
    vehicleModel: string;
    year: number;
    type: VehicleType;
    registrationNumber: string;
    chassisNumber: string;
    fuelType: "petrol" | "diesel" | "electric" | "hybrid";
    transmission: Transmission;
    insuranceExpiry?: Date;
    lastInspectionDate?: Date;
    frontViewImage?: string;
    rearViewImage?: string;
    color?: string;
}

// Vehicles state interface
interface VehiclesState {
    vehicles: Vehicle[];
    loading: boolean;
    error: string | null;
}

// Initial state
const initialState: VehiclesState = {
    vehicles: [],
    loading: false,
    error: null,
};

// Vehicles slice
const vehiclesSlice = createSlice({
    name: "vehicles",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addVehicle.pending, (state) => { state.loading = true; })
            .addCase(addVehicle.fulfilled, (state, action) => {
                state.vehicles.push(action.payload as Vehicle);
                state.loading = false;
            })
            .addCase(addVehicle.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(updateVehicle.pending, (state) => { state.loading = true; })
            .addCase(updateVehicle.fulfilled, (state, action) => {
                const index = state.vehicles.findIndex(vehicle => vehicle._id === action.payload._id);
                if (index !== -1) {
                    state.vehicles[index] = action.payload as Vehicle;
                }
                state.loading = false;
            })
            .addCase(updateVehicle.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(deleteVehicle.pending, (state) => { state.loading = true; })
            .addCase(deleteVehicle.fulfilled, (state, action) => {
                state.vehicles = state.vehicles.filter(vehicle => vehicle._id !== action.payload);
                state.loading = false;
            })
            .addCase(deleteVehicle.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            // Fetch Vehicles
            .addCase(fetchVehicles.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchVehicles.fulfilled, (state, action) => {
                state.vehicles = action.payload as Vehicle[];
                state.loading = false;
            })
            .addCase(fetchVehicles.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            });
    }
});

export default vehiclesSlice.reducer;

