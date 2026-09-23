import { apiRequest } from "./apiClient";

import type {
  Comment,
  Sprint,
  Task,
  TaskPriority,
  TaskStatus,
  User,
} from "../types/task";

export interface CreateTaskInput {
  title: string;
  description: string;
  priority: TaskPriority;
  assigneeId: number;
  dueDate: string;
  sprintId: number;
}

export interface UpdateTaskInput
  extends CreateTaskInput {
  status: TaskStatus;
}

const toBackendStatus = (
  status: TaskStatus,
) =>
  status === "in-progress"
    ? "in_progress"
    : status;

const toBackendPriority = (
  priority: TaskPriority,
) => priority;

// =====================================================
// TASKS
// =====================================================

export async function getTasks(): Promise<Task[]> {
  return apiRequest<Task[]>("/tasks");
}

// =====================================================
// USERS
// =====================================================

export async function getUsers(): Promise<User[]> {
  return apiRequest<User[]>("/users");
}

// =====================================================
// SPRINTS
// =====================================================

export async function getSprints(): Promise<Sprint[]> {
  return apiRequest<Sprint[]>("/sprints");
}

// =====================================================
// COMMENTS
// =====================================================

export async function getComments(
  taskId?: number,
): Promise<Comment[]> {
  return apiRequest<Comment[]>(
    taskId
      ? `/comments?taskId=${taskId}`
      : "/comments",
  );
}

// =====================================================
// CREATE TASK
// =====================================================

export async function createTask(
  input: CreateTaskInput,
): Promise<Task> {
  return apiRequest<Task>(
    "/tasks",
    {
      method: "POST",

      body: JSON.stringify({
        ...input,

        priority:
          toBackendPriority(
            input.priority,
          ),
      }),
    },
  );
}

// =====================================================
// UPDATE TASK
// =====================================================

export async function updateTask(
  id: number,
  input: UpdateTaskInput,
): Promise<Task> {
  return apiRequest<Task>(
    `/tasks/${id}`,
    {
      method: "PUT",

      body: JSON.stringify({
        ...input,

        status:
          toBackendStatus(
            input.status,
          ),

        priority:
          toBackendPriority(
            input.priority,
          ),
      }),
    },
  );
}

// =====================================================
// MOVE TASK
// =====================================================

export async function moveTask(
  id: number,
  status: TaskStatus,
  order: number,
): Promise<Task> {
  return apiRequest<Task>(
    `/tasks/${id}/move`,
    {
      method: "PATCH",

      body: JSON.stringify({
        status:
          toBackendStatus(status),

        order,
      }),
    },
  );
}

// =====================================================
// DELETE TASK
// =====================================================

export async function deleteTask(
  id: number,
): Promise<void> {
  return apiRequest<void>(
    `/tasks/${id}`,
    {
      method: "DELETE",
    },
  );
}

// =====================================================
// CREATE COMMENT
// =====================================================

export async function createComment(
  taskId: number,
  text: string,
): Promise<Comment> {
  return apiRequest<Comment>(
    `/comments?taskId=${taskId}`,
    {
      method: "POST",

      body: JSON.stringify({
        text,
      }),
    },
  );
}

// =====================================================
// DELETE COMMENT
// =====================================================

export async function deleteComment(
  id: number,
): Promise<void> {
  return apiRequest<void>(
    `/comments/${id}`,
    {
      method: "DELETE",
    },
  );
}