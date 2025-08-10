import { ZAFClient, TicketData } from '../types/zendesk';

class ZAFService {
  private client: ZAFClient | null = null;
  private initializationPromise: Promise<ZAFClient> | null = null;

  async initialize(): Promise<ZAFClient> {
    // Return existing promise if already initializing
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    // Return existing client if already initialized
    if (this.client) {
      return Promise.resolve(this.client);
    }

    this.initializationPromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('ZAF initialization timeout - make sure you are running this app within Zendesk'));
      }, 15000);

      // Check if we're in a Zendesk environment
      if (typeof window === 'undefined') {
        clearTimeout(timeout);
        reject(new Error('Window object not available'));
        return;
      }

      // Wait for ZAF SDK to be available
      const checkZAF = () => {
        if ((window as any).ZAFClient) {
          try {
            (window as any).ZAFClient.init((client: ZAFClient) => {
              clearTimeout(timeout);
              this.client = client;
              
              // Resize the app to fit content
              client.invoke('resize', { width: '100%', height: 'auto' }).catch(() => {
                // Ignore resize errors in development
              });
              
              resolve(client);
            });
          } catch (error) {
            clearTimeout(timeout);
            reject(new Error(`ZAF initialization failed: ${error}`));
          }
        } else {
          // Check again after a short delay
          setTimeout(checkZAF, 100);
        }
      };

      // Start checking for ZAF availability
      checkZAF();
    });

    return this.initializationPromise;
  }

  async getTicketData(): Promise<TicketData> {
    if (!this.client) {
      throw new Error('ZAF client not initialized - call initialize() first');
    }

    try {
      // Test if client is still valid
      await this.client.get('ticket.id');
      
      const data = await this.client.get([
        'ticket.requester.email',
        'ticket.subject',
        'ticket.description'
      ]);

      return {
        requester: {
          email: data['ticket.requester.email'] || ''
        },
        subject: data['ticket.subject'] || '',
        description: data['ticket.description'] || ''
      };
    } catch (error) {
      // Don't reset client on data fetch errors, only on initialization errors
      throw new Error(`Failed to fetch ticket data: ${error}`);
    }
  }

  // Add method to check if we're in development mode
  isDevelopmentMode(): boolean {
    return !!(window as any).location?.search?.includes('zat=true') || 
           (window as any).location?.hostname === 'localhost';
  }

  // Add method to simulate ticket data for development
  getSimulatedTicketData(): TicketData {
    return {
      requester: {
        email: 'Sincere@april.biz' // Use a test email from JSONPlaceholder
      },
      subject: 'Test ticket for development',
      description: 'This is a simulated ticket for testing the Zendesk sidebar app in development mode.'
    };
  }

  getClient(): ZAFClient | null {
    return this.client;
  }

  // Reset the service (useful for testing)
  reset(): void {
    this.client = null;
    this.initializationPromise = null;
  }
}

export const zafService = new ZAFService();