export interface ZAFClient {
  invoke: (method: string, ...args: any[]) => Promise<any>;
  get: (path: string | string[]) => Promise<any>;
  set: (path: string, value: any) => Promise<any>;
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string, callback?: (data: any) => void) => void;
}

export interface TicketData {
  requester: {
    email: string;
  };
  subject: string;
  description: string;
}

export interface CustomerProfile {
  id: number;
  name: string;
  email: string;
  address: {
    city: string;
  };
  company: {
    name: string;
  };
  website: string;
}

export interface CustomerPost {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface AppError {
  message: string;
  type: 'network' | 'not_found' | 'zaf' | 'unknown';
  retryable: boolean;
}