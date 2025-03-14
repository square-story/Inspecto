import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ImageIcon, XCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary"; // Update path as needed
import { toast } from "sonner";
import { getSecureImageUrl } from "@/utils/cloudinary";

const ImagePreview = ({
    url,
    onRemove,
}: {
    url: string;
    onRemove: () => void;
}) => (
    <div className="relative aspect-square">
        <button
            className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
            onClick={onRemove}
        >
            <XCircleIcon className="h-5 w-5 fill-primary text-primary-foreground" />
        </button>
        <img
            src={url}
            height={500}
            width={500}
            alt=""
            className="border border-border h-full w-full rounded-md object-cover"
        />
    </div>
);

export default function ProfileDrop({
    onImageUpload,
    defaultImage,
    headerTitle = "Profile Image",
}: {
    onImageUpload: (url: string | null) => void;
    defaultImage: string;
    headerTitle?: string;
}) {
    const [profilePicture, setProfilePicture] = useState<string | null>(defaultImage);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSignedImage = async () => {
            if (defaultImage) {
                try {
                    const signedUrl = await getSecureImageUrl(defaultImage, 'none');
                    setProfilePicture(signedUrl);
                } catch (error) {
                    console.error('Failed to load signed image:', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        loadSignedImage();
    }, [defaultImage]);

    const handleDrop = async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            try {
                setIsUploading(true);
                const publicId = await uploadToCloudinary(file);
                // Get signed URL for the uploaded image
                const signedUrl = await getSecureImageUrl(publicId, 'none');
                setProfilePicture(signedUrl);
                onImageUpload(publicId)
                toast.success("Image uploaded successfully!");
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                toast.error("Failed to upload image.");
            } finally {
                setIsUploading(false);
            }
        }
    };

    return (
        <div className="w-full max-w-40">
            <Label htmlFor="profile">{headerTitle}</Label>
            <div className="mt-1 w-full">

                {isLoading ? (
                    <div className="flex items-center justify-center aspect-square border border-dashed rounded-md">
                        <p>Loading...</p>
                    </div>
                ) : profilePicture ? (
                    <ImagePreview
                        url={profilePicture}
                        onRemove={() => {
                            setProfilePicture(null);
                            onImageUpload(null);
                        }}
                    />
                ) : (
                    <Dropzone
                        onDrop={handleDrop}
                        accept={{
                            "image/png": [".png", ".jpg", ".jpeg", ".webp"],
                        }}
                        maxFiles={1}
                    >
                        {({
                            getRootProps,
                            getInputProps,
                            isDragActive,
                            isDragAccept,
                            isDragReject,
                        }) => (
                            <div
                                {...getRootProps()}
                                className={cn(
                                    "border border-dashed flex items-center justify-center aspect-square rounded-md focus:outline-none focus:border-primary",
                                    {
                                        "border-primary bg-secondary": isDragActive && isDragAccept,
                                        "border-destructive bg-destructive/20":
                                            isDragActive && isDragReject,
                                    }
                                )}
                            >
                                <input {...getInputProps()} id="profile" />
                                {isUploading ? (
                                    <p>Uploading...</p>
                                ) : (
                                    <ImageIcon className="h-16 w-16" strokeWidth={1.25} />
                                )}
                            </div>
                        )}
                    </Dropzone>
                )}
            </div>
        </div>
    );
}
