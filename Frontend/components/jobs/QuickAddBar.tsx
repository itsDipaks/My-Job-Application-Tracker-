'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { JobSource } from '@/types/job';

interface QuickAddBarProps {
  onAdd: (company: string, role: string, source: JobSource) => void;
}

export default function QuickAddBar({ onAdd }: QuickAddBarProps) {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [source, setSource] = useState<JobSource>('Naukri');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (company.trim() && role.trim()) {
      onAdd(company, role, source);
      setCompany('');
      setRole('');
      setSource('Naukri');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-300 rounded-lg p-4 flex flex-col sm:flex-row gap-3"
      style={{ borderWidth: '0.5px' }}
    >
      <input
        type="text"
        placeholder="Company name"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="flex-[1.2] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        style={{ borderWidth: '0.5px' }}
      />
      <input
        type="text"
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        style={{ borderWidth: '0.5px' }}
      />
      <select
        value={source}
        onChange={(e) => setSource(e.target.value as JobSource)}
        className="flex-[0.6] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        style={{ borderWidth: '0.5px' }}
      >
        <option value="Naukri">Naukri</option>
        <option value="LinkedIn">LinkedIn</option>
        <option value="Instahyre">Instahyre</option>
        <option value="Referral">Referral</option>
        <option value="Other">Other</option>
      </select>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm font-medium whitespace-nowrap"
      >
        <Plus size={16} />
        Add job
      </button>
    </form>
  );
}
