import { Cloudinary } from "@cloudinary/url-gen";
import { crop, fill } from "@cloudinary/url-gen/actions/resize";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { face } from "@cloudinary/url-gen/qualifiers/focusOn";

// Initialize Cloudinary
const cloudinary = new Cloudinary({
    cloud: { cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME },
});

/**
 * Returns a transformed Cloudinary image URL based on upload type.
 *
 * @param publicId - The Cloudinary public ID of the uploaded image.
 * @param uploadType - The type of image: "certificate", "signature", "default".
 */
export const getTransformedImageUrl = (
    publicId: string,
    uploadType: "certificate" | "signature" | "face" | "none" = "none"
): string => {
    let transformation;

    switch (uploadType) {
        case "certificate":
            // Resizes document-style images for certificates
            transformation = cloudinary
                .image(publicId)
                .resize(fill().width(800).height(600)); // Standard certificate size
            break;

        case "signature":
            // Crops and removes background for signatures
            transformation = cloudinary
                .image(publicId)
                .resize(crop().width(300).height(100).gravity(focusOn(face())))
            // Makes the background white
            break;

        case "face":
            transformation = cloudinary
                .image(publicId)
                .resize(
                    crop().width(300).height(300).gravity(focusOn(face())));
            break;
        default:
            transformation = cloudinary
                .image(publicId)
            break;
    }

    return transformation.toURL();
};
