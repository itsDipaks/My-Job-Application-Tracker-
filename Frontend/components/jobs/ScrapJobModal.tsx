'use client';

import { X, Link as LinkIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ScrapJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScrap: (jobUrl: string) => void;
  isLoading?: boolean;
}

export default function ScrapJobModal({ isOpen, onClose, onScrap, isLoading = false }: ScrapJobModalProps) {
  const [jobUrl, setJobUrl] = useState('');

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setJobUrl('');
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jobUrl.trim()) {
      onScrap(jobUrl.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-70 z-40 transition-opacity backdrop-blur-sm"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-gray-900 rounded-2xl w-full max-w-lg border border-gray-700 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600/20 rounded-lg">
                <LinkIcon size={20} className="text-indigo-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Scrap Job Details</h2>
                <p className="text-sm text-gray-400">Extract job information from URL</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-1.5 rounded-lg hover:bg-gray-800 transition text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Job URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Job Posting URL <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://www.linkedin.com/jobs/view/..."
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  className="w-full px-4 py-3 pl-10 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-500"
                  required
                  autoFocus
                  disabled={isLoading}
                />
                <LinkIcon size={18} className="absolute left-3 top-3.5 text-gray-500" />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Supports LinkedIn, Naukri, Indeed, and other job platforms
              </p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="bg-indigo-900/20 border border-indigo-700/50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-400"></div>
                  <div>
                    <p className="text-sm font-medium text-indigo-300">Scraping job details...</p>
                    <p className="text-xs text-gray-400 mt-0.5">This may take a few seconds</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !jobUrl.trim()}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Scraping...
                  </>
                ) : (
                  <>
                    <LinkIcon size={18} />
                    Scrap Job Details
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
