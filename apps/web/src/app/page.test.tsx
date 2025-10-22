import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home Page', () => {
  it('renders the welcome message', () => {
    render(<Home />);
    
    const heading = screen.getByText(/AI Chat Web Prototype/i);
    expect(heading).toBeInTheDocument();
  });

  it('renders the completion message', () => {
    render(<Home />);
    
    const message = screen.getByText(/Foundation setup complete/i);
    expect(message).toBeInTheDocument();
  });
});
