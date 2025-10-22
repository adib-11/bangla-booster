/**
 * Authentication service layer
 * Handles all auth-related API calls
 */

import apiClient from './apiClient';

/**
 * Sign up a new user
 * @param email - User's email
 * @param password - User's password
 */
export const signupUser = async (email: string, password: string): Promise<void> => {
  await apiClient.post('/auth/signup', { email, password });
};
