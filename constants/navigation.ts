/**
 * Navigation routes and screen names
 * Centralized navigation constants for type-safe routing
 */
export const AppRoutes = {
  // Main screens
  HOME: '/',
  DETAILS: '/details',
  
  // Tasks management
  TASKS: '/tasks',
  TASK_DETAIL: '/tasks/[id]',
  CREATE_TASK: '/tasks/create',
  EDIT_TASK: '/tasks/edit/[id]',
} as const;

/**
 * Screen titles for consistent naming
 */
export const ScreenTitles = {
  HOME: 'Task Manager',
  DETAILS: 'Details',
  TASKS: 'My Tasks',
  TASK_DETAIL: 'Task Details',
  CREATE_TASK: 'Create Task',
  EDIT_TASK: 'Edit Task',
} as const;

/**
 * Helper functions for navigation
 */
export const NavigationHelpers = {
  getTaskDetailRoute: (id: number) => `/tasks/${id}`,
  getEditTaskRoute: (id: number) => `/tasks/edit/${id}`,
  getDetailsRoute: (name: string) => ({ pathname: AppRoutes.DETAILS as any, params: { name } }),
} as const;
