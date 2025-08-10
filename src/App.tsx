import React, { useState, useEffect } from 'react';
import { RefreshCw, Zap } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { TicketSummary } from './components/TicketSummary';
import { CustomerProfile } from './components/CustomerProfile';
import { RecentPosts } from './components/RecentPosts';
import { ReplyDraft } from './components/ReplyDraft';
import { useZendeskData } from './hooks/useZendeskData';
import { replyService, ReplyTone } from './services/replyService';

function App() {
  const {
    ticketData,
    customerProfile,
    customerPosts,
    loading,
    errors,
    initialized,
    refreshAll,
    retryCustomer,
    retryPosts,
  } = useZendeskData();

  const [replyText, setReplyText] = useState('');
  const [replyTone, setReplyTone] = useState<ReplyTone>('friendly');
  const [generatingReply, setGeneratingReply] = useState(false);

  // Generate reply when data is available
  useEffect(() => {
    if (ticketData && !loading.customer && !loading.posts) {
      setGeneratingReply(true);
      
      // Simulate slight delay for better UX
      const timer = setTimeout(() => {
        const reply = replyService.generateReply(
          ticketData,
          customerProfile,
          customerPosts,
          replyTone
        );
        setReplyText(reply);
        setGeneratingReply(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [ticketData, customerProfile, customerPosts, replyTone, loading.customer, loading.posts]);

  const handleRegenerate = () => {
    if (ticketData) {
      setGeneratingReply(true);
      const timer = setTimeout(() => {
        const reply = replyService.generateReply(
          ticketData,
          customerProfile,
          customerPosts,
          replyTone
        );
        setReplyText(reply);
        setGeneratingReply(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  };

  const handleCopyReply = async (): Promise<boolean> => {
    return await replyService.copyToClipboard(replyText);
  };

  const handleToneChange = (tone: ReplyTone) => {
    setReplyTone(tone);
  };

  if (!initialized && loading.ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-600">Connecting to Zendesk...</p>
          <p className="text-xs text-gray-500 mt-2">
            Make sure you're viewing this from within a Zendesk ticket
          </p>
        </div>
      </div>
    );
  }

  if (errors.ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 mb-3">
            <Zap className="w-8 h-8 mx-auto" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Connection Error
          </h2>
          <p className="text-gray-600 mb-4 text-sm">{errors.ticket}</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-left">
            <p className="text-xs text-blue-800 font-medium mb-1">Development Tips:</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Make sure you're accessing from a Zendesk ticket URL</li>
              <li>• Add ?zat=true to the URL for local development</li>
              <li>• Check that the ZAF SDK is loaded properly</li>
            </ul>
          </div>
          <button
            onClick={refreshAll}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!ticketData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600">No ticket data available</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">
                Customer Intelligence
              </h1>
            </div>
            <button
              onClick={refreshAll}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
              title="Refresh all data"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Refresh</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 space-y-4 max-w-2xl mx-auto">
          {/* Ticket Summary */}
          <TicketSummary ticketData={ticketData} />

          {/* Customer Profile */}
          {loading.customer ? (
            <LoadingSkeleton type="customer" />
          ) : (
            <CustomerProfile
              customer={customerProfile}
              error={errors.customer}
              onRetry={retryCustomer}
            />
          )}

          {/* Recent Posts */}
          {loading.posts ? (
            <LoadingSkeleton type="posts" />
          ) : (
            <RecentPosts
              posts={customerPosts}
              error={errors.posts}
              onRetry={retryPosts}
            />
          )}

          {/* Reply Draft */}
          {(generatingReply || replyText) && (
            <ReplyDraft
              replyText={replyText}
              tone={replyTone}
              onToneChange={handleToneChange}
              onRegenerate={handleRegenerate}
              onCopy={handleCopyReply}
              loading={generatingReply}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;