import axios from "axios";

export const uploadToCloudinary = async (
    file: File | string,
    transformationSettings?: { crop?: string; gravity?: string; width?: number; height?: number }
): Promise<string> => {
    try {
        // If the file is already a URL (for example, an image URL passed from another source)
        if (typeof file === 'string' && file.startsWith('http')) {
            return file;  // Return the URL directly if it's already transformed
        }

        if (!(file instanceof File)) {
            throw new Error('Invalid file type');
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        if (!response.data?.secure_url) {
            throw new Error('No secure URL received from Cloudinary');
        }

        // Apply transformation settings to the URL
        const transformedUrl = getTransformedImageUrl(response.data.secure_url, transformationSettings);

        return transformedUrl;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        throw new Error("Failed to upload image");
    }
};

const getTransformedImageUrl = (
    url: string,
    { crop = "crop", gravity = "auto:face", width = 300, height = 300 }: { crop?: string; gravity?: string; width?: number; height?: number } = {}
): string => {
    // Build the transformation string dynamically
    const transformation = `c_${crop},g_${gravity},h_${height},w_${width}`;

    // Apply the transformation to the original URL
    return url.replace('/upload/', `/upload/${transformation}/`);
};
