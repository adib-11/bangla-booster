/**
 * @jest-environment node
 */
import { POST } from './route';
import { getServerSession } from 'next-auth/next';
import { checkSubdomainAvailability, updateOwnerSubdomain } from '@/lib/db';

// Mock dependencies
jest.mock('next-auth/next');
jest.mock('@/lib/db');

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockCheckSubdomainAvailability = checkSubdomainAvailability as jest.MockedFunction<typeof checkSubdomainAvailability>;
const mockUpdateOwnerSubdomain = updateOwnerSubdomain as jest.MockedFunction<typeof updateOwnerSubdomain>;

describe('POST /api/owner/subdomain', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 401 for unauthenticated requests', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const request = new Request('http://localhost/api/owner/subdomain', {
      method: 'POST',
      body: JSON.stringify({ businessName: 'Test Shop' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error.message).toBe('Unauthorized');
  });

  it('returns 400 when business name is missing', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2025-12-31',
    });

    const request = new Request('http://localhost/api/owner/subdomain', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.message).toBe('Business name is required');
  });

  it('returns 400 when business name is empty', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2025-12-31',
    });

    const request = new Request('http://localhost/api/owner/subdomain', {
      method: 'POST',
      body: JSON.stringify({ businessName: '   ' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.message).toBe('Business name cannot be empty');
  });

  it('returns 400 when business name is too long', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2025-12-31',
    });

    const longName = 'A'.repeat(101);
    const request = new Request('http://localhost/api/owner/subdomain', {
      method: 'POST',
      body: JSON.stringify({ businessName: longName }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.message).toContain('100 characters or less');
  });

  it('returns 400 when generated subdomain is too short', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2025-12-31',
    });

    const request = new Request('http://localhost/api/owner/subdomain', {
      method: 'POST',
      body: JSON.stringify({ businessName: '!!!' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.message).toContain('at least 3 alphanumeric characters');
  });

  it('provisions subdomain with valid business name', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2025-12-31',
    });
    mockCheckSubdomainAvailability.mockResolvedValue(true);
    mockUpdateOwnerSubdomain.mockResolvedValue({
      id: 'user-123',
      email: 'test@example.com',
      businessName: 'Test Shop',
      subdomain: 'test-shop',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new Request('http://localhost/api/owner/subdomain', {
      method: 'POST',
      body: JSON.stringify({ businessName: 'Test Shop' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.subdomain).toBe('test-shop');
    expect(mockCheckSubdomainAvailability).toHaveBeenCalledWith('test-shop');
    expect(mockUpdateOwnerSubdomain).toHaveBeenCalledWith('user-123', 'Test Shop', 'test-shop');
  });

  it('returns 409 when subdomain is already taken', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2025-12-31',
    });
    mockCheckSubdomainAvailability.mockResolvedValue(false);

    const request = new Request('http://localhost/api/owner/subdomain', {
      method: 'POST',
      body: JSON.stringify({ businessName: 'Existing Shop' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error.message).toContain('already taken');
    expect(mockUpdateOwnerSubdomain).not.toHaveBeenCalled();
  });

  it('handles database unique constraint violation', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2025-12-31',
    });
    mockCheckSubdomainAvailability.mockResolvedValue(true);
    
    const dbError: any = new Error('Unique constraint violation');
    dbError.code = '23505';
    mockUpdateOwnerSubdomain.mockRejectedValue(dbError);

    const request = new Request('http://localhost/api/owner/subdomain', {
      method: 'POST',
      body: JSON.stringify({ businessName: 'Test Shop' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error.message).toContain('already taken');
  });

  it('returns 500 on other database errors', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2025-12-31',
    });
    mockCheckSubdomainAvailability.mockResolvedValue(true);
    mockUpdateOwnerSubdomain.mockRejectedValue(new Error('Database error'));

    const request = new Request('http://localhost/api/owner/subdomain', {
      method: 'POST',
      body: JSON.stringify({ businessName: 'Test Shop' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error.message).toBe('Internal server error');
  });

  it('trims whitespace from business name', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2025-12-31',
    });
    mockCheckSubdomainAvailability.mockResolvedValue(true);
    mockUpdateOwnerSubdomain.mockResolvedValue({
      id: 'user-123',
      email: 'test@example.com',
      businessName: 'Test Shop',
      subdomain: 'test-shop',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new Request('http://localhost/api/owner/subdomain', {
      method: 'POST',
      body: JSON.stringify({ businessName: '  Test Shop  ' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(mockUpdateOwnerSubdomain).toHaveBeenCalledWith('user-123', 'Test Shop', 'test-shop');
  });
});
