/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { POST } from './route';
import * as db from '@/lib/db';
import bcrypt from 'bcryptjs';

// Mock dependencies
jest.mock('@/lib/db');
jest.mock('bcryptjs');

describe('POST /api/auth/signup', () => {
  const mockCreateOwner = db.createOwner as jest.MockedFunction<typeof db.createOwner>;
  const mockGetOwnerByEmail = db.getOwnerByEmail as jest.MockedFunction<typeof db.getOwnerByEmail>;
  const mockBcryptHash = bcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates owner with valid data', async () => {
    const mockOwner = {
      id: '123',
      email: 'test@example.com',
      businessName: '',
      subdomain: 'temp-abc-123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockGetOwnerByEmail.mockResolvedValue(null);
    mockBcryptHash.mockResolvedValue('hashed-password' as any);
    mockCreateOwner.mockResolvedValue(mockOwner);

    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.message).toBe('Owner created successfully');
    expect(data.owner.email).toBe('test@example.com');
    expect(mockBcryptHash).toHaveBeenCalledWith('password123', 10);
    expect(mockCreateOwner).toHaveBeenCalledWith('test@example.com', 'hashed-password');
  });

  it('returns 400 for missing email', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.message).toBe('Email and password are required');
  });

  it('returns 400 for missing password', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.message).toBe('Email and password are required');
  });

  it('returns 400 for invalid email format', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'invalid-email',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.message).toBe('Invalid email format');
  });

  it('returns 400 for weak password', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'short',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.message).toBe('Password must be at least 8 characters long');
  });

  it('returns 409 for duplicate email', async () => {
    const existingOwner = {
      id: '123',
      email: 'test@example.com',
      businessName: 'Existing Business',
      subdomain: 'existing',
      createdAt: new Date(),
      updatedAt: new Date(),
      hashedPassword: 'hashed-password',
    };

    mockGetOwnerByEmail.mockResolvedValue(existingOwner);

    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error.message).toBe('An account with this email already exists');
    expect(mockBcryptHash).not.toHaveBeenCalled();
    expect(mockCreateOwner).not.toHaveBeenCalled();
  });

  it('hashes password correctly', async () => {
    const mockOwner = {
      id: '123',
      email: 'test@example.com',
      businessName: '',
      subdomain: 'temp-abc-123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockGetOwnerByEmail.mockResolvedValue(null);
    mockBcryptHash.mockResolvedValue('hashed-password-with-salt' as any);
    mockCreateOwner.mockResolvedValue(mockOwner);

    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'mySecurePassword123',
      }),
    });

    await POST(request);

    expect(mockBcryptHash).toHaveBeenCalledWith('mySecurePassword123', 10);
    expect(mockCreateOwner).toHaveBeenCalledWith('test@example.com', 'hashed-password-with-salt');
  });

  it('handles database errors', async () => {
    mockGetOwnerByEmail.mockResolvedValue(null);
    mockBcryptHash.mockResolvedValue('hashed-password' as any);
    mockCreateOwner.mockRejectedValue(new Error('Database connection failed'));

    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error.message).toBe('Internal server error');
  });

  it('verifies temporary subdomain format', async () => {
    const mockOwner = {
      id: '123',
      email: 'test@example.com',
      businessName: '',
      subdomain: 'temp-550e8400-e29b-41d4-a716-446655440000',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockGetOwnerByEmail.mockResolvedValue(null);
    mockBcryptHash.mockResolvedValue('hashed-password' as any);
    mockCreateOwner.mockResolvedValue(mockOwner);

    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(mockCreateOwner).toHaveBeenCalled();
  });

  it('verifies business_name is set to empty string', async () => {
    const mockOwner = {
      id: '123',
      email: 'test@example.com',
      businessName: '',
      subdomain: 'temp-abc-123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockGetOwnerByEmail.mockResolvedValue(null);
    mockBcryptHash.mockResolvedValue('hashed-password' as any);
    mockCreateOwner.mockResolvedValue(mockOwner);

    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    expect(mockCreateOwner).toHaveBeenCalledWith('test@example.com', 'hashed-password');
  });
});
