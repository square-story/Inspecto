import { useState, useEffect } from 'react';
import { getSecureImageUrl } from '@/utils/cloudinary';

type ImageType = 'certificate' | 'signature' | 'face' | 'none';

export function useSignedImage(
    publicId: string | null | undefined,
    type: ImageType = 'none'
) {
    const [imageUrl, setImageUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(!!publicId);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!publicId) {
            setImageUrl('');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        getSecureImageUrl(publicId, type)
            .then((url) => {
                setImageUrl(url);
                setError(null);
            })
            .catch((err) => {
                console.error('Error loading signed image:', err);
                setError('Failed to load image');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [publicId, type]);

    return { imageUrl, isLoading, error };
}