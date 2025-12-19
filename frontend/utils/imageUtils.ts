import { PLACEHOLDER_IMG } from "../constants";

export function getImageUrl(product: any): string {
    // Defensive checks
    if (!product) return PLACEHOLDER_IMG;

    const images = product.images;

    // Must be an array
    if (!Array.isArray(images) || images.length === 0) {
        return PLACEHOLDER_IMG;
    }

    const firstImage = images[0];

    // Cloudinary object format
    if (typeof firstImage === "object" && firstImage.url) {
        return firstImage.url;
    }

    // Legacy string format
    if (typeof firstImage === "string") {
        return firstImage;
    }

    return PLACEHOLDER_IMG;
}
