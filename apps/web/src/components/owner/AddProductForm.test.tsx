import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddProductForm from './AddProductForm';

describe('AddProductForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all three form fields', () => {
    render(<AddProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    expect(screen.getByLabelText(/product title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/product price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/product image/i)).toBeInTheDocument();
  });

  it('renders Save and Cancel buttons', () => {
    render(<AddProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('disables save button when form is empty', () => {
    render(<AddProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const saveButton = screen.getByRole('button', { name: /save/i });
    expect(saveButton).toBeDisabled();
  });

  it('validates title field on blur - empty title', async () => {
    render(<AddProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const titleInput = screen.getByLabelText(/product title/i);
    fireEvent.blur(titleInput);
    
    await waitFor(() => {
      expect(screen.getByText(/product title is required/i)).toBeInTheDocument();
    });
  });

  it('validates title field - too long', async () => {
    render(<AddProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const titleInput = screen.getByLabelText(/product title/i);
    const longTitle = 'a'.repeat(201);
    
    fireEvent.change(titleInput, { target: { value: longTitle } });
    fireEvent.blur(titleInput);
    
    await waitFor(() => {
      expect(screen.getByText(/title must be 200 characters or less/i)).toBeInTheDocument();
    });
  });

  it('validates price field on blur - empty price', async () => {
    render(<AddProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const priceInput = screen.getByLabelText(/product price/i);
    fireEvent.blur(priceInput);
    
    await waitFor(() => {
      expect(screen.getByText(/price is required/i)).toBeInTheDocument();
    });
  });

  it('validates price format - invalid format', async () => {
    render(<AddProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const priceInput = screen.getByLabelText(/product price/i);
    fireEvent.change(priceInput, { target: { value: 'invalid' } });
    fireEvent.blur(priceInput);
    
    await waitFor(() => {
      expect(screen.getByText(/price must be a positive number with up to 2 decimals/i)).toBeInTheDocument();
    });
  });

  it('accepts valid price format', async () => {
    render(<AddProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const priceInput = screen.getByLabelText(/product price/i);
    fireEvent.change(priceInput, { target: { value: '19.99' } });
    fireEvent.blur(priceInput);
    
    await waitFor(() => {
      expect(screen.queryByText(/price must be a positive number/i)).not.toBeInTheDocument();
    });
  });

  it('validates image file type - invalid type', async () => {
    render(<AddProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const file = new File(['dummy'], 'test.txt', { type: 'text/plain' });
    const imageInput = screen.getByLabelText(/product image/i);
    
    fireEvent.change(imageInput, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByText(/image must be jpeg, png, or webp/i)).toBeInTheDocument();
    });
  });

  it('validates image file size - too large', async () => {
    render(<AddProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    // Create a file larger than 5MB
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
    const imageInput = screen.getByLabelText(/product image/i);
    
    fireEvent.change(imageInput, { target: { files: [largeFile] } });
    
    await waitFor(() => {
      expect(screen.getByText(/image must be less than 5mb/i)).toBeInTheDocument();
    });
  });

  it('accepts valid image file', async () => {
    render(<AddProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const file = new File(['dummy'], 'test.jpg', { type: 'image/jpeg' });
    const imageInput = screen.getByLabelText(/product image/i);
    
    // Mock FileReader
    const mockFileReader = {
      readAsDataURL: jest.fn(),
      onloadend: jest.fn(),
      result: 'data:image/jpeg;base64,test'
    };
    global.FileReader = jest.fn(() => mockFileReader) as any;
    
    fireEvent.change(imageInput, { target: { files: [file] } });
    
    // Trigger onloadend manually
    mockFileReader.onloadend();
    
    await waitFor(() => {
      expect(screen.queryByText(/image must be/i)).not.toBeInTheDocument();
    });
  });

  it('displays image preview after valid file selection', async () => {
    render(<AddProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const file = new File(['dummy'], 'test.jpg', { type: 'image/jpeg' });
    const imageInput = screen.getByLabelText(/product image/i);
    
    // Mock FileReader
    const mockFileReader = {
      readAsDataURL: jest.fn(),
      onloadend: null as any,
      result: 'data:image/jpeg;base64,test'
    };
    global.FileReader = jest.fn(() => mockFileReader) as any;
    
    fireEvent.change(imageInput, { target: { files: [file] } });
    
    // Trigger onloadend callback
    if (mockFileReader.onloadend) {
      mockFileReader.onloadend();
    }
    
    await waitFor(() => {
      const img = screen.getByAltText(/product preview/i);
      expect(img).toBeInTheDocument();
    });
  });

  it('enables save button when all fields are valid', async () => {
    render(<AddProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const titleInput = screen.getByLabelText(/product title/i);
    const priceInput = screen.getByLabelText(/product price/i);
    const imageInput = screen.getByLabelText(/product image/i);
    
    // Fill in all fields with valid data
    fireEvent.change(titleInput, { target: { value: 'Test Product' } });
    fireEvent.change(priceInput, { target: { value: '19.99' } });
    
    const file = new File(['dummy'], 'test.jpg', { type: 'image/jpeg' });
    
    // Mock FileReader
    const mockFileReader = {
      readAsDataURL: jest.fn(),
      onloadend: null as any,
      result: 'data:image/jpeg;base64,test'
    };
    global.FileReader = jest.fn(() => mockFileReader) as any;
    
    fireEvent.change(imageInput, { target: { files: [file] } });
    
    // Trigger onloadend
    if (mockFileReader.onloadend) {
      mockFileReader.onloadend();
    }
    
    await waitFor(() => {
      const saveButton = screen.getByRole('button', { name: /save/i });
      expect(saveButton).not.toBeDisabled();
    });
  });

  it('calls onSubmit with form data when submitted with valid data', async () => {
    render(<AddProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const titleInput = screen.getByLabelText(/product title/i);
    const priceInput = screen.getByLabelText(/product price/i);
    const imageInput = screen.getByLabelText(/product image/i);
    
    // Fill in all fields
    fireEvent.change(titleInput, { target: { value: 'Test Product' } });
    fireEvent.change(priceInput, { target: { value: '19.99' } });
    
    const file = new File(['dummy'], 'test.jpg', { type: 'image/jpeg' });
    
    // Mock FileReader
    const mockFileReader = {
      readAsDataURL: jest.fn(),
      onloadend: null as any,
      result: 'data:image/jpeg;base64,test'
    };
    global.FileReader = jest.fn(() => mockFileReader) as any;
    
    fireEvent.change(imageInput, { target: { files: [file] } });
    
    if (mockFileReader.onloadend) {
      mockFileReader.onloadend();
    }
    
    await waitFor(() => {
      const saveButton = screen.getByRole('button', { name: /save/i });
      expect(saveButton).not.toBeDisabled();
    });
    
    // Submit the form
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Product',
        price: '19.99',
        image: file
      });
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<AddProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('disables form when isLoading is true', () => {
    render(<AddProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} isLoading={true} />);
    
    const titleInput = screen.getByLabelText(/product title/i);
    const priceInput = screen.getByLabelText(/product price/i);
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    
    expect(titleInput).toBeDisabled();
    expect(priceInput).toBeDisabled();
    expect(cancelButton).toBeDisabled();
    expect(screen.getByRole('button', { name: /saving/i })).toBeInTheDocument();
  });
});
