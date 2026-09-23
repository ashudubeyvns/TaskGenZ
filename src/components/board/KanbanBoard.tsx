import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import type {
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";

import {
  useCallback,
  useMemo,
  useState,
} from "react";

import type {
  Task,
  TaskStatus,
  User,
} from "../../types/task";

import {
  useBoardStore,
} from "../../store/boardStore";

import {
  useNotificationStore,
} from "../../store/notificationStore";

import KanbanColumn from "./KanbanColumn";

import TaskCard from "./TaskCard";

const columns: {
  id: TaskStatus;
  title: string;
}[] = [
  {
    id: "backlog",
    title: "Backlog",
  },
  {
    id: "in-progress",
    title: "In Progress",
  },
  {
    id: "review",
    title: "Review",
  },
  {
    id: "done",
    title: "Done",
  },
];

interface KanbanBoardProps {
  users: User[];
  tasks?: Task[];
  onTaskClick: (
    task: Task,
  ) => void;
}

export default function KanbanBoard({
  users,
  tasks,
  onTaskClick,
}: KanbanBoardProps) {
  // =========================================================
  // BOARD STORE
  // =========================================================

  const storeTasks =
    useBoardStore(
      (state) => state.tasks,
    );

  const moveTask =
    useBoardStore(
      (state) => state.moveTask,
    );

  // =========================================================
  // NOTIFICATION STORE
  // =========================================================

    const addNotification =
      useNotificationStore(
      (state) => state.addNotification,
    );

  // =========================================================
  // VISIBLE TASKS
  // =========================================================

  const visibleTasks =
    tasks ?? storeTasks;

  // =========================================================
  // DRAG STATE
  // =========================================================

  const [
    activeTaskId,
    setActiveTaskId,
  ] = useState<number | null>(
    null,
  );

  // =========================================================
  // DND SENSORS
  // =========================================================

  const sensors = useSensors(
    useSensor(
      PointerSensor,
      {
        activationConstraint: {
          distance: 5,
        },
      },
    ),
  );

  // =========================================================
  // ACTIVE TASK
  // =========================================================

  const activeTask =
    useMemo(
      () =>
        visibleTasks.find(
          (task) =>
            task.id ===
            activeTaskId,
        ) ?? null,
      [
        visibleTasks,
        activeTaskId,
      ],
    );

  // =========================================================
  // DRAG START
  // =========================================================

  const handleDragStart =
    useCallback(
      (event: DragStartEvent) => {
        setActiveTaskId(
          Number(
            event.active.id,
          ),
        );
      },
      [],
    );

  // =========================================================
  // DRAG CANCEL
  // =========================================================

  const handleDragCancel =
    useCallback(() => {
      setActiveTaskId(null);
    }, []);

  // =========================================================
  // GET STATUS FROM DROP TARGET
  // =========================================================

  function formatStatus(
  status: TaskStatus,
): string {
  return status
    .replace("-", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

  const getStatusFromId =
    useCallback(
      (
        id: string,
      ): TaskStatus | null => {
        // Dropped directly on a column
        if (
          id.startsWith(
            "column-",
          )
        ) {
          return (
            columns.find(
              (column) =>
                `column-${column.id}` ===
                id,
            )?.id ?? null
          );
        }

        // Dropped on another task
        const task =
          storeTasks.find(
            (item) =>
              String(item.id) ===
              id,
          );

        return (
          task?.status ?? null
        );
      },
      [storeTasks],
    );

  // =========================================================
  // DRAG END
  // =========================================================

  const handleDragEnd =
    useCallback(
      (event: DragEndEvent) => {
        setActiveTaskId(
          null,
        );

        const {
          active,
          over,
        } = event;

        if (!over) {
          return;
        }

        const taskId =
          Number(active.id);

        const movingTask =
          storeTasks.find(
            (task) =>
              task.id ===
              taskId,
          );

        if (!movingTask) {
          return;
        }

        const targetId =
          String(over.id);

        const targetStatus =
          getStatusFromId(
            targetId,
          );

        if (!targetStatus) {
          return;
        }

        // =====================================================
        // CALCULATE TARGET ORDER
        // =====================================================

        const targetTasks =
          storeTasks
            .filter(
              (task) =>
                task.status ===
                  targetStatus &&
                task.id !==
                  taskId,
            )
            .sort(
              (a, b) =>
                a.order - b.order,
            );

        let targetOrder =
          targetTasks.length +
          1;

        // =====================================================
        // DROP ON ANOTHER TASK
        // =====================================================

        const overTask =
          storeTasks.find(
            (task) =>
              String(task.id) ===
              targetId,
          );

        if (
          overTask &&
          overTask.id !== taskId
        ) {
          const targetIndex =
            targetTasks.findIndex(
              (task) =>
                task.id ===
                overTask.id,
            );

          if (
            targetIndex >= 0
          ) {
            targetOrder =
              targetIndex + 1;
          }
        }

        // =====================================================
        // NOTHING CHANGED
        // =====================================================

        if (
          movingTask.status ===
            targetStatus &&
          movingTask.order ===
            targetOrder
        ) {
          return;
        }

// =====================================================
// MOVE TASK
// =====================================================

        moveTask(
  taskId,
  targetStatus,
  targetOrder,
);

// =====================================================
// CREATE NOTIFICATION
// =====================================================

if (
  movingTask.status !==
  targetStatus
) {
  addNotification({
    type: "task_moved",
    title: "Task moved",
    message: `"${movingTask.title}" moved from ${formatStatus(
      movingTask.status,
    )} to ${formatStatus(
      targetStatus,
    )}.`,
  });
} else {
  addNotification({
    type: "task_reordered",
    title: "Task reordered",
    message: `"${movingTask.title}" was moved to position ${targetOrder} in ${formatStatus(
      targetStatus,
    )}.`,
  });
}

      },
      [
  storeTasks,
  getStatusFromId,
  moveTask,
  addNotification,
],
    );

  // =========================================================
  // COLUMN TASKS
  // =========================================================

  const columnTasks =
    useMemo(() => {
      return columns.map(
        (column) => ({
          ...column,

          tasks:
            visibleTasks
              .filter(
                (task) =>
                  task.status ===
                  column.id,
              )
              .sort(
                (a, b) =>
                  a.order - b.order,
              ),
        }),
      );
    }, [visibleTasks]);

  // =========================================================
  // ACTIVE USER
  // =========================================================

  const activeUser =
    useMemo(() => {
      if (!activeTask) {
        return undefined;
      }

      return users.find(
        (user) =>
          user.id ===
          activeTask.assigneeId,
      );
    }, [
      activeTask,
      users,
    ]);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={
        closestCorners
      }
      onDragStart={
        handleDragStart
      }
      onDragCancel={
        handleDragCancel
      }
      onDragEnd={
        handleDragEnd
      }
    >
      <div className="grid min-w-[1100px] grid-cols-4 gap-4">
        {columnTasks.map(
          (column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={column.tasks}
              users={users}
              onTaskClick={
                onTaskClick
              }
            />
          ),
        )}
      </div>

      {/* =====================================================
          DRAG OVERLAY
      ===================================================== */}

      <DragOverlay>
        {activeTask ? (
          <TaskCard
            task={activeTask}
            user={activeUser}
            onClick={() =>
              undefined
            }
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}