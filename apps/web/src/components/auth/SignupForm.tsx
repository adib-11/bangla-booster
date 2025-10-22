'use client';

import React, { useState } from 'react';
import { TextField, Button, Alert, CircularProgress } from '@mui/material';
import { signupUser } from '@/services/authService';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type SignupFormProps = {
  onSuccess?: () => void;
};

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Call signup API
      await signupUser(email, password);

      // Auto-login after successful signup
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setApiError('Account created but login failed. Please try logging in manually.');
        setLoading(false);
        return;
      }

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Redirect to subdomain setup page (Story 1.3)
      router.push('/subdomain-setup');
    } catch (error: any) {
      console.error('Signup error:', error);
      setApiError(error.message || 'An error occurred during signup. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {apiError && (
        <Alert severity="error" className="mb-4">
          {apiError}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!errors.email}
        helperText={errors.email}
        disabled={loading}
        variant="outlined"
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!errors.password}
        helperText={errors.password}
        disabled={loading}
        variant="outlined"
      />

      <TextField
        fullWidth
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
        disabled={loading}
        variant="outlined"
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        className="mt-6"
        sx={{ py: 1.5 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Sign Up'}
      </Button>

      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 hover:underline">
          Log in
        </a>
      </p>
    </form>
  );
};

export default SignupForm;
