import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSignedImage } from '@/hooks/useSignedImage';
import { Skeleton } from '@/components/ui/skeleton';

interface SignedAvatarProps {
    publicId?: string | null;
    fallback?: string;
    className?: string;
    imageType?: 'certificate' | 'signature' | 'face' | 'none';
}

export function SignedAvatar({
    publicId,
    fallback = '',
    className = '',
    imageType = 'none'
}: SignedAvatarProps) {
    const { imageUrl, isLoading } = useSignedImage(publicId, imageType);

    // Generate initials for fallback
    const initials = fallback
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    if (isLoading) {
        return <Skeleton className={`h-10 w-10 rounded-full ${className}`} />;
    }

    return (
        <Avatar className={className}>
            {imageUrl && <AvatarImage src={imageUrl} alt={fallback || "User avatar"} />}
            <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
    );
}