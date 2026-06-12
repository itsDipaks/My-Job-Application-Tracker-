'use client';

import { useState, useEffect } from 'react';
import { Briefcase, Plus } from 'lucide-react';
import { Job, JobStatus, JobSource, DeveloperType, CompanyType } from '@/types/job';
import StatsBar from '@/components/jobs/StatsBar';
import FilterBar from '@/components/jobs/FilterBar';
import JobCard from '@/components/jobs/JobCard';
import AddJobModal from '@/components/jobs/AddJobModal';
import ScrapJobModal from '@/components/jobs/ScrapJobModal';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';

// Sample data
const initialJobs: Job[] = [
  {
    id: '1',
    company: 'Zepto',
    role: 'Frontend Engineer',
    developer_type: 'Frontend Developer',
    source: 'Naukri',
    company_type: 'Product',
    status: 'Interview',
    appliedDate: '2024-01-15',
    appliedTime: '10:30',
    salary: '8-12 LPA',
    location: 'Remote',
    skills: ['React', 'TypeScript', 'Next.js'],
    interviewQuestions: [
      'Explain the Virtual DOM and how React uses it for efficient rendering.',
      'What are React Hooks? Explain useState and useEffect with examples.',
      'How do you handle state management in large React applications?',
      'What is the difference between controlled and uncontrolled components?',
      'Explain the concept of code splitting and lazy loading in Next.js.',
    ],
  },
  {
    id: '2',
    company: 'Groww',
    role: 'React Developer',
    developer_type: 'React Developer',
    source: 'LinkedIn',
    company_type: 'Product',
    status: 'Screening',
    appliedDate: '2024-01-18',
    appliedTime: '14:15',
    salary: '10-15 LPA',
    location: 'Bangalore',
    skills: [],
  },
  {
    id: '3',
    company: 'Razorpay',
    role: 'Frontend Engineer',
    developer_type: 'Full Stack Developer',
    source: 'Instahyre',
    company_type: 'Product',
    status: 'Applied',
    appliedDate: '2024-01-10',
    appliedTime: '09:45',
    salary: '12-18 LPA',
    location: 'Remote',
    skills: ['React', 'Redux', 'Webpack'],
    notes: 'No response · 5 days',
  },
  {
    id: '4',
    company: 'PhonePe',
    role: 'Senior Frontend Developer',
    developer_type: 'MERN Stack Developer',
    source: 'Referral',
    company_type: 'Product',
    status: 'Rejected',
    appliedDate: '2024-01-08',
    appliedTime: '16:20',
    salary: '14-20 LPA',
    location: 'Pune',
    skills: ['React', 'Node.js', 'GraphQL'],
    notes: 'Rejected after screening',
  },
]
export default function TrackerPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeFilter, setActiveFilter] = useState<JobStatus | 'All'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScrapModalOpen, setIsScrapModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrapLoading, setIsScrapLoading] = useState(false);

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/job/get-jobs');

      if (response.data.s === 1 || response.status === 200) {
        const jobsData = response.data.data || [];
        
        // Map API response to Job type
        const mappedJobs: Job[] = jobsData.map((job: any) => ({
          id: job.id?.toString() || job.job_id?.toString(),
          company: job.company_name || job.company,
          role: getRoleName(job.role),
          developer_type: getDeveloperType(job.role),
          source: job.source,
          company_type: job.company_type === 1 ? 'Service' : 'Product',
          status: job.status || 'Applied',
          appliedDate: job.applied_on?.split(' ')[0] || job.applied_date,
          appliedTime: job.applied_on?.split(' ')[1]?.substring(0, 5) || job.applied_time,
          salary: job.salary,
          location: job.location,
          jobUrl: job.job_url,
          skills: job.skills || [],
          notes: job.notes,
          interviewQuestions: job.interview_questions || [],
        }));

        setJobs(mappedJobs);
      } else {
        toast.error('Failed to fetch jobs');
      }
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      toast.error(error.response?.data?.m || 'Failed to fetch jobs');
    } finally {
      setIsLoading(false);
    }
  };
  const filteredJobs = activeFilter === 'All'
    ? jobs
    : jobs.filter(job => job.status === activeFilter)
  const handleAddJob = async (data: {
    company: string;
    source: JobSource;
    company_type: CompanyType;
    appliedDate: string;
    appliedTime: string;
    job_role: number;
  }) => {
    try {
      // Combine date and time into datetime format (YYYY-MM-DD HH:MM:SS)
      const appliedOn = `${data.appliedDate} ${data.appliedTime}:00`;

      // Convert company_type to number: Service = 1, Product = 2
      const companyTypeId = data.company_type === 'Service' ? 1 : 2;

      // Prepare API payload
      const payload = {
        company_name: data.company,
        job_role: data.job_role, // ID 1=Frontend, 2=Backend, 3=Full Stack, 4=DevOps
        source: data.source, // "LinkedIn", "Naukri", etc.
        applied_on: appliedOn, // "YYYY-MM-DD HH:MM:SS"
        company_type: companyTypeId, // 1 = Service, 2 = Product
      };

      // Call API
      const response = await api.post('/job/add-job', payload);

      if (response.data.s === 1 || response.status === 200 || response.status === 201) {
        toast.success(response.data.m || 'Job application added successfully!');
        
        // Add to local state for immediate UI update
        const newJob: Job = {
          id: response.data.data?.id || Date.now().toString(),
          company: data.company,
          role: getRoleName(data.job_role),
          developer_type: getDeveloperType(data.job_role),
          source: data.source,
          company_type: data.company_type,
          status: 'Applied',
          appliedDate: data.appliedDate,
          appliedTime: data.appliedTime,
        };
        setJobs([newJob, ...jobs]);
      } else {
        toast.error(response.data.m || 'Failed to add job application');
      }
    } catch (error: any) {
      console.error('Error adding job:', error);
      const errorMessage = error.response?.data?.m || error.message || 'Failed to add job application';
      toast.error(errorMessage);
    }
  };

  const handleScrapJob = async (jobUrl: string) => {
    try {
      setIsScrapLoading(true);

      // Prepare API payload
      const payload = {
        job_url: jobUrl,
      };

      // Call API
      const response = await api.post('/job/scrap-jobs-post', payload);

      if (response.data.s === 1 || response.status === 200 || response.status === 201) {
        toast.success(response.data.m || 'Job details scraped successfully!');
        
        // If the API returns job data, add it to the list
        if (response.data.data) {
          const scrapedJob = response.data.data;
          const newJob: Job = {
            id: scrapedJob.id?.toString() || Date.now().toString(),
            company: scrapedJob.company_name || scrapedJob.company || 'Unknown',
            role: scrapedJob.role_name || scrapedJob.role || 'Not specified',
            developer_type: 'Full Stack Developer',
            source: scrapedJob.source || 'Other',
            company_type: scrapedJob.company_type === 1 ? 'Service' : 'Product',
            status: 'Applied',
            appliedDate: new Date().toISOString().split('T')[0],
            appliedTime: `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`,
            salary: scrapedJob.salary,
            location: scrapedJob.location,
            jobUrl: jobUrl,
            skills: scrapedJob.skills || [],
            notes: scrapedJob.description,
          };
          setJobs([newJob, ...jobs]);
        }
        
        setIsScrapModalOpen(false);
      } else {
        toast.error(response.data.m || 'Failed to scrap job details');
      }
    } catch (error: any) {
      console.error('Error scraping job:', error);
      const errorMessage = error.response?.data?.m || error.message || 'Failed to scrap job details';
      toast.error(errorMessage);
    } finally {
      setIsScrapLoading(false);
    }
  };

  // Helper function to map role ID to role name
  const getRoleName = (roleId: number): string => {
    const roleMap: { [key: number]: string } = {
      1: 'Frontend Developer',
      2: 'Backend Developer',
      3: 'Full Stack Developer',
      4: 'DevOps Engineer',
    };
    return roleMap[roleId] || 'Developer';
  };

  // Helper function to map role ID to developer type
  const getDeveloperType = (roleId: number): DeveloperType => {
    const typeMap: { [key: number]: DeveloperType } = {
      1: 'Frontend Developer',
      2: 'Backend Developer',
      3: 'Full Stack Developer',
      4: 'DevOps Engineer',
    };
    return typeMap[roleId] || 'Full Stack Developer';
  };
  const handleStatusChange = (id: string, status: JobStatus) => {
    setJobs(jobs.map(job => 
      job.id === id ? { ...job, status } : job
    ));
  }
  const handleDelete = (id: string) => {
    setJobs(jobs.filter(job => job.id !== id));
  }
  const handleExtractSkills = (id: string, jd: string) => {
    // In real app, this would call Claude API
    const extractedSkills = ['React', 'TypeScript', 'REST APIs', 'Git'];
    setJobs(jobs.map(job =>
      job.id === id ? { ...job, skills: extractedSkills } : job
    ));
  }
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase size={20} className="text-indigo-400" />
            <h1 className="text-lg font-medium text-white">Job Tracker</h1>
          </div>
          <div className="text-sm text-gray-400">{currentDate}</div>
        </div>

        {/* Stats Bar */}
        <StatsBar jobs={jobs} />

        {/* Filter Tabs */}
        <FilterBar
          jobs={jobs}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Job Cards */}
        <div className="space-y-2.5">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              <p className="mt-4 text-gray-400 text-sm">Loading jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              No jobs found. Add your first job application!
            </div>
          ) : (
            filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onExtractSkills={handleExtractSkills}
              />
            ))
          )}
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all hover:scale-110 z-30 shadow-indigo-500/50"
        aria-label="Add new job"
      >
        <Plus size={24} />
      </button>

      {/* Floating Scrap Button */}
      <button
        onClick={() => setIsScrapModalOpen(true)}
        className="fixed bottom-6 right-24 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-all hover:scale-110 z-30 shadow-purple-500/50"
        aria-label="Scrap job from URL"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      </button>

      {/* Add Job Modal */}
      <AddJobModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddJob}
      />

      {/* Scrap Job Modal */}
      <ScrapJobModal
        isOpen={isScrapModalOpen}
        onClose={() => setIsScrapModalOpen(false)}
        onScrap={handleScrapJob}
        isLoading={isScrapLoading}
      />
    </div>
  );
}
