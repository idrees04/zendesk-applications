import { useState, useEffect, useCallback } from 'react';
import { TicketData, CustomerProfile, CustomerPost, AppError } from '../types/zendesk';
import { zafService } from '../services/zafService';
import { apiService } from '../services/apiService';

interface UseZendeskDataReturn {
  ticketData: TicketData | null;
  customerProfile: CustomerProfile | null;
  customerPosts: CustomerPost[];
  loading: {
    ticket: boolean;
    customer: boolean;
    posts: boolean;
  };
  errors: {
    ticket: string | null;
    customer: string | null;
    posts: string | null;
  };
  initialized: boolean;
  refreshAll: () => void;
  retryCustomer: () => void;
  retryPosts: () => void;
}

export const useZendeskData = (): UseZendeskDataReturn => {
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [customerPosts, setCustomerPosts] = useState<CustomerPost[]>([]);
  const [initialized, setInitialized] = useState(false);
  
  const [loading, setLoading] = useState({
    ticket: true,
    customer: false,
    posts: false,
  });
  
  const [errors, setErrors] = useState({
    ticket: null as string | null,
    customer: null as string | null,
    posts: null as string | null,
  });

  const updateLoading = (key: keyof typeof loading, value: boolean) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  };

  const updateError = (key: keyof typeof errors, value: string | null) => {
    setErrors(prev => ({ ...prev, [key]: value }));
  };

  const fetchTicketData = useCallback(async () => {
    updateLoading('ticket', true);
    updateError('ticket', null);
    
    try {
      const data = await zafService.getTicketData();
      setTicketData(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load ticket data';
      updateError('ticket', errorMessage);
    } finally {
      updateLoading('ticket', false);
    }
  }, []);

  const fetchCustomerProfile = useCallback(async (email: string) => {
    if (!email) {
      setCustomerProfile(null);
      return;
    }

    updateLoading('customer', true);
    updateError('customer', null);
    
    try {
      const profile = await apiService.getCustomerByEmail(email);
      setCustomerProfile(profile);
    } catch (error) {
      const appError = error as AppError;
      updateError('customer', appError.message);
    } finally {
      updateLoading('customer', false);
    }
  }, []);

  const fetchCustomerPosts = useCallback(async (userId: number) => {
    updateLoading('posts', true);
    updateError('posts', null);
    
    try {
      const posts = await apiService.getCustomerPosts(userId, 3);
      setCustomerPosts(posts);
    } catch (error) {
      const appError = error as AppError;
      updateError('posts', appError.message);
      setCustomerPosts([]);
    } finally {
      updateLoading('posts', false);
    }
  }, []);

  const initializeZAF = useCallback(async () => {
    try {
      // Check if we're in development mode
      if (zafService.isDevelopmentMode()) {
        console.log('Development mode detected - using simulated data');
        const simulatedData = zafService.getSimulatedTicketData();
        setTicketData(simulatedData);
        setInitialized(true);
        updateLoading('ticket', false);
      } else {
        await zafService.initialize();
        setInitialized(true);
        await fetchTicketData();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize Zendesk app';
      console.error('ZAF initialization error:', error);
      updateError('ticket', errorMessage);
      updateLoading('ticket', false);
    }
  }, [fetchTicketData]);

  const refreshAll = useCallback(() => {
    setCustomerProfile(null);
    setCustomerPosts([]);
    if (initialized) {
      fetchTicketData();
    } else {
      initializeZAF();
    }
  }, [fetchTicketData]);

  const retryCustomer = useCallback(() => {
    if (ticketData?.requester?.email) {
      fetchCustomerProfile(ticketData.requester.email);
    }
  }, [ticketData?.requester?.email, fetchCustomerProfile]);

  const retryPosts = useCallback(() => {
    if (customerProfile?.id) {
      fetchCustomerPosts(customerProfile.id);
    }
  }, [customerProfile?.id, fetchCustomerPosts]);

  // Initialize ZAF on mount
  useEffect(() => {
    initializeZAF();
  }, [initializeZAF]);

  // Fetch customer profile when ticket data changes
  useEffect(() => {
    if (ticketData?.requester?.email) {
      fetchCustomerProfile(ticketData.requester.email);
    }
  }, [ticketData?.requester?.email, fetchCustomerProfile]);

  // Fetch customer posts when profile changes
  useEffect(() => {
    if (customerProfile?.id) {
      fetchCustomerPosts(customerProfile.id);
    }
  }, [customerProfile?.id, fetchCustomerPosts]);

  return {
    ticketData,
    customerProfile,
    customerPosts,
    loading,
    errors,
    initialized,
    refreshAll,
    retryCustomer,
    retryPosts,
  };
};