import React from 'react';
import { useSignedImage } from '@/hooks/useSignedImage';
import LoadingSpinner from '@/components/LoadingSpinner';

interface PhotoItemProps {
    photo: string;
    index: number;
}

// Create a separate component for each photo item
const PhotoItem: React.FC<PhotoItemProps> = ({ photo, index }) => {
    const { imageUrl, isLoading, error } = useSignedImage(photo, "none");

    return (
        <div key={index} className="relative aspect-video rounded-md overflow-hidden">
            {isLoading ? (
                <div className="flex items-center justify-center w-full h-full bg-gray-200">
                    <LoadingSpinner />
                </div>
            ) : error ? (
                <div className="flex items-center justify-center w-full h-full bg-red-200">
                    <span>Error loading image</span>
                </div>
            ) : (
                <img
                    src={imageUrl || "/placeholder.svg"}
                    alt={`Inspection photo ${index + 1}`}
                    className="object-cover w-full h-full cursor-pointer"
                    onClick={() => window.open(imageUrl, "_blank")}
                />
            )}
        </div>
    );
};

interface PhotoGalleryProps {
    photos: string[];
}

// Main photo gallery component
export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
    if (!photos || photos.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <p>No photos available for this inspection</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {photos.map((photo, index) => (
                <PhotoItem key={`photo-${index}`} photo={photo} index={index} />
            ))}
        </div>
    );
};