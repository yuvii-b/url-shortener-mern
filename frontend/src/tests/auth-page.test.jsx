import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import AuthPage from '../pages/AuthPage.jsx';

vi.mock('../context/AuthContext.jsx', () => ({
  useAuth: () => ({
    login: vi.fn(),
    register: vi.fn()
  })
}));

describe('AuthPage', () => {
  it('renders login tab by default', () => {
    render(
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>
    );

    const loginButtons = screen.getAllByRole('button', { name: 'Login' });
    expect(loginButtons[0]).toHaveClass('active');
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });
});