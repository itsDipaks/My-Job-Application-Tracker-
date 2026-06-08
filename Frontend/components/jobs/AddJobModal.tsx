'use client';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { JobSource, CompanyType } from '@/types/job';
interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: {
    company: string;
    source: JobSource;
    company_type: CompanyType;
    appliedDate: string;
    appliedTime: string;
    role: number;
  }) => void;
}
export default function AddJobModal({ isOpen, onClose, onAdd }: AddJobModalProps) {
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const [company, setCompany] = useState(''); 
  const [role, setRole] = useState<number>(3); // Default to Full Stack Developer (ID 3)
  const [source, setSource] = useState<JobSource>('LinkedIn');
  const [companyType, setCompanyType] = useState<CompanyType>('Product');
  const [appliedDate, setAppliedDate] = useState(currentDate);
  const [appliedTime, setAppliedTime] = useState(currentTime);
  useEffect(() => {
    if (!isOpen) {
      const now = new Date();
      const currentDate = now.toISOString().split('T')[0];
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      setCompany('');
      setRole(3); // Reset to Full Stack Developer
      setSource('LinkedIn');
      setCompanyType('Product');
      setAppliedDate(currentDate);
      setAppliedTime(currentTime);
    }
  }, [isOpen]);
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (company.trim()) {
      onAdd({
        company: company.trim(),
        role,
        source,
        company_type: companyType,
        appliedDate,
        appliedTime,
      });
      onClose();
    }
  };
  if (!isOpen) return null;
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-70 z-40 transition-opacity backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-gray-900 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Add Application</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-800 transition text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Company Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Google, Microsoft"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-500"
                required
                autoFocus
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Role <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 1, name: 'Frontend' },
                  { id: 2, name: 'Backend' },
                  { id: 3, name: 'Full Stack' },
                  { id: 4, name: 'DevOps' },
                ].map((roleOption) => (
                  <button
                    key={roleOption.id}
                    type="button"
                    onClick={() => setRole(roleOption.id)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                      role === roleOption.id
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                        : 'bg-gray-800 text-gray-400 hover:text-gray-300 hover:bg-gray-750 border border-gray-700'
                    }`}
                  >
                    {roleOption.name}
                  </button>
                ))}
              </div>
            </div>
            {/* Platform Tabs */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Platform <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['LinkedIn', 'Naukri', 'Indeed', 'Email'] as const).map((platform) => (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => setSource(platform as JobSource)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                      source === platform
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                        : 'bg-gray-800 text-gray-400 hover:text-gray-300 hover:bg-gray-750 border border-gray-700'
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>
            {/* Company Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Company Type <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['Product', 'Service'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setCompanyType(type)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition ${
                      companyType === type
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                        : 'bg-gray-800 text-gray-400 hover:text-gray-300 hover:bg-gray-750 border border-gray-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={appliedDate}
                  onChange={(e) => setAppliedDate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Time <span className="text-red-400">*</span>
                </label>
                <input
                  type="time"
                  value={appliedTime}
                  onChange={(e) => setAppliedTime(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  required
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow-lg shadow-indigo-500/30"
              >
                Add Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
