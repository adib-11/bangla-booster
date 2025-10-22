/**
 * Owner Service - API calls for owner-related operations
 */
import apiClient from './apiClient';

/**
 * Check if a subdomain is available
 * 
 * @param subdomain - Subdomain to check
 * @returns Object with availability status
 */
export const checkSubdomainAvailability = async (subdomain: string): Promise<{ available: boolean; subdomain: string }> => {
  const response = await apiClient.get<{ available: boolean; subdomain: string }>(
    `/owner/subdomain/check?subdomain=${encodeURIComponent(subdomain)}`
  );
  return response;
};

/**
 * Provision a subdomain for the authenticated owner
 * 
 * @param businessName - Business name to convert to subdomain
 * @returns Object with generated subdomain
 */
export const provisionSubdomain = async (businessName: string): Promise<{ subdomain: string }> => {
  const response = await apiClient.post<{ subdomain: string }>(
    '/owner/subdomain',
    { businessName }
  );
  return response;
};
