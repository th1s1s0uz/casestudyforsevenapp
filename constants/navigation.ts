export const AppRoutes = {
  // Main screens
  HOME: '/home',
  DETAILS: '/details',
  
  // Tasks management
  TASKS: '/tasks',
  TASK_DETAIL: '/task-detail/[id]',
  CREATE_TASK: '/task-create',
  EDIT_TASK: '/task-edit/[id]',
} as const;

export const ScreenTitles = {
  HOME: 'Task Manager',
  DETAILS: 'Details',
  TASKS: 'My Tasks',
  TASK_DETAIL: 'Task Details',
  CREATE_TASK: 'Create Task',
  EDIT_TASK: 'Edit Task',
} as const;

export const NavigationHelpers = {
  getTaskDetailRoute: (id: number) => `/task-detail/${id}`,
  getEditTaskRoute: (id: number) => `/task-edit/${id}`,
  getDetailsRoute: (name: string) => ({ pathname: AppRoutes.DETAILS as any, params: { name } }),
  
  // Direct route getters
  getHomeRoute: () => AppRoutes.HOME,
  getTasksRoute: () => AppRoutes.TASKS,
  getCreateTaskRoute: () => AppRoutes.CREATE_TASK,
  getDetailsRoute: () => AppRoutes.DETAILS,
} as const;
