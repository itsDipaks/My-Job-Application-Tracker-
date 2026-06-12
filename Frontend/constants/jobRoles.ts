/**
 * Job Role Enum Mapping
 * These IDs are used to communicate with the backend
 */

export const JOB_ROLES = {
  FRONTEND: 1,
  BACKEND: 2,
  FULL_STACK: 3,
  DEVOPS: 4,
} as const;

export const JOB_ROLE_NAMES = {
  [JOB_ROLES.FRONTEND]: 'Frontend Developer',
  [JOB_ROLES.BACKEND]: 'Backend Developer',
  [JOB_ROLES.FULL_STACK]: 'Full Stack Developer',
  [JOB_ROLES.DEVOPS]: 'DevOps Engineer',
} as const;

export type JobRoleId = typeof JOB_ROLES[keyof typeof JOB_ROLES];

/**
 * Helper function to get role name from ID
 */
export const getRoleName = (roleId: JobRoleId): string => {
  return JOB_ROLE_NAMES[roleId] || 'Developer';
};

/**
 * Helper function to validate role ID
 */
export const isValidRoleId = (roleId: number): roleId is JobRoleId => {
  return Object.values(JOB_ROLES).includes(roleId as JobRoleId);
};
