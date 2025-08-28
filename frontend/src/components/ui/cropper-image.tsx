'use client';
import {
    ImageCrop,
    ImageCropApply,
    ImageCropContent,
    ImageCropReset,
} from '@/components/ui/kibo-ui/image-crop';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { XIcon, Upload } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { getSecureImageUrl } from '@/utils/cloudinary';
import { uploadToCloudinary } from '@/utils/uploadToCloudinary';
import LoadingSpinner from '../LoadingSpinner';

const CropImage = ({
    onImageUpload,
    defaultImage = null,
}: {
    onImageUpload: (url: string | null) => void;
    defaultImage?: string | null;
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [finalImage, setFinalImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Load default image
    useEffect(() => {
        const loadDefaultImage = async () => {
            if (defaultImage) {
                setIsLoading(true);
                try {
                    const signedUrl = await getSecureImageUrl(defaultImage, 'none');
                    setFinalImage(signedUrl);
                } catch (err) {
                    console.error('Error loading default image:', err);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        loadDefaultImage();
    }, [defaultImage]);

    // Handle new file select
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        setSelectedFile(file);
        setFinalImage(null); // Clear final image when selecting new file
    };

    // Reset state
    const handleReset = () => {
        setSelectedFile(null);
        setFinalImage(null);
        onImageUpload(null);
        // Clear file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        toast.success('Image removed successfully!');
    };

    // Handle change image button click
    const handleChangeImage = () => {
        // Clear current states but keep the final image until new one is selected
        setSelectedFile(null);
        // Clear file input and trigger click
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
            fileInputRef.current.click();
        }
    };

    // Upload cropped image
    const handleCropAndUpload = async (croppedImageUrl: string | null) => {
        // This is your crop callback
        if (!croppedImageUrl) {
            toast.error('Please crop the image first');
            return;
        }
        setIsUploading(true);
        try {
            const response = await fetch(croppedImageUrl);
            const blob = await response.blob();
            const file = new File([blob], 'cropped-profile.jpg', { type: 'image/jpeg' });

            const publicId = await uploadToCloudinary(file);
            const signedUrl = await getSecureImageUrl(publicId, 'none');
            setFinalImage(signedUrl);
            setSelectedFile(null);
            onImageUpload(publicId);
            toast.success('Image uploaded successfully!');
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    // Loading spinner
    if (isLoading) {
        return (
            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gray-100">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <Input
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                type="file"
            />

            {/* Show uploaded/final image */}
            {finalImage && !selectedFile && (
                <div className="space-y-4">
                    <img
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                        src={finalImage}
                    />
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleChangeImage}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Change Image
                        </Button>
                        <Button
                            onClick={handleReset}
                            size="sm"
                            type="button"
                            variant="ghost"
                            title="Remove image"
                        >
                            <XIcon className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Show file input when no image is selected */}
            {!selectedFile && !finalImage && (
                <div className="space-y-4">
                    <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300">
                        <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Select Image
                    </Button>
                </div>
            )}

            {/* Cropping interface */}
            {selectedFile && (
                <div className="space-y-4">
                    <ImageCrop
                        aspect={1}
                        circularCrop
                        file={selectedFile}
                        maxImageSize={5 * 1024 * 1024}
                        onCrop={handleCropAndUpload}
                    >
                        <ImageCropContent className="max-w-md" />
                        <div className="flex items-center gap-2">
                            <ImageCropApply disabled={isUploading} />
                            <ImageCropReset onClick={handleReset} />
                            <Button
                                onClick={() => {
                                    setSelectedFile(null);
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = '';
                                    }
                                }}
                                size="icon"
                                type="button"
                                variant="ghost"
                                title="Cancel cropping"
                            >
                                <XIcon className="size-4" />
                            </Button>
                        </div>
                    </ImageCrop>
                </div>
            )}
        </div>
    );
};

export default CropImage;