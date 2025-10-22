// Mock for next-auth/next module
export const getServerSession = jest.fn();
export const getToken = jest.fn();

// Export types for TypeScript
export type { Session } from 'next-auth';
export type { NextAuthConfig } from 'next-auth';
