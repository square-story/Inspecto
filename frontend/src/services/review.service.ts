import axiosInstance from "@/api/axios";
import { ReviewFormValues } from "@/components/ReviewComponent";
import { IReview } from "@/types/review";
import { AxiosError } from "axios";

export const ReviewService = {
    createReview: async (values: ReviewFormValues, user: string, inspector: string, inspection: string): Promise<IReview> => {
        const response = await axiosInstance.post('/reviews', {
            inspection,
            inspector,
            user,
            ...values
        });
        return response.data;
    },

    getInspectorReviews: async (inspectorId: string): Promise<IReview[]> => {
        if (!inspectorId) return [];
        const response = await axiosInstance.get(`/reviews/inspector/${inspectorId}`);
        return response.data.data || [];
    },
    getInspectorRating: async (inspectorId: string): Promise<{
        averageRating: number;
        totalReviews: number;
    }> => {
        if (!inspectorId) return { averageRating: 0, totalReviews: 0 };
        const response = await axiosInstance.get(`/reviews/inspector/${inspectorId}/rating`);
        return response.data.data;
    },
    getUserReviews: async (userId: string): Promise<IReview[]> => {
        const response = await axiosInstance.get(`/reviews/user/${userId}`);
        return response.data.reviews;
    },
    getInspectionReview: async (inspectionId: string): Promise<IReview> => {
        if (!inspectionId) throw new Error("Inspection ID cannot be null");
        try {
            const response = await axiosInstance.get(`/reviews/inspection/${inspectionId}`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) throw error.response?.data.message;

            throw new Error("An unexpected error occurred while fetching the inspection review.");
        }
    }
}