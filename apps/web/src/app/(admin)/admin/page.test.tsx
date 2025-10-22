import { render, screen } from '@testing-library/react';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import AdminPage from './page';

// Mock next-auth
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

// Mock the client component
jest.mock('./AdminDashboardClient', () => {
  return function MockAdminDashboardClient() {
    return <div data-testid="admin-dashboard-client">Admin Dashboard Client</div>;
  };
});

describe('Admin Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders AdminDashboardClient for authenticated user with subdomain', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: {
        id: 'user-123',
        email: 'owner@example.com',
        businessName: 'Test Business',
        subdomain: 'test-business'
      }
    });

    const result = await AdminPage();
    render(result);
    
    expect(screen.getByTestId('admin-dashboard-client')).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it('redirects to login for unauthenticated user', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    await AdminPage();
    
    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('redirects to login when session has no user', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: null
    });

    await AdminPage();
    
    expect(redirect).toHaveBeenCalledWith('/login');
  });
});
