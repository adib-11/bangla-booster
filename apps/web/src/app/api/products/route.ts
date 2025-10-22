import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { createProduct } from '@/lib/db';
import { CreateProductSchema } from '@/lib/validation/productValidation';

// GET /api/products
export async function GET(request: NextRequest) {
  try {
    // TODO: Implement product fetching logic
    return NextResponse.json({ message: 'Products endpoint ready' });
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/products
export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { 
          error: { 
            code: 'UNAUTHORIZED', 
            message: 'Authentication required' 
          } 
        },
        { status: 401 }
      );
    }

    // 2. Parse and validate request body
    const body = await request.json();
    const validation = CreateProductSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_INPUT',
            message: 'Validation error',
            details: validation.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    // 3. Create product in database
    const { title, price, imageUrl } = validation.data;
    const product = await createProduct(
      (session.user as any).id,
      title,
      price,
      imageUrl
    );

    // 4. Return success response
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while creating the product',
        },
      },
      { status: 500 }
    );
  }
}
