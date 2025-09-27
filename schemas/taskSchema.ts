import { z } from 'zod';

export const CreateTaskSchema = z.object({
  name: z
    .string()
    .min(5, 'Task name must be at least 5 characters')
    .max(200, 'Task name must be less than 200 characters')
    .trim(),
  description: z
    .string()
    .max(300, 'Description must be less than 300 characters')
    .optional()
    .or(z.literal('')),
  priority: z.enum(['low', 'medium', 'high'], {
    message: 'Priority must be low, medium, or high'
  }),
  list_id: z.number().positive('List ID must be a positive number'),
});

export const SubTaskSchema = z.object({
  id: z.string(),
  text: z
    .string()
    .min(1, 'Subtask text is required')
    .max(100, 'Subtask text must be less than 100 characters')
    .trim(),
  completed: z.boolean().default(false),
});

export const UpdateTaskSchema = z.object({
  name: z
    .string()
    .min(5, 'Task name must be at least 5 characters')
    .max(200, 'Task name must be less than 200 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(300, 'Description must be less than 300 characters')
    .optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  is_completed: z.boolean().optional(),
});

export const TaskFormSchema = z.object({
  name: z
    .string()
    .min(5, 'Task name must be at least 5 characters')
    .max(200, 'Task name must be less than 200 characters')
    .trim(),
  description: z
    .string()
    .max(300, 'Description must be less than 300 characters')
    .optional()
    .or(z.literal('')),
  priority: z.enum(['low', 'medium', 'high']),
  selectedIcon: z.string().min(1, 'Icon is required'),
  subTasks: z.array(SubTaskSchema).default([]),
});

export type CreateTaskData = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskData = z.infer<typeof UpdateTaskSchema>;
export type TaskFormData = z.infer<typeof TaskFormSchema>;
export type SubTaskData = z.infer<typeof SubTaskSchema>;

export const validateCreateTask = (data: unknown): CreateTaskData => {
  return CreateTaskSchema.parse(data);
};

export const validateUpdateTask = (data: unknown): UpdateTaskData => {
  return UpdateTaskSchema.parse(data);
};

export const validateTaskForm = (data: unknown): TaskFormData => {
  return TaskFormSchema.parse(data);
};

export const safeValidateCreateTask = (data: unknown) => {
  return CreateTaskSchema.safeParse(data);
};

export const safeValidateUpdateTask = (data: unknown) => {
  return UpdateTaskSchema.safeParse(data);
};

export const safeValidateTaskForm = (data: unknown) => {
  return TaskFormSchema.safeParse(data);
};
