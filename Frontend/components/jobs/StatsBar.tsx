import { Job } from '@/types/job';

interface StatsBarProps {
  jobs: Job[];
}

export default function StatsBar({ jobs }: StatsBarProps) {
  const stats = {
    total: jobs.length,
    screening: jobs.filter(j => j.status === 'Screening').length,
    interview: jobs.filter(j => j.status === 'Interview').length,
    offer: jobs.filter(j => j.status === 'Offer').length,
    rejected: jobs.filter(j => j.status === 'Rejected').length,
  };

  const statItems = [
    { label: 'Total', value: stats.total, color: 'text-gray-700' },
    { label: 'Screening', value: stats.screening, color: 'text-blue-600' },
    { label: 'Interview', value: stats.interview, color: 'text-amber-600' },
    { label: 'Offer', value: stats.offer, color: 'text-green-600' },
    { label: 'Rejected', value: stats.rejected, color: 'text-red-600' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {statItems.map((stat) => (
        <div
          key={stat.label}
          className="bg-gray-100 rounded-lg p-3 text-center"
        >
          <div className={`text-[22px] font-medium ${stat.color}`}>
            {stat.value}
          </div>
          <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
