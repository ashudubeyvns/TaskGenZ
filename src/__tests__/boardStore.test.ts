import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  useBoardStore,
} from "../store/boardStore";

import type {
  Task,
} from "../types/task";

const createTask = (
  overrides: Partial<Task> = {},
): Task => ({
  id: 1,
  title: "Test Task",
  description:
    "Test description",
  status: "backlog",
  priority: "medium",
  assigneeId: 1,
  dueDate:
    "2026-08-30",
  sprintId: 3,
  order: 1,
  createdAt:
    "2026-08-24T00:00:00.000Z",
  completedAt: null,
  updatedAt:
    "2026-08-24T00:00:00.000Z",
  ...overrides,
});

beforeEach(() => {
  localStorage.clear();

  useBoardStore.setState({
    tasks: [],
    comments: [],
  });
});

describe(
  "boardStore",
  () => {
    it(
      "initializes tasks",
      () => {
        const task =
          createTask();

        useBoardStore
          .getState()
          .initializeTasks([
            task,
          ]);

        expect(
          useBoardStore
            .getState()
            .tasks,
        ).toHaveLength(1);

        expect(
          useBoardStore
            .getState()
            .tasks[0]
            .title,
        ).toBe(
          "Test Task",
        );
      },
    );

    it(
      "moves a task to another status",
      () => {
        const task =
          createTask();

        useBoardStore
          .getState()
          .initializeTasks([
            task,
          ]);

        useBoardStore
          .getState()
          .moveTask(
            1,
            "in-progress",
            2,
          );

        const updatedTask =
          useBoardStore
            .getState()
            .tasks[0];

        expect(
          updatedTask.status,
        ).toBe(
          "in-progress",
        );

        expect(
          updatedTask.order,
        ).toBe(2);
      },
    );

    it(
      "sets completedAt when a task moves to done",
      () => {
        const task =
          createTask();

        useBoardStore
          .getState()
          .initializeTasks([
            task,
          ]);

        useBoardStore
          .getState()
          .moveTask(
            1,
            "done",
            1,
          );

        const updatedTask =
          useBoardStore
            .getState()
            .tasks[0];

        expect(
          updatedTask.status,
        ).toBe("done");

        expect(
          updatedTask.completedAt,
        ).not.toBeNull();
      },
    );

    it(
      "adds a new task to backlog",
      () => {
       useBoardStore
        .getState()
        .addTask({
          title: "New Task",
          description: "This is a new task",
          priority: "high",
          assigneeId: 1,
          dueDate: "2026-09-01",
          sprintId: 3,
        });

        const tasks =
          useBoardStore
            .getState()
            .tasks;

        expect(tasks).toHaveLength(
          1,
        );

        expect(
          tasks[0].title,
        ).toBe(
          "New Task",
        );

        expect(
          tasks[0].status,
        ).toBe(
          "backlog",
        );

        expect(
          tasks[0].priority,
        ).toBe("high");
      },
    );

    it(
      "updates an existing task",
      () => {
        useBoardStore
          .getState()
          .initializeTasks([
            createTask(),
          ]);

        useBoardStore
          .getState()
          .updateTask(
            1,
            {
              title:
                "Updated Task",
              priority:
                "high",
            },
          );

        const task =
          useBoardStore
            .getState()
            .tasks[0];

        expect(
          task.title,
        ).toBe(
          "Updated Task",
        );

        expect(
          task.priority,
        ).toBe("high");
      },
    );

    it(
      "deletes a task",
      () => {
        useBoardStore
          .getState()
          .initializeTasks([
            createTask(),
          ]);

        useBoardStore
          .getState()
          .deleteTask(1);

        expect(
          useBoardStore
            .getState()
            .tasks,
        ).toHaveLength(0);
      },
    );

    it(
      "does not add an empty comment",
      () => {
        useBoardStore
          .getState()
          .addComment(
            1,
            "   ",
          );

        expect(
          useBoardStore
            .getState()
            .comments,
        ).toHaveLength(0);
      },
    );
  },
);