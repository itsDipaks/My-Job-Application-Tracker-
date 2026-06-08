'use client';

import { Job, JobStatus } from '@/types/job';

interface FilterBarProps {
  jobs: Job[];
  activeFilter: JobStatus | 'All';
  onFilterChange: (filter: JobStatus | 'All') => void;
}

export default function FilterBar({ jobs, activeFilter, onFilterChange }: FilterBarProps) {
  const filters: Array<{ label: string; value: JobStatus | 'All' }> = [
    { label: 'All', value: 'All' },
    { label: 'Applied', value: 'Applied' },
    { label: 'Screening', value: 'Screening' },
    { label: 'Interview', value: 'Interview' },
    { label: 'Offer', value: 'Offer' },
    { label: 'Rejected', value: 'Rejected' },
  ];

  const getCount = (filter: JobStatus | 'All') => {
    if (filter === 'All') return jobs.length;
    return jobs.filter(j => j.status === filter).length;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value;
        return (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
            style={{ borderWidth: isActive ? '0' : '0.5px' }}
          >
            {filter.label} ({getCount(filter.value)})
          </button>
        );
      })}
    </div>
  );
}
