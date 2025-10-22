import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import type { Owner, OwnerDB, Product } from '../../../../packages/shared/src/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role key
export function getServerSupabase() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey || !supabaseUrl) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL');
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Create a new owner record in the database
 * IMPORTANT: Uses temporary placeholders for business_name and subdomain
 * Story 1.3 will update these fields to actual values
 * 
 * @param email - Owner's email address
 * @param hashedPassword - Hashed password
 * @returns Owner object (excluding hashedPassword)
 */
export async function createOwner(email: string, hashedPassword: string): Promise<Owner> {
  const serverSupabase = getServerSupabase();
  
  // Generate temporary placeholders for required fields
  // Story 1.3 will update these to user-specified values
  const tempSubdomain = `temp-${randomUUID()}`;
  const tempBusinessName = '';
  
  const { data, error } = await serverSupabase
    .from('owners')
    .insert({
      email,
      hashed_password: hashedPassword,
      business_name: tempBusinessName,
      subdomain: tempSubdomain,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Database error creating owner:', error);
    throw new Error('Failed to create owner');
  }
  
  // Return owner (excluding hashed_password)
  return {
    id: data.id,
    email: data.email,
    businessName: data.business_name,
    subdomain: data.subdomain,
    facebookPageId: data.facebook_page_id,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

/**
 * Get owner by email address
 * Returns owner with hashedPassword for authentication purposes
 * 
 * @param email - Owner's email address
 * @returns Owner object with hashedPassword, or null if not found
 */
export async function getOwnerByEmail(email: string): Promise<(Owner & { hashedPassword: string }) | null> {
  const serverSupabase = getServerSupabase();
  
  const { data, error } = await serverSupabase
    .from('owners')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Database error fetching owner by email:', error);
    throw new Error('Failed to fetch owner');
  }
  
  if (!data) {
    return null;
  }
  
  return {
    id: data.id,
    email: data.email,
    businessName: data.business_name,
    subdomain: data.subdomain,
    facebookPageId: data.facebook_page_id,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    hashedPassword: data.hashed_password,
  };
}

/**
 * Get owner by ID
 * 
 * @param id - Owner's UUID
 * @returns Owner object (excluding hashedPassword), or null if not found
 */
export async function getOwnerById(id: string): Promise<Owner | null> {
  const serverSupabase = getServerSupabase();
  
  const { data, error } = await serverSupabase
    .from('owners')
    .select('id, email, business_name, subdomain, facebook_page_id, created_at, updated_at')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Database error fetching owner by ID:', error);
    throw new Error('Failed to fetch owner');
  }
  
  if (!data) {
    return null;
  }
  
  return {
    id: data.id,
    email: data.email,
    businessName: data.business_name,
    subdomain: data.subdomain,
    facebookPageId: data.facebook_page_id,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

/**
 * Update owner's business name and subdomain (Story 1.3)
 * 
 * @param ownerId - Owner's UUID
 * @param businessName - Business name provided by owner
 * @param subdomain - Generated subdomain slug
 * @returns Updated owner object (excluding hashedPassword)
 */
export async function updateOwnerSubdomain(
  ownerId: string,
  businessName: string,
  subdomain: string
): Promise<Owner> {
  const serverSupabase = getServerSupabase();
  
  const { data, error } = await serverSupabase
    .from('owners')
    .update({
      business_name: businessName,
      subdomain: subdomain,
    })
    .eq('id', ownerId)
    .select('id, email, business_name, subdomain, facebook_page_id, created_at, updated_at')
    .single();
  
  if (error) {
    console.error('Database error updating owner subdomain:', error);
    throw new Error('Failed to update owner subdomain');
  }
  
  return {
    id: data.id,
    email: data.email,
    businessName: data.business_name,
    subdomain: data.subdomain,
    facebookPageId: data.facebook_page_id,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

/**
 * Check if a subdomain is available (Story 1.3)
 * Excludes temporary subdomains (temp-*) from availability check
 * 
 * @param subdomain - Subdomain to check
 * @returns true if available, false if taken
 */
export async function checkSubdomainAvailability(subdomain: string): Promise<boolean> {
  const serverSupabase = getServerSupabase();
  
  // Check if subdomain exists, excluding temp subdomains
  const { data, error } = await serverSupabase
    .from('owners')
    .select('id')
    .eq('subdomain', subdomain)
    .not('subdomain', 'like', 'temp-%')
    .maybeSingle();
  
  if (error) {
    console.error('Database error checking subdomain availability:', error);
    throw new Error('Failed to check subdomain availability');
  }
  
  // Available if no record found
  return data === null;
}

/**
 * Get owner by subdomain (Story 1.3, for future use)
 * 
 * @param subdomain - Subdomain to search for
 * @returns Owner object (excluding hashedPassword), or null if not found
 */
export async function getOwnerBySubdomain(subdomain: string): Promise<Owner | null> {
  const serverSupabase = getServerSupabase();
  
  const { data, error } = await serverSupabase
    .from('owners')
    .select('id, email, business_name, subdomain, facebook_page_id, created_at, updated_at')
    .eq('subdomain', subdomain)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Database error fetching owner by subdomain:', error);
    throw new Error('Failed to fetch owner by subdomain');
  }
  
  if (!data) {
    return null;
  }
  
  return {
    id: data.id,
    email: data.email,
    businessName: data.business_name,
    subdomain: data.subdomain,
    facebookPageId: data.facebook_page_id,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

/**
 * Create a new product in the database (Story 1.5)
 * 
 * @param ownerId - UUID of the owner creating the product
 * @param title - Product title (max 200 chars)
 * @param price - Product price as string (validated format)
 * @param imageUrl - URL of the uploaded product image
 * @returns Created product object with all fields
 */
export async function createProduct(
  ownerId: string,
  title: string,
  price: string,
  imageUrl: string
): Promise<Product> {
  const serverSupabase = getServerSupabase();
  
  const { data, error } = await serverSupabase
    .from('products')
    .insert({
      owner_id: ownerId,
      title,
      price,
      image_url: imageUrl,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Database error creating product:', error);
    throw new Error('Failed to create product in database');
  }
  
  return {
    id: data.id,
    ownerId: data.owner_id,
    title: data.title,
    price: data.price,
    imageUrl: data.image_url,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}
