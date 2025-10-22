import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { checkSubdomainAvailability, updateOwnerSubdomain } from '@/lib/db';
import { generateSubdomain } from '@/lib/utils';

/**
 * POST /api/owner/subdomain
 * Provision a subdomain for the authenticated owner
 * 
 * Request body:
 * - businessName: string (required)
 * 
 * Returns:
 * - 200: { subdomain: string }
 * - 400: { error: { message: string } }
 * - 401: { error: { message: string } }
 * - 409: { error: { message: string } }
 * - 500: { error: { message: string } }
 */
export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return Response.json(
        { error: { message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { businessName } = body;

    // Validate business name
    if (!businessName || typeof businessName !== 'string') {
      return Response.json(
        { error: { message: 'Business name is required' } },
        { status: 400 }
      );
    }

    const trimmedBusinessName = businessName.trim();

    if (!trimmedBusinessName) {
      return Response.json(
        { error: { message: 'Business name cannot be empty' } },
        { status: 400 }
      );
    }

    if (trimmedBusinessName.length > 100) {
      return Response.json(
        { error: { message: 'Business name must be 100 characters or less' } },
        { status: 400 }
      );
    }

    // Generate subdomain slug
    const subdomain = generateSubdomain(trimmedBusinessName);

    // Validate generated subdomain
    if (!subdomain || subdomain.length < 3) {
      return Response.json(
        { error: { message: 'Business name must contain at least 3 alphanumeric characters' } },
        { status: 400 }
      );
    }

    if (subdomain.length > 63) {
      return Response.json(
        { error: { message: 'Generated subdomain is too long. Please use a shorter business name' } },
        { status: 400 }
      );
    }

    // Check subdomain availability (to prevent race conditions)
    const available = await checkSubdomainAvailability(subdomain);

    if (!available) {
      return Response.json(
        { error: { message: 'This subdomain is already taken. Please choose a different business name' } },
        { status: 409 }
      );
    }

    // Update owner with business name and subdomain
    const ownerId = (session.user as any).id;
    await updateOwnerSubdomain(ownerId, trimmedBusinessName, subdomain);

    return Response.json(
      { subdomain },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Subdomain provisioning error:', error);

    // Handle database unique constraint violation
    if (error.code === '23505') {
      return Response.json(
        { error: { message: 'This subdomain is already taken. Please choose a different business name' } },
        { status: 409 }
      );
    }

    return Response.json(
      { error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
