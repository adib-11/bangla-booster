/**
 * Product Service
 * Handles product-related operations including creation
 */

import apiClient from './apiClient';
import { uploadProductImage } from './imageService';
import { Product, ProductInput } from '../../../../packages/shared/src/types';

/**
 * Create a new product
 * Uploads the image first, then creates the product via API
 * 
 * @param data - Product input data including title, price, and image file
 * @returns Created product object
 * @throws Error if image is missing, upload fails, or API call fails
 */
export async function createProduct(data: ProductInput): Promise<Product> {
  // Validate image is provided
  if (!data.image) {
    throw new Error('Image is required');
  }

  try {
    // Upload image to Vercel Blob
    const imageUrl = await uploadProductImage(data.image);

    // Create product via API
    const response = await apiClient.post<Product>('/products', {
      title: data.title,
      price: data.price,
      imageUrl,
    });

    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Provide user-friendly error messages
    if (error instanceof Error) {
      if (error.message.includes('upload') || error.message.includes('file') || error.message.includes('size') || error.message.includes('type')) {
        throw new Error('Failed to upload image. Please try again.');
      }
      throw error;
    }
    
    throw new Error('Failed to create product. Please try again.');
  }
}
