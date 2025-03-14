import { IInspector, InspectorStatus, WeeklyAvailability } from '@/types/inspector';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: IInspector = {
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    password: null,
    address: '',
    profile_image: '',
    status: InspectorStatus.PENDING,
    role: '',
    certificates: [''],
    yearOfExp: 0,
    phone: '',
    signature: '',
    specialization: [''],
    availableSlots: {
        Monday: { enabled: false, slots: 0 },
        Tuesday: { enabled: false, slots: 0 },
        Wednesday: { enabled: false, slots: 0 },
        Thursday: { enabled: false, slots: 0 },
        Friday: { enabled: false, slots: 0 },
        Saturday: { enabled: false, slots: 0 },
    },
    bookedSlots: [],
    isListed: false,
    isCompleted: false,
    approvedAt: undefined,
    deniedAt: undefined,
    denialReason: undefined,
    coverageRadius: 0,
    serviceAreas: [''],
    createdAt: new Date(),
    updatedAt: new Date(),
    location: {
        type: 'Point',
        coordinates: [0, 0],
    },
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
        setStatus(state, action: PayloadAction<InspectorStatus>) {
            state.status = action.payload;
        },
        setRole(state, action: PayloadAction<string>) {
            state.role = action.payload;
        },
        setCertificates(state, action: PayloadAction<string[]>) {
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
        setSpecialization(state, action: PayloadAction<string[]>) {
            state.specialization = action.payload;
        },
        setAvailableSlots(state, action: PayloadAction<WeeklyAvailability>) {
            state.availableSlots = action.payload;
        },
        setBookedSlots(state, action: PayloadAction<IInspector['bookedSlots']>) {
            state.bookedSlots = action.payload;
        },
        setIsListed(state, action: PayloadAction<boolean>) {
            state.isListed = action.payload;
        },
        setIsCompleted(state, action: PayloadAction<boolean>) {
            state.isCompleted = action.payload;
        },
        setApprovedAt(state, action: PayloadAction<Date | undefined>) {
            state.approvedAt = action.payload;
        },
        setDeniedAt(state, action: PayloadAction<Date | undefined>) {
            state.deniedAt = action.payload;
        },
        setDenialReason(state, action: PayloadAction<string | undefined>) {
            state.denialReason = action.payload;
        },
        setCoverageRadius(state, action: PayloadAction<number>) {
            state.coverageRadius = action.payload;
        },
        setServiceAreas(state, action: PayloadAction<string[]>) {
            state.serviceAreas = action.payload;
        },
        setLocation(state, action: PayloadAction<IInspector['location']>) {
            state.location = action.payload;
        },
        setInspector(state, action: PayloadAction<IInspector>) {
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
    setAvailableSlots,
    setBookedSlots,
    setIsListed,
    setIsCompleted,
    setApprovedAt,
    setDeniedAt,
    setDenialReason,
    setCoverageRadius,
    setServiceAreas,
    setLocation,
    setInspector
} = inspectorSlice.actions;

export default inspectorSlice.reducer;


