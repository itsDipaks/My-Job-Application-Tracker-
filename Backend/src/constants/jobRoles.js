/**
 * Job Role Enum Mapping
 * These constants define the valid job roles in the system
 */

export const JOB_ROLES = {
  FRONTEND: 1,
  BACKEND: 2,
  FULL_STACK: 3,
  DEVOPS: 4,
};

export const JOB_ROLE_NAMES = {
  [JOB_ROLES.FRONTEND]: 'Frontend Developer',
  [JOB_ROLES.BACKEND]: 'Backend Developer',
  [JOB_ROLES.FULL_STACK]: 'Full Stack Developer',
  [JOB_ROLES.DEVOPS]: 'DevOps Engineer',
};

/**
 * Helper function to get role name from ID
 */
export const getRoleName = (roleId) => {
  return JOB_ROLE_NAMES[roleId] || 'Developer';
};

/**
 * Helper function to validate role ID
 */
export const isValidRoleId = (roleId) => {
  return Object.values(JOB_ROLES).includes(roleId);
};

/**
 * Get all valid role IDs
 */
export const getValidRoleIds = () => {
  return Object.values(JOB_ROLES);
};
