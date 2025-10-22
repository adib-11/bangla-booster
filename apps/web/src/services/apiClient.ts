/**
 * API Client wrapper for making HTTP requests
 * All API calls should go through this client
 */

type RequestOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
};

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || '/api';
  }

  private async request<T>(endpoint: string, options: RequestOptions): Promise<{ data: T }> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      method: options.method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: 'An error occurred' } }));
      throw new Error(errorData.error?.message || 'An error occurred');
    }

    const data = await response.json();
    return { data };
  }

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<{ data: T }> {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  async post<T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<{ data: T }> {
    return this.request<T>(endpoint, { method: 'POST', body, headers });
  }

  async put<T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<{ data: T }> {
    return this.request<T>(endpoint, { method: 'PUT', body, headers });
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<{ data: T }> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }

  async patch<T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<{ data: T }> {
    return this.request<T>(endpoint, { method: 'PATCH', body, headers });
  }
}

const apiClient = new ApiClient();

export default apiClient;
