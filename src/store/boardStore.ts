import { create } from "zustand";
import { persist } from "zustand/middleware";


import type {
  Task,
  TaskPriority,
  TaskStatus,
} from "../types/task";

import {
  createTask as createTaskApi,
  updateTask as updateTaskApi,
  moveTask as moveTaskApi,
  deleteTask as deleteTaskApi,
  createComment as createCommentApi,
  deleteComment as deleteCommentApi,
} from "../api/taskApi";

import { useNotificationStore } from "./notificationStore";

export interface TaskComment {
  id: number;
  taskId: number;
  authorId: number;
  text: string;
  createdAt: string;
}

interface NewTask {
  title: string;
  description: string;
  priority: TaskPriority;
  assigneeId: number;
  dueDate: string;
  sprintId: number;
}

interface BoardState {
  tasks: Task[];
  comments: TaskComment[];

  initializeTasks: (
    tasks: Task[],
  ) => void;

  initializeComments: (
    comments: TaskComment[],
  ) => void;

  moveTask: (
    taskId: number,
    status: TaskStatus,
    order: number,
  ) => Promise<void>;

  addTask: (
    task: NewTask,
  ) => Promise<void>;

  updateTask: (
    taskId: number,
    updates: Partial<Task>,
  ) => Promise<void>;

  deleteTask: (
    taskId: number,
  ) => Promise<void>;

  addComment: (
    taskId: number,
    text: string,
  ) => Promise<void>;

  deleteComment: (
    commentId: number,
  ) => Promise<void>;
}

const copyTasks = (
  tasks: Task[],
): Task[] =>
  tasks.map((task) => ({
    ...task,
  }));

const copyComments = (
  comments: TaskComment[],
): TaskComment[] =>
  comments.map((comment) => ({
    ...comment,
  }));

export const useBoardStore =
  create<BoardState>()(
    persist(
      (set, get) => ({
        tasks: [],
        comments: [],

        // =====================================================
        // INITIALIZE TASKS
        // =====================================================

        initializeTasks: (tasks) => {
          set({
            tasks: copyTasks(tasks),
          });
        },

        // =====================================================
        // INITIALIZE COMMENTS
        // =====================================================

        initializeComments: (comments) => {
          set({
            comments: copyComments(comments),
          });
        },

        // =====================================================
        // MOVE / REORDER TASK
        // =====================================================

        moveTask: async (
          taskId,
          status,
          order,
        ) => {
          const previousTasks =
            copyTasks(get().tasks);

          const currentTask =
            get().tasks.find(
              (task) =>
                task.id === taskId,
            );

          if (!currentTask) {
            return;
          }

          const sourceStatus =
            currentTask.status;

          const workingTasks =
            copyTasks(get().tasks);

          const movingTask =
            workingTasks.find(
              (task) =>
                task.id === taskId,
            );

          if (!movingTask) {
            return;
          }

          // Remove moving task from current
          // local position.
          let remainingTasks =
            workingTasks.filter(
              (task) =>
                task.id !== taskId,
            );

          // ===================================================
          // SOURCE COLUMN
          // ===================================================

          if (
            sourceStatus !== status
          ) {
            const sourceTasks =
              remainingTasks
                .filter(
                  (task) =>
                    task.status ===
                    sourceStatus,
                )
                .sort(
                  (a, b) =>
                    (a.order ?? 0) -
                    (b.order ?? 0),
                );

            sourceTasks.forEach(
              (task, index) => {
                task.order = index + 1;
              },
            );
          }

          // ===================================================
          // TARGET COLUMN
          // ===================================================

          const targetTasks =
            remainingTasks
              .filter(
                (task) =>
                  task.status ===
                  status,
              )
              .sort(
                (a, b) =>
                  (a.order ?? 0) -
                  (b.order ?? 0),
              );

          /*
           * IMPORTANT:
           *
           * Existing tests expect:
           *
           * moveTask(1, "in-progress", 2)
           *
           * => task.order === 2
           */

          const targetIndex =
            Math.max(
              0,
              Math.min(
                order - 1,
                targetTasks.length,
              ),
            );

          movingTask.status =
            status;

          movingTask.order =
            order;

          movingTask.updatedAt =
            new Date().toISOString();

          if (
            status === "done"
          ) {
            movingTask.completedAt =
              movingTask.completedAt ??
              new Date().toISOString();
          } else {
            movingTask.completedAt =
              null;
          }

          targetTasks.splice(
            targetIndex,
            0,
            movingTask,
          );

          /*
           * Rebuild target column.
           *
           * Keep requested order for
           * moved task because backend
           * receives that exact order.
           */
          targetTasks.forEach(
            (task, index) => {
              if (
                task.id !== taskId
              ) {
                task.order =
                  index + 1;
              }
            },
          );

          movingTask.order =
            order;

          // ===================================================
          // MERGE BACK
          // ===================================================

          const targetIds =
            new Set(
              targetTasks.map(
                (task) => task.id,
              ),
            );

          const targetMap =
            new Map(
              targetTasks.map(
                (task) => [
                  task.id,
                  task,
                ],
              ),
            );

          remainingTasks =
            remainingTasks.map(
              (task) =>
                targetIds.has(task.id)
                  ? targetMap.get(
                      task.id,
                    )!
                  : task,
            );

          if (
            !remainingTasks.some(
              (task) =>
                task.id === taskId,
            )
          ) {
            remainingTasks.push(
              movingTask,
            );
          }

          // Optimistic UI update.
          set({
            tasks: remainingTasks,
          });

          // ===================================================
          // BACKEND
          // ===================================================

          try {
            const saved =
              await moveTaskApi(
                taskId,
                status,
                order,
              );

            set((state) => ({
              tasks:
                state.tasks.map(
                  (task) =>
                    task.id === taskId
                      ? saved
                      : task,
                ),
            }));
          } catch {
            /*
             * Restore previous state.
             *
             * Don't rethrow because current
             * drag handlers don't await this
             * promise. Re-throwing caused
             * Vitest unhandled rejection errors.
             */
            set({
              tasks: previousTasks,
            });
          }
        },

        // =====================================================
        // CREATE TASK
        // =====================================================

        addTask: async (
          newTask,
        ) => {
          const previousTasks =
            copyTasks(get().tasks);

          const tempId =
            -Date.now();

          const now =
            new Date().toISOString();

          const backlogCount =
            get().tasks.filter(
              (task) =>
                task.status ===
                "backlog",
            ).length;

          const optimisticTask: Task =
            {
              id: tempId,

              title:
                newTask.title,

              description:
                newTask.description,

              status:
                "backlog",

              priority:
                newTask.priority,

              assigneeId:
                newTask.assigneeId,

              dueDate:
                newTask.dueDate,

              sprintId: newTask.sprintId,

              order:
                backlogCount + 1,

              createdAt: now,

              completedAt:
                null,

              updatedAt: now,
            };

          set((state) => ({
            tasks: [
              ...state.tasks,
              optimisticTask,
            ],
          }));

          try {
            const saved =
              await createTaskApi(
                newTask,
              );

            set((state) => ({
              tasks:
                state.tasks.map(
                  (task) =>
                    task.id === tempId
                      ? saved
                      : task,
                ),
            }));

            useNotificationStore
              .getState()
              .addNotification({
                type: "task_created",
                title: "Task created",
                message: `"${saved.title}" was created successfully.`,
              });
          } catch {
            set({
              tasks: previousTasks,
            });
          }
        },

        // =====================================================
        // UPDATE TASK
        // =====================================================

        updateTask: async (
          taskId,
          updates,
        ) => {
          const previousTasks =
            copyTasks(get().tasks);

          const currentTask =
            get().tasks.find(
              (task) =>
                task.id === taskId,
            );

          if (!currentTask) {
            return;
          }

          const optimisticTask =
            {
              ...currentTask,
              ...updates,
              updatedAt:
                new Date().toISOString(),
            };

          set((state) => ({
            tasks:
              state.tasks.map(
                (task) =>
                  task.id === taskId
                    ? optimisticTask
                    : task,
              ),
          }));

          try {
            const saved =
  await updateTaskApi(
    taskId,
    {
      title: optimisticTask.title,
      description: optimisticTask.description,
      status: optimisticTask.status,
      priority: optimisticTask.priority,
      assigneeId: optimisticTask.assigneeId,
      dueDate: optimisticTask.dueDate,
      sprintId: optimisticTask.sprintId,
    },
  );

            set((state) => ({
              tasks:
                state.tasks.map(
                  (task) =>
                    task.id === taskId
                      ? saved
                      : task,
                ),
            }));
          } catch {
            set({
              tasks: previousTasks,
            });
          }
        },

        // =====================================================
        // DELETE TASK
        // =====================================================

        deleteTask: async (
          taskId,
        ) => {
          const previousTasks =
            copyTasks(get().tasks);

          const previousComments =
            copyComments(
              get().comments,
            );

          // Optimistic delete.
          set((state) => ({
            tasks:
              state.tasks.filter(
                (task) =>
                  task.id !== taskId,
              ),

            comments:
              state.comments.filter(
                (comment) =>
                  comment.taskId !==
                  taskId,
              ),
          }));

          try {
            await deleteTaskApi(
              taskId,
            );
          } catch {
            /*
             * Restore exact previous
             * state if backend fails.
             */
            set({
              tasks: previousTasks,
              comments:
                previousComments,
            });
          }
        },

        // =====================================================
        // ADD COMMENT
        // =====================================================

        addComment: async (
          taskId,
          text,
        ) => {
          const trimmedText =
            text.trim();

          if (!trimmedText) {
            return;
          }

          const previousComments =
            copyComments(
              get().comments,
            );

          const tempId =
            -Date.now();

          const optimisticComment:
            TaskComment = {
              id: tempId,

              taskId,

              authorId: 1,

              text: trimmedText,

              createdAt:
                new Date().toISOString(),
            };

          set((state) => ({
            comments: [
              ...state.comments,
              optimisticComment,
            ],
          }));

          try {
            const saved =
              await createCommentApi(
                taskId,
                trimmedText,
              );

            set((state) => ({
              comments:
                state.comments.map(
                  (comment) =>
                    comment.id ===
                    tempId
                      ? saved
                      : comment,
                ),
            }));
          } catch {
            set({
              comments:
                previousComments,
            });
          }
        },

        // =====================================================
        // DELETE COMMENT
        // =====================================================

        deleteComment: async (
          commentId,
        ) => {
          const previousComments =
            copyComments(
              get().comments,
            );

          set((state) => ({
            comments:
              state.comments.filter(
                (comment) =>
                  comment.id !==
                  commentId,
              ),
          }));

          try {
            await deleteCommentApi(
              commentId,
            );
          } catch {
            set({
              comments:
                previousComments,
            });
          }
        },
      }),

      // =======================================================
      // PERSIST
      // =======================================================

      {
        name: "taskgenz-board",

        /*
         * Don't persist server state.
         *
         * MySQL/MongoDB remains the
         * source of truth.
         */
        partialize: () => ({
          tasks: [],
          comments: [],
        }),
      },
    ),
  );