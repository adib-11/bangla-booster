import { render, screen, fireEvent } from '@testing-library/react';
import AdminDashboardClient from './AdminDashboardClient';

// Mock the AddProductModal component
jest.mock('../../../components/owner/AddProductModal', () => {
  return function MockAddProductModal({ open, onClose }: any) {
    return open ? (
      <div data-testid="add-product-modal">
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null;
  };
});

describe('AdminDashboardClient', () => {
  it('renders Products heading', () => {
    render(<AdminDashboardClient />);
    expect(screen.getByText('Products')).toBeInTheDocument();
  });

  it('renders Add New Product button', () => {
    render(<AdminDashboardClient />);
    const button = screen.getByRole('button', { name: /add new product/i });
    expect(button).toBeInTheDocument();
  });

  it('opens modal when Add New Product button is clicked', () => {
    render(<AdminDashboardClient />);
    
    // Modal should not be visible initially
    expect(screen.queryByTestId('add-product-modal')).not.toBeInTheDocument();
    
    // Click the button
    const button = screen.getByRole('button', { name: /add new product/i });
    fireEvent.click(button);
    
    // Modal should now be visible
    expect(screen.getByTestId('add-product-modal')).toBeInTheDocument();
  });

  it('closes modal when close is triggered', () => {
    render(<AdminDashboardClient />);
    
    // Open modal
    const button = screen.getByRole('button', { name: /add new product/i });
    fireEvent.click(button);
    expect(screen.getByTestId('add-product-modal')).toBeInTheDocument();
    
    // Close modal
    const closeButton = screen.getByText('Close Modal');
    fireEvent.click(closeButton);
    expect(screen.queryByTestId('add-product-modal')).not.toBeInTheDocument();
  });
});
