/**
 * Image Upload Service
 * Handles uploading product images to Vercel Blob storage
 */

import { put } from '@vercel/blob';

/**
 * Upload a product image to Vercel Blob storage
 * @param file - The image file to upload
 * @returns The public URL of the uploaded image
 * @throws Error if upload fails or token is missing
 */
export async function uploadProductImage(file: File): Promise<string> {
  try {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size exceeds 5MB limit.');
    }

    // Check for token
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      console.error('BLOB_READ_WRITE_TOKEN is not configured');
      throw new Error('Image upload service is not configured');
    }

    // Generate unique filename to prevent overwrites
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const uniqueFilename = `product-${timestamp}-${randomString}.${fileExtension}`;

    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, file, {
      access: 'public',
      token: token,
    });

    return blob.url;
  } catch (error) {
    console.error('Image upload failed:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to upload image');
  }
}
