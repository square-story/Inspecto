import { InspectionTypeCreateValues, InspectionTypeEditValues } from "../types";

export const defaultCreateValues: InspectionTypeCreateValues = {
    name: "",
    price: 50,
    platformFee: 50,
    duration: "",
    features: [],
    fields: [],
    isActive: true,
};

export const defaultEditValues: InspectionTypeEditValues = {
    price: 50,
    platformFee: 50,
    duration: "",
    features: [],
    fields: [],
    isActive: true,
};
