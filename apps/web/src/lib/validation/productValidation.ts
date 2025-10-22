/**
 * Product Validation Schemas
 * Uses Zod for server-side validation of product data
 * Story 1.5 - Product Listing Submission
 */

import { z } from 'zod';

/**
 * Schema for creating a new product via API
 * Validates title, price, and imageUrl fields
 */
export const CreateProductSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less'),
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Price must be a positive number with up to 2 decimals'),
  imageUrl: z.string().url('Invalid image URL'),
});

/**
 * TypeScript type inferred from the Zod schema
 */
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
