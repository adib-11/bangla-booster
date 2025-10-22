import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SubdomainSetupClient from './SubdomainSetupClient';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock BusinessNameForm component
jest.mock('@/components/owner/BusinessNameForm', () => {
  return function MockBusinessNameForm({ onSuccess }: { onSuccess?: (subdomain: string) => void }) {
    return (
      <div data-testid="business-name-form">
        <button onClick={() => onSuccess?.('test-shop')}>Submit Mock</button>
      </div>
    );
  };
});

describe('SubdomainSetupClient', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders the subdomain setup page', () => {
    render(<SubdomainSetupClient />);
    
    expect(screen.getByText(/set up your business/i)).toBeInTheDocument();
    expect(screen.getByTestId('business-name-form')).toBeInTheDocument();
  });

  it('redirects to admin after successful subdomain creation', () => {
    render(<SubdomainSetupClient />);
    
    const submitButton = screen.getByText('Submit Mock');
    submitButton.click();
    
    expect(mockPush).toHaveBeenCalledWith('/admin');
  });
});
