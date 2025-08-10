import { CustomerProfile, CustomerPost, AppError } from '../types/zendesk';

class APIService {
  private baseURL = 'https://jsonplaceholder.typicode.com';
  private timeout = 5000;

  private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async getCustomerByEmail(email: string): Promise<CustomerProfile | null> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/users?email=${encodeURIComponent(email)}`);
      
      if (!response.ok) {
        throw this.createError(`HTTP ${response.status}: ${response.statusText}`, 'network');
      }

      const users: CustomerProfile[] = await response.json();
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw this.createError('Request timeout', 'network', true);
        }
        throw this.createError(error.message, 'network', true);
      }
      throw this.createError('Unknown error occurred', 'unknown', true);
    }
  }

  async getCustomerPosts(userId: number, limit: number = 3): Promise<CustomerPost[]> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/posts?userId=${userId}`);
      
      if (!response.ok) {
        throw this.createError(`HTTP ${response.status}: ${response.statusText}`, 'network');
      }

      const posts: CustomerPost[] = await response.json();
      return posts.slice(0, limit);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw this.createError('Request timeout', 'network', true);
        }
        throw this.createError(error.message, 'network', true);
      }
      throw this.createError('Unknown error occurred', 'unknown', true);
    }
  }

  private createError(message: string, type: AppError['type'], retryable: boolean = false): AppError {
    return {
      message,
      type,
      retryable
    };
  }
}

export const apiService = new APIService();