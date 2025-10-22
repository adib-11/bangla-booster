import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createOwner, getOwnerByEmail } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: { message: 'Email and password are required' } },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: { message: 'Invalid email format' } },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: { message: 'Password must be at least 8 characters long' } },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingOwner = await getOwnerByEmail(email);
    if (existingOwner) {
      return NextResponse.json(
        { error: { message: 'An account with this email already exists' } },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create owner record
    const owner = await createOwner(email, hashedPassword);

    return NextResponse.json(
      {
        message: 'Owner created successfully',
        owner: {
          id: owner.id,
          email: owner.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
