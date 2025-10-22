import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { checkSubdomainAvailability } from '@/lib/db';

/**
 * GET /api/owner/subdomain/check
 * Check if a subdomain is available
 * 
 * Query params:
 * - subdomain: string (required)
 * 
 * Returns:
 * - 200: { available: boolean, subdomain: string }
 * - 400: { error: { message: string } }
 * - 401: { error: { message: string } }
 * - 500: { error: { message: string } }
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return Response.json(
        { error: { message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    // Get subdomain from query params
    const { searchParams } = new URL(request.url);
    const subdomain = searchParams.get('subdomain');

    if (!subdomain) {
      return Response.json(
        { error: { message: 'Subdomain parameter is required' } },
        { status: 400 }
      );
    }

    // Validate subdomain format
    if (!subdomain.trim() || subdomain.length < 3 || subdomain.length > 63) {
      return Response.json(
        { error: { message: 'Subdomain must be between 3 and 63 characters' } },
        { status: 400 }
      );
    }

    // Check if subdomain is available
    const available = await checkSubdomainAvailability(subdomain);

    return Response.json(
      { available, subdomain },
      { status: 200 }
    );
  } catch (error) {
    console.error('Subdomain availability check error:', error);
    return Response.json(
      { error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
