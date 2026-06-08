export type JobSource = 'Naukri' | 'LinkedIn' | 'Instahyre' | 'Referral' | 'Indeed' | 'Company Website' | 'Email' | 'Other';
export type JobStatus = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Rejected';
export type DeveloperType = 'React Developer' | 'MERN Stack Developer' | 'Full Stack Developer' | 'Frontend Developer' | 'Backend Developer' | 'DevOps Engineer' | 'Mobile Developer' | 'Other';
export type CompanyType = 'Service' | 'Product';

export type Job = {
  id: string;
  company: string;
  role: string;
  developer_type: DeveloperType;
  source: JobSource;
  platform_id?: string;
  company_type: CompanyType;
  status: JobStatus;
  appliedDate: string;
  appliedTime: string; // 24-hour format HH:MM
  salary?: string;
  location?: string;
  jobUrl?: string;
  skills?: string[];
  notes?: string;
  interviewQuestions?: string[];
};
