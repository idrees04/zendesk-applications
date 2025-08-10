import React, { useState } from 'react';
import { Copy, RefreshCw, MessageSquare, Check, Volume2, VolumeX } from 'lucide-react';
import { ReplyTone } from '../services/replyService';

interface ReplyDraftProps {
  replyText: string;
  tone: ReplyTone;
  onToneChange: (tone: ReplyTone) => void;
  onRegenerate: () => void;
  onCopy: () => Promise<boolean>;
  loading?: boolean;
}

export const ReplyDraft: React.FC<ReplyDraftProps> = ({
  replyText,
  tone,
  onToneChange,
  onRegenerate,
  onCopy,
  loading
}) => {
  const [copying, setCopying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    setCopying(true);
    const success = await onCopy();
    setCopySuccess(success);
    setCopying(false);
    
    if (success) {
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Smart Reply Draft</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Tone:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onToneChange('friendly')}
              className={`px-3 py-1 text-xs rounded-md transition-colors flex items-center gap-1 ${
                tone === 'friendly'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Volume2 className="w-3 h-3" />
              Friendly
            </button>
            <button
              onClick={() => onToneChange('concise')}
              className={`px-3 py-1 text-xs rounded-md transition-colors flex items-center gap-1 ${
                tone === 'concise'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <VolumeX className="w-3 h-3" />
              Concise
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
          {replyText || 'Generating reply...'}
        </pre>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onRegenerate}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Regenerate
        </button>
        
        <button
          onClick={handleCopy}
          disabled={copying || !replyText}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {copySuccess ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              {copying ? 'Copying...' : 'Copy'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};