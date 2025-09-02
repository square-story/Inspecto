import { InspectionTypeCreateValues, InspectionTypeEditValues } from "../types";

export const defaultCreateValues: InspectionTypeCreateValues = {
    name: "",
    price: 50,
    platformFee: 50,
    duration: "",
    features: [""],
    fields: [
        {
            label: "",
            type: "text",
            required: false,
            name: "",
            options: [],
        },
    ],
    isActive: true,
};

export const defaultEditValues: InspectionTypeEditValues = {
    price: 50,
    platformFee: 50,
    duration: "",
    features: [""],
    fields: [
        {
            label: "",
            type: "text",
            required: false,
            name: "",
            options: [],
        },
    ],
    isActive: true,
};
