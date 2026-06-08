'use client';

import { Job, JobStatus } from '@/types/job';
import { Calendar, Clock, Brain, ExternalLink, Trash2 } from 'lucide-react';
import { useState } from 'react';
import InterviewQuestions from './InterviewQuestions';
import JDExtractor from './JDExtractor';

interface JobCardProps {
  job: Job;
  onStatusChange: (id: string, status: JobStatus) => void;
  onDelete: (id: string) => void;
  onExtractSkills: (id: string, jd: string) => void;
}

export default function JobCard({ job, onStatusChange, onDelete, onExtractSkills }: JobCardProps) {
  const [showExpanded, setShowExpanded] = useState(
    job.status === 'Interview' || job.status === 'Screening'
  );

  const statusColors: Record<JobStatus, { bg: string; text: string; border?: string }> = {
    Applied: { bg: 'bg-blue-50', text: 'text-blue-800' },
    Screening: { bg: 'bg-amber-50', text: 'text-amber-800' },
    Interview: { bg: 'bg-purple-50', text: 'text-purple-800' },
    Offer: { bg: 'bg-green-50', text: 'text-green-800' },
    Rejected: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-300' },
  };

  const cardStyle = job.status === 'Rejected'
    ? 'opacity-70 border-red-300'
    : 'border-gray-300';

  const getDaysAgo = () => {
    const date = new Date(job.appliedDate);
    const now = new Date();
    const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div
      className={`bg-white border rounded-xl p-4 ${cardStyle}`}
      style={{ borderWidth: '0.5px' }}
    >
      {/* Top Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
        {/* Left: Company & Role */}
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900 mb-1">
            {job.company} — {job.role}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {new Date(job.appliedDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <span>·</span>
            <span>{job.source}</span>
            {job.salary && (
              <>
                <span>·</span>
                <span>{job.salary}</span>
              </>
            )}
            {job.location && (
              <>
                <span>·</span>
                <span>{job.location}</span>
              </>
            )}
            {job.status === 'Applied' && getDaysAgo() > 3 && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1 text-amber-600">
                  <Clock size={12} />
                  No response · {getDaysAgo()} days
                </span>
              </>
            )}
            {job.notes && (
              <>
                <span>·</span>
                <span>{job.notes}</span>
              </>
            )}
          </div>
        </div>

        {/* Right: Status Badge & Dropdown */}
        <div className="flex items-center gap-2">
          <span
            className={`${statusColors[job.status].bg} ${statusColors[job.status].text} px-3 py-1 rounded-full text-[11px] font-medium`}
          >
            {job.status}
          </span>
          <select
            value={job.status}
            onChange={(e) => onStatusChange(job.id, e.target.value as JobStatus)}
            className="px-2 py-1 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ borderWidth: '0.5px' }}
          >
            <option value="Applied">Applied</option>
            <option value="Screening">Screening</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Bottom Row */}
      <div
        className="pt-3 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        style={{ borderWidth: '0.5px' }}
      >
        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1.5">
          {job.skills && job.skills.length > 0 ? (
            job.skills.map((skill) => (
              <span
                key={skill}
                className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-[11px] font-medium"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400">No skills added</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {job.status === 'Interview' && (
            <button
              onClick={() => setShowExpanded(!showExpanded)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-600 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-50 transition"
              style={{ borderWidth: '0.5px' }}
            >
              <Brain size={14} />
              Prep interview
            </button>
          )}
          {job.jobUrl && (
            <a
              href={job.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
              style={{ borderWidth: '0.5px' }}
            >
              <ExternalLink size={14} />
            </a>
          )}
          <button
            onClick={() => onDelete(job.id)}
            className="p-1.5 border border-gray-300 rounded-lg text-red-600 hover:bg-red-50 transition"
            style={{ borderWidth: '0.5px' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Expanded Section */}
      {showExpanded && job.status === 'Interview' && job.interviewQuestions && (
        <InterviewQuestions questions={job.interviewQuestions} />
      )}
      {showExpanded && job.status === 'Screening' && (
        <JDExtractor onExtract={(jd) => onExtractSkills(job.id, jd)} />
      )}
    </div>
  );
}
