import { v2 as cloudinary } from "cloudinary";

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error(
    "Cloudinary env vars are not set. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to .env."
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Keeps product images grouped in their own Cloudinary folder rather
// than dumped at the account root, in case other features (e.g.
// customer avatars) ever upload through the same account.
const PRODUCT_IMAGE_FOLDER = "parampara-divya/products";

/**
 * Uploads an image buffer to Cloudinary and returns both its secure
 * URL (stored as products.image_url) and its public_id (stored as
 * products.image_public_id) — the public_id is what a later edit or
 * delete needs to remove/replace this exact asset, since the URL
 * alone isn't enough for that.
 */
export function uploadProductImage(
  buffer: Buffer
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: PRODUCT_IMAGE_FOLDER },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed."));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    uploadStream.end(buffer);
  });
}

/**
 * Best-effort delete of a previously-uploaded product image. Failures
 * are logged, not thrown — an orphaned Cloudinary asset is a much
 * smaller problem than a product edit/delete failing outright because
 * Cloudinary had a transient error.
 */
export async function deleteProductImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Failed to delete Cloudinary asset ${publicId}:`, error);
  }
}