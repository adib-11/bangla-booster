/**
 * Utility functions for subdomain generation and other common operations
 */

/**
 * Generate a URL-safe subdomain slug from a business name
 * - Converts to lowercase
 * - Replaces spaces with hyphens
 * - Removes special characters
 * - Removes leading/trailing hyphens
 * 
 * @param businessName - The business name to convert
 * @returns URL-safe subdomain slug
 * 
 * @example
 * generateSubdomain("Adib's Kicks") // "adibs-kicks"
 * generateSubdomain("Joe's Coffee & Tea") // "joes-coffee-tea"
 * generateSubdomain("Best Shop!!!") // "best-shop"
 */
export function generateSubdomain(businessName: string): string {
  return businessName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')          // Replace spaces with hyphens
    .replace(/-+/g, '-')           // Replace multiple hyphens with single
    .replace(/^-|-$/g, '');        // Remove leading/trailing hyphens
}
