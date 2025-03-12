import axiosInstance from "@/api/axios"

export const getSignedImageUrl = async (
    publicId: string,
    type: "certificate" | "signature" | "face" | "none" = "none"): Promise<string> => {

    try {
        const response = await axiosInstance.get('/cloudinary/signed-url', { params: { publicId, type } })
        return response.data.signedUrl;
    } catch (error) {
        console.error('Error fetching signed URL:', error);
        throw new Error('Failed to get signed image URL');
    }
}

export const getSecureImageUrl = async (
    publicId: string,
    uploadType: "certificate" | "signature" | "face" | "none" = "none"): Promise<string> => {
    if (!publicId) return '';
    try {
        return await getSignedImageUrl(publicId, uploadType);
    } catch (error) {
        console.error('Error getting secure image URL:', error);
        return '';
    }
}