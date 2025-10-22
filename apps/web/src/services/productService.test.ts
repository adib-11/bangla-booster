/**
 * Tests for Product Service
 * Story 1.5 - Product Listing Submission
 */

import { createProduct } from './productService';
import { uploadProductImage } from './imageService';
import apiClient from './apiClient';

// Mock dependencies
jest.mock('./imageService');
jest.mock('./apiClient');

const mockUploadProductImage = uploadProductImage as jest.MockedFunction<typeof uploadProductImage>;
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('productService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uploads image and creates product successfully', async () => {
    const mockFile = new File(['image content'], 'test.jpg', { type: 'image/jpeg' });
    const mockImageUrl = 'https://blob.vercel-storage.com/test-abc123.jpg';
    const mockProduct = {
      id: 'product-123',
      ownerId: 'owner-123',
      title: 'Test Product',
      price: '19.99',
      imageUrl: mockImageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock image upload
    mockUploadProductImage.mockResolvedValue(mockImageUrl);
    
    // Mock API call
    mockApiClient.post.mockResolvedValue({ data: mockProduct });

    // Call service
    const result = await createProduct({
      title: 'Test Product',
      price: '19.99',
      image: mockFile,
    });

    // Assertions
    expect(uploadProductImage).toHaveBeenCalledWith(mockFile);
    expect(apiClient.post).toHaveBeenCalledWith('/products', {
      title: 'Test Product',
      price: '19.99',
      imageUrl: mockImageUrl,
    });
    expect(result).toEqual(mockProduct);
  });

  it('throws error when image is missing', async () => {
    await expect(
      createProduct({
        title: 'Test Product',
        price: '10.00',
        image: null,
      })
    ).rejects.toThrow('Image is required');

    expect(uploadProductImage).not.toHaveBeenCalled();
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it('handles image upload failure', async () => {
    const mockFile = new File(['image content'], 'test.jpg', { type: 'image/jpeg' });
    
    // Mock image upload error
    mockUploadProductImage.mockRejectedValue(new Error('Image upload failed'));

    await expect(
      createProduct({
        title: 'Test Product',
        price: '10.00',
        image: mockFile,
      })
    ).rejects.toThrow('Failed to upload image. Please try again.');

    expect(uploadProductImage).toHaveBeenCalledWith(mockFile);
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it('handles API error', async () => {
    const mockFile = new File(['image content'], 'test.jpg', { type: 'image/jpeg' });
    const mockImageUrl = 'https://blob.vercel-storage.com/test-abc123.jpg';
    
    // Mock successful upload
    mockUploadProductImage.mockResolvedValue(mockImageUrl);
    
    // Mock API error
    mockApiClient.post.mockRejectedValue(new Error('Network error'));

    await expect(
      createProduct({
        title: 'Test Product',
        price: '10.00',
        image: mockFile,
      })
    ).rejects.toThrow('Network error');

    expect(uploadProductImage).toHaveBeenCalledWith(mockFile);
    expect(apiClient.post).toHaveBeenCalledWith('/products', {
      title: 'Test Product',
      price: '10.00',
      imageUrl: mockImageUrl,
    });
  });
});
