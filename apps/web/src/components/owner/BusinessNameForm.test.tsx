import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BusinessNameForm from './BusinessNameForm';
import * as ownerService from '@/services/ownerService';

// Mock the ownerService
jest.mock('@/services/ownerService');

describe('BusinessNameForm', () => {
  const mockProvisionSubdomain = ownerService.provisionSubdomain as jest.MockedFunction<typeof ownerService.provisionSubdomain>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with business name input', () => {
    render(<BusinessNameForm />);
    
    expect(screen.getByLabelText(/business name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create my subdomain/i })).toBeInTheDocument();
  });

  it('displays subdomain preview as user types', async () => {
    render(<BusinessNameForm />);
    
    const input = screen.getByLabelText(/business name/i);
    fireEvent.change(input, { target: { value: "Adib's Kicks" } });
    
    await waitFor(() => {
      expect(screen.getByText(/adibs-kicks\.ourplatform\.com/i)).toBeInTheDocument();
    });
  });

  it('updates preview when business name changes', async () => {
    render(<BusinessNameForm />);
    
    const input = screen.getByLabelText(/business name/i);
    
    fireEvent.change(input, { target: { value: 'Test Shop' } });
    await waitFor(() => {
      expect(screen.getByText(/test-shop\.ourplatform\.com/i)).toBeInTheDocument();
    });
    
    fireEvent.change(input, { target: { value: 'New Store' } });
    await waitFor(() => {
      expect(screen.getByText(/new-store\.ourplatform\.com/i)).toBeInTheDocument();
    });
  });

  it('disables submit button when business name is empty', () => {
    render(<BusinessNameForm />);
    
    const submitButton = screen.getByRole('button', { name: /create my subdomain/i });
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when business name is filled', () => {
    render(<BusinessNameForm />);
    
    const input = screen.getByLabelText(/business name/i);
    fireEvent.change(input, { target: { value: 'My Shop' } });
    
    const submitButton = screen.getByRole('button', { name: /create my subdomain/i });
    expect(submitButton).not.toBeDisabled();
  });

  it('submits form with valid business name', async () => {
    mockProvisionSubdomain.mockResolvedValue({ subdomain: 'test-shop' });
    const onSuccess = jest.fn();
    
    render(<BusinessNameForm onSuccess={onSuccess} />);
    
    const input = screen.getByLabelText(/business name/i);
    fireEvent.change(input, { target: { value: 'Test Shop' } });
    
    const submitButton = screen.getByRole('button', { name: /create my subdomain/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockProvisionSubdomain).toHaveBeenCalledWith('Test Shop');
      expect(onSuccess).toHaveBeenCalledWith('test-shop');
    });
  });

  it('shows loading state during submission', async () => {
    mockProvisionSubdomain.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ subdomain: 'test-shop' }), 100)));
    
    render(<BusinessNameForm />);
    
    const input = screen.getByLabelText(/business name/i);
    fireEvent.change(input, { target: { value: 'Test Shop' } });
    
    const submitButton = screen.getByRole('button', { name: /create my subdomain/i });
    fireEvent.click(submitButton);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(mockProvisionSubdomain).toHaveBeenCalled();
    });
  });

  it('displays error message on API failure', async () => {
    mockProvisionSubdomain.mockRejectedValue(new Error('Subdomain already taken'));
    
    render(<BusinessNameForm />);
    
    const input = screen.getByLabelText(/business name/i);
    fireEvent.change(input, { target: { value: 'Test Shop' } });
    
    const submitButton = screen.getByRole('button', { name: /create my subdomain/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/subdomain already taken/i)).toBeInTheDocument();
    });
  });

  it('validates empty business name', async () => {
    render(<BusinessNameForm />);
    
    const input = screen.getByLabelText(/business name/i);
    fireEvent.change(input, { target: { value: '   ' } });
    
    const form = input.closest('form');
    if (form) {
      fireEvent.submit(form);
    }
    
    await waitFor(() => {
      expect(screen.getByText(/business name is required/i)).toBeInTheDocument();
    });
    
    expect(mockProvisionSubdomain).not.toHaveBeenCalled();
  });

  it('validates business name length', async () => {
    render(<BusinessNameForm />);
    
    const input = screen.getByLabelText(/business name/i);
    const longName = 'A'.repeat(101);
    fireEvent.change(input, { target: { value: longName } });
    
    const form = input.closest('form');
    if (form) {
      fireEvent.submit(form);
    }
    
    await waitFor(() => {
      expect(screen.getByText(/100 characters or less/i)).toBeInTheDocument();
    });
    
    expect(mockProvisionSubdomain).not.toHaveBeenCalled();
  });

  it('validates generated subdomain length', async () => {
    render(<BusinessNameForm />);
    
    const input = screen.getByLabelText(/business name/i);
    fireEvent.change(input, { target: { value: '!!!' } });
    
    const form = input.closest('form');
    if (form) {
      fireEvent.submit(form);
    }
    
    await waitFor(() => {
      expect(screen.getByText(/at least 3 alphanumeric characters/i)).toBeInTheDocument();
    });
    
    expect(mockProvisionSubdomain).not.toHaveBeenCalled();
  });
});
