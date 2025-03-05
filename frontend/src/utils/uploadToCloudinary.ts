import axios from "axios";

export const uploadToCloudinary = async (file: File): Promise<string> => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (!response.data?.public_id) {
            throw new Error("No public ID received from Cloudinary");
        }

        return response.data.public_id;  // ✅ Store only the public_id
    } catch (error) {
        console.error("Cloudinary Upload Failure:", {
            file: file.name,
            size: file.size,
            error
        });
        throw new Error(`File upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
