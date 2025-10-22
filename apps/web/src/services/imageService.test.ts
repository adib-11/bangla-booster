/**
 * Tests for Image Upload Service
 * Story 1.5 - Product Listing Submission
 */

import { uploadProductImage } from './imageService';
import { put } from '@vercel/blob';

// Mock Vercel Blob
jest.mock('@vercel/blob');

const mockPut = put as jest.MockedFunction<typeof put>;

describe('imageService', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    // Set up environment with token
    process.env = { ...originalEnv, BLOB_READ_WRITE_TOKEN: 'test-token' };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('uploads image successfully', async () => {
    const mockFile = new File(['image content'], 'test.jpg', { type: 'image/jpeg' });
    const mockBlobUrl = 'https://blob.vercel-storage.com/test-abc123.jpg';

    mockPut.mockResolvedValue({ url: mockBlobUrl } as any);

    const result = await uploadProductImage(mockFile);

    expect(result).toBe(mockBlobUrl);
    expect(mockPut).toHaveBeenCalledWith(
      expect.stringContaining('product-'),
      mockFile,
      {
        access: 'public',
        token: 'test-token',
      }
    );
  });

  it('rejects invalid file type', async () => {
    const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });

    await expect(uploadProductImage(mockFile)).rejects.toThrow(
      'Invalid file type. Only JPEG, PNG, and WebP images are allowed.'
    );

    expect(mockPut).not.toHaveBeenCalled();
  });

  it('rejects file larger than 5MB', async () => {
    // Create a mock file with size > 5MB
    const mockFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', {
      type: 'image/jpeg',
    });
    Object.defineProperty(mockFile, 'size', { value: 6 * 1024 * 1024 });

    await expect(uploadProductImage(mockFile)).rejects.toThrow(
      'File size exceeds 5MB limit.'
    );

    expect(mockPut).not.toHaveBeenCalled();
  });

  it('throws error when BLOB_READ_WRITE_TOKEN is missing', async () => {
    delete process.env.BLOB_READ_WRITE_TOKEN;

    const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

    await expect(uploadProductImage(mockFile)).rejects.toThrow(
      'Image upload service is not configured'
    );

    expect(mockPut).not.toHaveBeenCalled();
  });

  it('handles upload failure from Vercel Blob', async () => {
    const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

    mockPut.mockRejectedValue(new Error('Network error'));

    await expect(uploadProductImage(mockFile)).rejects.toThrow('Network error');
  });

  it('accepts JPEG file type', async () => {
    const mockFile = new File(['content'], 'test.jpeg', { type: 'image/jpeg' });
    mockPut.mockResolvedValue({ url: 'https://blob.url/test.jpeg' } as any);

    await uploadProductImage(mockFile);

    expect(mockPut).toHaveBeenCalled();
  });

  it('accepts PNG file type', async () => {
    const mockFile = new File(['content'], 'test.png', { type: 'image/png' });
    mockPut.mockResolvedValue({ url: 'https://blob.url/test.png' } as any);

    await uploadProductImage(mockFile);

    expect(mockPut).toHaveBeenCalled();
  });

  it('accepts WebP file type', async () => {
    const mockFile = new File(['content'], 'test.webp', { type: 'image/webp' });
    mockPut.mockResolvedValue({ url: 'https://blob.url/test.webp' } as any);

    await uploadProductImage(mockFile);

    expect(mockPut).toHaveBeenCalled();
  });
});
