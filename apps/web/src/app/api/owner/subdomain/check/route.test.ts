/**
 * @jest-environment node
 */
import { GET } from './route';
import { getServerSession } from 'next-auth/next';
import { checkSubdomainAvailability } from '@/lib/db';
import { NextRequest } from 'next/server';

// Mock dependencies
jest.mock('next-auth/next');
jest.mock('@/lib/db');

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockCheckSubdomainAvailability = checkSubdomainAvailability as jest.MockedFunction<typeof checkSubdomainAvailability>;

describe('GET /api/owner/subdomain/check', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 401 for unauthenticated requests', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const request = new NextRequest('http://localhost/api/owner/subdomain/check?subdomain=test-shop');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error.message).toBe('Unauthorized');
  });

  it('returns 400 when subdomain parameter is missing', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2025-12-31',
    });

    const request = new NextRequest('http://localhost/api/owner/subdomain/check');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.message).toBe('Subdomain parameter is required');
  });

  it('returns 400 for subdomain too short', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2025-12-31',
    });

    const request = new NextRequest('http://localhost/api/owner/subdomain/check?subdomain=ab');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.message).toContain('between 3 and 63 characters');
  });

  it('returns 400 for subdomain too long', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2025-12-31',
    });

    const longSubdomain = 'a'.repeat(64);
    const request = new NextRequest(`http://localhost/api/owner/subdomain/check?subdomain=${longSubdomain}`);
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.message).toContain('between 3 and 63 characters');
  });

  it('returns available true when subdomain is available', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2025-12-31',
    });
    mockCheckSubdomainAvailability.mockResolvedValue(true);

    const request = new NextRequest('http://localhost/api/owner/subdomain/check?subdomain=test-shop');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.available).toBe(true);
    expect(data.subdomain).toBe('test-shop');
    expect(mockCheckSubdomainAvailability).toHaveBeenCalledWith('test-shop');
  });

  it('returns available false when subdomain is taken', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2025-12-31',
    });
    mockCheckSubdomainAvailability.mockResolvedValue(false);

    const request = new NextRequest('http://localhost/api/owner/subdomain/check?subdomain=existing-shop');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.available).toBe(false);
    expect(data.subdomain).toBe('existing-shop');
  });

  it('returns 500 on database error', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2025-12-31',
    });
    mockCheckSubdomainAvailability.mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost/api/owner/subdomain/check?subdomain=test-shop');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error.message).toBe('Internal server error');
  });
});
