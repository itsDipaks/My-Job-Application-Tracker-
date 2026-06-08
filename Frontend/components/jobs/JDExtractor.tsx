'use client';

import { FileText } from 'lucide-react';
import { useState } from 'react';

interface JDExtractorProps {
  onExtract: (jd: string) => void;
}

export default function JDExtractor({ onExtract }: JDExtractorProps) {
  const [jd, setJd] = useState('');

  const handleExtract = () => {
    if (jd.trim()) {
      onExtract(jd);
    }
  }
  return (
    <div className="bg-gray-50 rounded-md p-3 mt-3 space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
        <FileText size={16} className="text-blue-600" />
        Paste JD to auto-extract skills
      </div>
      <textarea
        placeholder="Paste the job description here..."
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
        style={{ borderWidth: '0.5px' }}
        rows={4}
      />
      <button
        onClick={handleExtract}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
      >
        Extract with Claude
      </button>
    </div>
  )
}
