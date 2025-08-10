import React from 'react';
import { User, Building2, MapPin, Globe, AlertTriangle } from 'lucide-react';
import { CustomerProfile as CustomerProfileType } from '../types/zendesk';

interface CustomerProfileProps {
  customer: CustomerProfileType | null;
  error?: string;
  onRetry?: () => void;
}

export const CustomerProfile: React.FC<CustomerProfileProps> = ({ 
  customer, 
  error, 
  onRetry 
}) => {
  if (error) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center gap-2 text-amber-600 mb-2">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Customer Profile</h3>
        </div>
        <p className="text-sm text-gray-600 mb-3">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded-lg hover:bg-amber-200 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <User className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Customer Profile</h3>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <User className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Customer not found</p>
          <p className="text-xs text-gray-400">No profile available for this email</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="flex items-center gap-2 text-green-600 mb-3">
        <User className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Customer Profile</h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <h4 className="text-base font-medium text-gray-900">{customer.name}</h4>
          <p className="text-sm text-gray-500">{customer.email}</p>
        </div>

        {customer.company?.name && (
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700">{customer.company.name}</span>
          </div>
        )}

        {customer.address?.city && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700">{customer.address.city}</span>
          </div>
        )}

        {customer.website && (
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-400" />
            <a
              href={`http://${customer.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              {customer.website}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};