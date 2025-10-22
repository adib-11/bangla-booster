/**
 * Tests for POST /api/products endpoint
 * Story 1.5 - Product Listing Submission
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { POST } from './route';
import { getServerSession } from 'next-auth/next';
import { createProduct } from '@/lib/db';

// Mock dependencies
jest.mock('next-auth/next');
jest.mock('@/lib/db');

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockCreateProduct = createProduct as jest.MockedFunction<typeof createProduct>;

describe('POST /api/products', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates product with valid data and authentication', async () => {
    // Mock authenticated session
    mockGetServerSession.mockResolvedValue({
      user: { id: 'owner-123', email: 'owner@test.com', name: 'Test Owner' },
      expires: '2025-12-31'
    } as any);

    // Mock database response
    const mockProduct = {
      id: 'product-123',
      ownerId: 'owner-123',
      title: 'Test Product',
      price: '19.99',
      imageUrl: 'https://blob.url/image.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockCreateProduct.mockResolvedValue(mockProduct);

    // Create request
    const request = new NextRequest('http://localhost:3000/api/products', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test Product',
        price: '19.99',
        imageUrl: 'https://blob.url/image.jpg',
      }),
    });

    // Call handler
    const response = await POST(request);
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(201);
    expect(data.id).toBe('product-123');
    expect(data.title).toBe('Test Product');
    expect(mockCreateProduct).toHaveBeenCalledWith(
      'owner-123',
      'Test Product',
      '19.99',
      'https://blob.url/image.jpg'
    );
  });

  it('returns 401 when not authenticated', async () => {
    // Mock no session
    mockGetServerSession.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/products', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test Product',
        price: '10.00',
        imageUrl: 'https://blob.url/image.jpg',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error.code).toBe('UNAUTHORIZED');
    expect(mockCreateProduct).not.toHaveBeenCalled();
  });

  it('returns 400 with invalid price format', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'owner-123', email: 'owner@test.com', name: 'Test Owner' },
      expires: '2025-12-31'
    } as any);

    const request = new NextRequest('http://localhost:3000/api/products', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test Product',
        price: 'invalid-price',
        imageUrl: 'https://blob.url/image.jpg',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.code).toBe('INVALID_INPUT');
    expect(mockCreateProduct).not.toHaveBeenCalled();
  });

  it('returns 400 when title is too long', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'owner-123', email: 'owner@test.com', name: 'Test Owner' },
      expires: '2025-12-31'
    } as any);

    const longTitle = 'a'.repeat(201);
    const request = new NextRequest('http://localhost:3000/api/products', {
      method: 'POST',
      body: JSON.stringify({
        title: longTitle,
        price: '10.00',
        imageUrl: 'https://blob.url/image.jpg',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.code).toBe('INVALID_INPUT');
    expect(mockCreateProduct).not.toHaveBeenCalled();
  });

  it('returns 400 with invalid imageUrl', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'owner-123', email: 'owner@test.com', name: 'Test Owner' },
      expires: '2025-12-31'
    } as any);

    const request = new NextRequest('http://localhost:3000/api/products', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test Product',
        price: '10.00',
        imageUrl: 'not-a-valid-url',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.code).toBe('INVALID_INPUT');
    expect(mockCreateProduct).not.toHaveBeenCalled();
  });

  it('returns 500 when database error occurs', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'owner-123', email: 'owner@test.com', name: 'Test Owner' },
      expires: '2025-12-31'
    } as any);

    // Mock database error
    mockCreateProduct.mockRejectedValue(new Error('Database connection failed'));

    const request = new NextRequest('http://localhost:3000/api/products', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test Product',
        price: '10.00',
        imageUrl: 'https://blob.url/image.jpg',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error.code).toBe('INTERNAL_SERVER_ERROR');
  });
});
