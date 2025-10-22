import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddProductModal from './AddProductModal';

// Mock the AddProductForm component
jest.mock('./AddProductForm', () => {
  return function MockAddProductForm({ onSubmit, onCancel, isLoading }: any) {
    return (
      <div data-testid="add-product-form">
        <button onClick={() => onSubmit?.({ title: 'Test', price: '10.00', image: new File([], 'test.jpg') })}>
          Submit Form
        </button>
        <button onClick={onCancel}>Cancel Form</button>
        {isLoading && <span>Loading...</span>}
      </div>
    );
  };
});

describe('AddProductModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders when open is true', () => {
    render(<AddProductModal open={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    expect(screen.getByText('Add New Product')).toBeInTheDocument();
    expect(screen.getByTestId('add-product-form')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    render(<AddProductModal open={false} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    expect(screen.queryByText('Add New Product')).not.toBeInTheDocument();
  });

  it('renders AddProductForm inside modal', () => {
    render(<AddProductModal open={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    expect(screen.getByTestId('add-product-form')).toBeInTheDocument();
  });

  it('closes modal when cancel button is clicked', () => {
    render(<AddProductModal open={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    const cancelButton = screen.getByText('Cancel Form');
    fireEvent.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSuccess and onClose when form is submitted successfully', async () => {
    render(<AddProductModal open={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    const submitButton = screen.getByText('Submit Form');
    fireEvent.click(submitButton);
    
    // Fast-forward timers to complete the simulated API call
    jest.advanceTimersByTime(500);
    
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('displays loading state during form submission', async () => {
    render(<AddProductModal open={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    const submitButton = screen.getByText('Submit Form');
    fireEvent.click(submitButton);
    
    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
    
    // Fast-forward timers
    jest.advanceTimersByTime(500);
    
    // Wait for completion
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('has proper accessibility attributes', () => {
    render(<AddProductModal open={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'add-product-dialog-title');
  });

  it('prevents closing modal while loading', async () => {
    render(<AddProductModal open={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    const submitButton = screen.getByText('Submit Form');
    fireEvent.click(submitButton);
    
    // Try to close while loading
    const cancelButton = screen.getByText('Cancel Form');
    fireEvent.click(cancelButton);
    
    // Should not close because isLoading is true
    expect(mockOnClose).not.toHaveBeenCalled();
    
    // Fast-forward timers to complete
    jest.advanceTimersByTime(500);
    
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
});
