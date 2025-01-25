import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InspectorState {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    profile_image: string;
    status: boolean;
    role: string;
    certificates: [string];
    yearOfExp: number;
    phone: string;
    signature: string;
    specialization: [string],
    start_time: string;
    end_time: string;
    avaliable_days: number;
    isListed: boolean;
    isCompleted: boolean;
}

const initialState: InspectorState = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    profile_image: '',
    status: false,
    role: '',
    certificates: [''],
    yearOfExp: 0,
    phone: '',
    signature: '',
    specialization: [''],
    start_time: '',
    end_time: '',
    avaliable_days: 0,
    isListed: false,
    isCompleted: false,
};

const inspectorSlice = createSlice({
    name: 'inspector',
    initialState,
    reducers: {
        setFirstName(state, action: PayloadAction<string>) {
            state.firstName = action.payload;
        },
        setLastName(state, action: PayloadAction<string>) {
            state.lastName = action.payload;
        },
        setEmail(state, action: PayloadAction<string>) {
            state.email = action.payload;
        },
        setAddress(state, action: PayloadAction<string>) {
            state.address = action.payload;
        },
        setProfileImage(state, action: PayloadAction<string>) {
            state.profile_image = action.payload;
        },
        setStatus(state, action: PayloadAction<boolean>) {
            state.status = action.payload;
        },
        setRole(state, action: PayloadAction<string>) {
            state.role = action.payload;
        },
        setCertificates(state, action: PayloadAction<[string]>) {
            state.certificates = action.payload;
        },
        setYearOfExp(state, action: PayloadAction<number>) {
            state.yearOfExp = action.payload;
        },
        setPhone(state, action: PayloadAction<string>) {
            state.phone = action.payload;
        },
        setSignature(state, action: PayloadAction<string>) {
            state.signature = action.payload;
        },
        setSpecialization(state, action: PayloadAction<[string]>) {
            state.specialization = action.payload;
        },
        setStartTime(state, action: PayloadAction<string>) {
            state.start_time = action.payload;
        },
        setEndTime(state, action: PayloadAction<string>) {
            state.end_time = action.payload;
        },
        setAvaliableDays(state, action: PayloadAction<number>) {
            state.avaliable_days = action.payload;
        },
        setIsListed(state, action: PayloadAction<boolean>) {
            state.isListed = action.payload;
        },
        setIsCompleted(state, action: PayloadAction<boolean>) {
            state.isCompleted = action.payload;
        },
        setInspector(state, action: PayloadAction<InspectorState>) {
            return { ...state, ...action.payload };
        }
    },
});

export const {
    setFirstName,
    setLastName,
    setEmail,
    setAddress,
    setProfileImage,
    setStatus,
    setRole,
    setCertificates,
    setYearOfExp,
    setPhone,
    setSignature,
    setSpecialization,
    setStartTime,
    setEndTime,
    setAvaliableDays,
    setIsListed,
    setIsCompleted,
    setInspector
} = inspectorSlice.actions;

export default inspectorSlice.reducer;


