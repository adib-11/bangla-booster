/**
 * Shared TypeScript types for the AI Chat Web Prototype
 * These types match the database schema and are used across the monorepo
 */

/**
 * Owner interface - represents a business owner
 * Note: hashedPassword and encryptedFacebookPageToken are backend-only
 * and should not be sent to the frontend
 */
export interface Owner {
  id: string;                      // UUID
  email: string;
  businessName: string;
  subdomain: string;
  facebookPageId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Owner data as stored in database (includes sensitive fields)
 * Use only in backend code
 */
export interface OwnerDB extends Owner {
  hashedPassword: string;
  encryptedFacebookPageToken?: string;
}

/**
 * Product interface - represents a product in the catalog
 */
export interface Product {
  id: string;                      // UUID
  ownerId: string;                 // UUID - foreign key to owners
  title: string;
  price: string;                   // String type for decimal precision
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Request/Response types for API endpoints
 */

// Product creation request
export interface CreateProductRequest {
  title: string;
  price: string;
  imageUrl: string;
}

// Product form input (client-side form data with File object)
export interface ProductInput {
  title: string;
  price: string;
  image: File | null;
}

// Product form validation errors
export interface ProductFormErrors {
  title?: string;
  price?: string;
  image?: string;
}

// Owner signup request
export interface SignupRequest {
  email: string;
  password: string;
  businessName: string;
  subdomain: string;
}

// Login request
export interface LoginRequest {
  email: string;
  password: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
