import axios from "axios";

export const uploadToCloudinary = async (file: File | string): Promise<string> => {
    try {
        if (typeof file === 'string') {
            if (file.startsWith('http')) {
                return file;
            }
            throw new Error('Invalid file format');
        }
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
        const response = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        if (!response.data?.secure_url) {
            throw new Error('No secure URL received from Cloudinary');
        }
        return getTransformedImageUrl(response.data.secure_url);
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new Error('Failed to upload image');
    }

}



const getTransformedImageUrl = (url: string): string => {
    return url.replace('/upload/', '/upload/c_crop,g_auto:face,h_300,w_300/');
};