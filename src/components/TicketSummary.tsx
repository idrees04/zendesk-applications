import React from 'react';
import { Mail, FileText, User } from 'lucide-react';
import { TicketData } from '../types/zendesk';

interface TicketSummaryProps {
  ticketData: TicketData;
}

export const TicketSummary: React.FC<TicketSummaryProps> = ({ ticketData }) => {
  const truncateText = (text: string, maxLength: number = 100): string => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const cleanHtml = (html: string): string => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-600" />
        Ticket Details
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-gray-500">Requester</p>
            <p className="text-sm font-medium text-gray-900 break-all">
              {ticketData.requester.email || 'N/A'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-gray-500">Subject</p>
            <p className="text-sm font-medium text-gray-900">
              {ticketData.subject || 'No subject'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-gray-500">Description</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {truncateText(cleanHtml(ticketData.description)) || 'No description'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};