import { useState, useEffect, useRef } from 'react';
import { getSecureImageUrl } from '@/utils/cloudinary';

type ImageType = 'certificate' | 'signature' | 'face' | 'none';

// Global cache for signed URLs
const urlCache = new Map<string, { url: string; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

function getCacheKey(publicId: string, type: ImageType): string {
    return `${publicId}-${type}`;
}

function getCachedUrl(publicId: string, type: ImageType): string | null {
    const cacheKey = getCacheKey(publicId, type);
    const cached = urlCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.url;
    }

    // Clean expired cache entry
    if (cached) {
        urlCache.delete(cacheKey);
    }

    return null;
}

function setCachedUrl(publicId: string, type: ImageType, url: string): void {
    const cacheKey = getCacheKey(publicId, type);
    urlCache.set(cacheKey, { url, timestamp: Date.now() });
}

export function useSignedImage(
    publicId: string | null | undefined,
    type: ImageType = 'none'
) {
    const [imageUrl, setImageUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(!!publicId);
    const [error, setError] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (!publicId) {
            setImageUrl('');
            setIsLoading(false);
            setError(null);
            return;
        }

        // Check cache first
        const cachedUrl = getCachedUrl(publicId, type);
        if (cachedUrl) {
            setImageUrl(cachedUrl);
            setIsLoading(false);
            setError(null);
            return;
        }

        // Cancel previous request if exists
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new abort controller for this request
        abortControllerRef.current = new AbortController();
        const currentController = abortControllerRef.current;

        setIsLoading(true);
        setError(null);

        getSecureImageUrl(publicId, type)
            .then((url) => {
                if (!currentController.signal.aborted) {
                    setImageUrl(url);
                    setCachedUrl(publicId, type, url);
                    setError(null);
                }
            })
            .catch((err) => {
                if (!currentController.signal.aborted) {
                    console.error('Error loading signed image:', err);
                    setError('Failed to load image');
                    setImageUrl('');
                }
            })
            .finally(() => {
                if (!currentController.signal.aborted) {
                    setIsLoading(false);
                }
            });

        // Cleanup function
        return () => {
            if (currentController) {
                currentController.abort();
            }
        };
    }, [publicId, type]);

    return { imageUrl, isLoading, error };
}
