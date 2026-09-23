/* eslint-disable react/set-state-in-effect */

import {
  useEffect,
  useState,
} from "react";

import type {
  Task,
  TaskPriority,
  TaskStatus,
  User,
} from "../../types/task";

import {
  useBoardStore,
} from "../../store/boardStore";

interface TaskDrawerProps {
  task: Task | null;
  users: User[];
  onClose: () => void;
}

const statusOptions: {
  value: TaskStatus;
  label: string;
}[] = [
  {
    value: "backlog",
    label: "Backlog",
  },
  {
    value: "in-progress",
    label: "In Progress",
  },
  {
    value: "review",
    label: "Review",
  },
  {
    value: "done",
    label: "Done",
  },
];

const priorityOptions: TaskPriority[] = [
  "low",
  "medium",
  "high",
];

export default function TaskDrawer({
  task,
  users,
  onClose,
}: TaskDrawerProps) {
  // =========================================================
  // BOARD STORE
  // =========================================================

  const updateTask = useBoardStore(
    (state) => state.updateTask,
  );

  const deleteTask = useBoardStore(
    (state) => state.deleteTask,
  );

  const comments = useBoardStore(
    (state) => state.comments,
  );

  const addComment = useBoardStore(
    (state) => state.addComment,
  );

  const deleteComment =
    useBoardStore(
      (state) =>
        state.deleteComment,
    );

  // =========================================================
  // NOTIFICATION STORE
  // =========================================================

  // =========================================================
  // LOCAL FORM STATE
  // =========================================================

  const [title, setTitle] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [status, setStatus] =
    useState<TaskStatus>("backlog");

  const [
    priority,
    setPriority,
  ] =
    useState<TaskPriority>("medium");

  const [
    assigneeId,
    setAssigneeId,
  ] = useState<number>(1);

  const [dueDate, setDueDate] =
    useState("");

  const [
    commentText,
    setCommentText,
  ] = useState("");

  const [
    isEditing,
    setIsEditing,
  ] = useState(false);

  // =========================================================
  // LOAD SELECTED TASK INTO FORM
  // =========================================================
  //
  // This effect intentionally synchronizes the editable
  // form with the task selected by the user.
  //
  // It must run whenever a different task is opened.
  // =========================================================

  useEffect(() => {
    if (!task) {
      return;
    }

    setTitle(task.title);

    setDescription(
      task.description,
    );

    setStatus(task.status);

    setPriority(task.priority);

    setAssigneeId(
      task.assigneeId,
    );

    setDueDate(task.dueDate);

    setCommentText("");

    setIsEditing(false);
  }, [task]);

  // =========================================================
  // NO SELECTED TASK
  // =========================================================

  if (!task) {
    return null;
  }

  const currentTask = task;

  // =========================================================
  // ASSIGNED USER
  // =========================================================

  const assignedUser =
    users.find(
      (user) =>
        user.id === assigneeId,
    );

  // =========================================================
  // TASK COMMENTS
  // =========================================================

  const taskComments =
    comments
      .filter(
        (comment) =>
          comment.taskId ===
          task.id,
      )
      .sort(
        (a, b) =>
          new Date(
            a.createdAt,
          ).getTime() -
          new Date(
            b.createdAt,
          ).getTime(),
      );

  // =========================================================
  // SAVE TASK
  // =========================================================

  function handleSave() {
    if (!title.trim()) {
      return;
    }

    // -------------------------------------------------------
    // Detect changes
    // -------------------------------------------------------


    // -------------------------------------------------------
    // Update task
    // -------------------------------------------------------

    updateTask(currentTask.id, {
      title: title.trim(),
      description,
      status,
      priority,
      assigneeId,
      dueDate,
    });


    setIsEditing(false);
  }

  // =========================================================
  // DELETE TASK
  // =========================================================

  function handleDelete() {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this task?",
      );

    if (!confirmed) {
      return;
    }

    deleteTask(currentTask.id);

    onClose();
  }

  // =========================================================
  // ADD COMMENT
  // =========================================================

  function handleAddComment() {
    const trimmedText =
      commentText.trim();

    if (!trimmedText) {
      return;
    }

    addComment(
      currentTask.id,
      trimmedText,
    );

    setCommentText("");
  }

  // =========================================================
  // CANCEL EDIT
  // =========================================================

  function handleCancelEdit() {
    setTitle(currentTask.title);

    setDescription(
      currentTask.description,
    );

    setStatus(
      currentTask.status,
    );

    setPriority(
      currentTask.priority,
    );

    setAssigneeId(
      currentTask.assigneeId,
    );

    setDueDate(
      currentTask.dueDate,
    );

    setIsEditing(false);
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <aside className="ml-auto flex h-full w-full max-w-xl flex-col border-l border-slate-800 bg-slate-900 shadow-2xl">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-blue-400">
              Task #{task.id}
            </p>

            <h2 className="mt-1 text-lg font-bold text-white">
              Task Details
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-xl text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Close task drawer"
          >
            ×
          </button>
        </header>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="flex-1 overflow-y-auto p-6">
          {/* TITLE */}

          <div>
            <label
              htmlFor="task-title"
              className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500"
            >
              Title
            </label>

            {isEditing ? (
              <input
                id="task-title"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value,
                  )
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500"
              />
            ) : (
              <h3 className="text-2xl font-bold text-white">
                {task.title}
              </h3>
            )}
          </div>

          {/* DESCRIPTION */}

          <div className="mt-7">
            <label
              htmlFor="task-description"
              className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500"
            >
              Description
            </label>

            {isEditing ? (
              <textarea
                id="task-description"
                rows={5}
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value,
                  )
                }
                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-sm leading-6 text-white outline-none focus:border-blue-500"
              />
            ) : (
              <p className="text-sm leading-6 text-slate-400">
                {task.description}
              </p>
            )}
          </div>

          {/* PROPERTIES */}

          <div className="mt-8 grid grid-cols-2 gap-4">
            {/* STATUS */}

            <div>
              <label
                htmlFor="task-status"
                className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500"
              >
                Status
              </label>

              {isEditing ? (
                <select
                  id="task-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target
                        .value as TaskStatus,
                    )
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                >
                  {statusOptions.map(
                    (option) => (
                      <option
                        key={
                          option.value
                        }
                        value={
                          option.value
                        }
                      >
                        {option.label}
                      </option>
                    ),
                  )}
                </select>
              ) : (
                <p className="rounded-lg bg-slate-950 px-3 py-2 text-sm capitalize text-white">
                  {task.status.replace(
                    "-",
                    " ",
                  )}
                </p>
              )}
            </div>

            {/* PRIORITY */}

            <div>
              <label
                htmlFor="task-priority"
                className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500"
              >
                Priority
              </label>

              {isEditing ? (
                <select
                  id="task-priority"
                  value={priority}
                  onChange={(event) =>
                    setPriority(
                      event.target
                        .value as TaskPriority,
                    )
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                >
                  {priorityOptions.map(
                    (option) => (
                      <option
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>
                    ),
                  )}
                </select>
              ) : (
                <p className="rounded-lg bg-slate-950 px-3 py-2 text-sm capitalize text-white">
                  {task.priority}
                </p>
              )}
            </div>

            {/* ASSIGNEE */}

            <div>
              <label
                htmlFor="task-assignee"
                className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500"
              >
                Assignee
              </label>

              {isEditing ? (
                <select
                  id="task-assignee"
                  value={assigneeId}
                  onChange={(event) =>
                    setAssigneeId(
                      Number(
                        event.target
                          .value,
                      ),
                    )
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                >
                  {users.map(
                    (user) => (
                      <option
                        key={user.id}
                        value={user.id}
                      >
                        {user.name}
                      </option>
                    ),
                  )}
                </select>
              ) : (
                <div className="flex items-center gap-2 rounded-lg bg-slate-950 px-3 py-2">
                  {assignedUser && (
                    <img
                      src={
                        assignedUser.avatar
                      }
                      alt={
                        assignedUser.name
                      }
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  )}

                  <span className="truncate text-sm text-white">
                    {assignedUser?.name ??
                      `User #${task.assigneeId}`}
                  </span>
                </div>
              )}
            </div>

            {/* DUE DATE */}

            <div>
              <label
                htmlFor="task-due-date"
                className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500"
              >
                Due Date
              </label>

              {isEditing ? (
                <input
                  id="task-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(event) =>
                    setDueDate(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                />
              ) : (
                <p className="rounded-lg bg-slate-950 px-3 py-2 text-sm text-white">
                  {task.dueDate}
                </p>
              )}
            </div>
          </div>

          {/* COMMENTS */}

          <section className="mt-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Comments
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Discuss this task with your team.
                </p>
              </div>

              <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-semibold text-slate-400">
                {taskComments.length}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {taskComments.length ===
              0 ? (
                <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/50 p-5 text-center">
                  <p className="text-sm text-slate-500">
                    No comments yet.
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Start the conversation about this task.
                  </p>
                </div>
              ) : (
                taskComments.map(
                  (comment) => {
                    const author =
                      users.find(
                        (user) =>
                          user.id ===
                          comment.authorId,
                      );

                    return (
                      <article
                        key={
                          comment.id
                        }
                        className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            {author ? (
                              <img
                                src={
                                  author.avatar
                                }
                                alt={
                                  author.name
                                }
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                U
                              </div>
                            )}

                            <div>
                              <p className="text-xs font-semibold text-white">
                                {author?.name ??
                                  "Current User"}
                              </p>

                              <p className="mt-0.5 text-[10px] text-slate-600">
                                {new Date(
                                  comment.createdAt,
                                ).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              deleteComment(
                                comment.id,
                              )
                            }
                            className="rounded-md px-2 py-1 text-xs text-slate-600 transition hover:bg-red-950/40 hover:text-red-400"
                          >
                            Delete
                          </button>
                        </div>

                        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-400">
                          {comment.text}
                        </p>
                      </article>
                    );
                  },
                )
              )}
            </div>

            {/* ADD COMMENT */}

            <div className="mt-4">
              <textarea
                value={commentText}
                onChange={(event) =>
                  setCommentText(
                    event.target.value,
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key ===
                      "Enter" &&
                    (event.metaKey ||
                      event.ctrlKey)
                  ) {
                    event.preventDefault();

                    handleAddComment();
                  }
                }}
                placeholder="Write a comment..."
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm leading-6 text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500"
              />

              <div className="mt-2 flex items-center justify-between">
                <p className="text-[10px] text-slate-600">
                  ⌘/Ctrl + Enter to comment
                </p>

                <button
                  type="button"
                  disabled={
                    !commentText.trim()
                  }
                  onClick={
                    handleAddComment
                  }
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Add Comment
                </button>
              </div>
            </div>
          </section>

          {/* ACTIVITY */}

          <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Activity
            </p>

            <div className="mt-4 space-y-3 text-xs text-slate-500">
              <p>
                Created{" "}
                <span className="text-slate-300">
                  {new Date(
                    task.createdAt,
                  ).toLocaleDateString()}
                </span>
              </p>

              <p>
                Updated{" "}
                <span className="text-slate-300">
                  {new Date(
                    task.updatedAt,
                  ).toLocaleDateString()}
                </span>
              </p>

              <p>
                {taskComments.length}{" "}
                comment
                {taskComments.length ===
                1
                  ? ""
                  : "s"} added
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="flex items-center justify-between border-t border-slate-800 p-6">
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg border border-red-900 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-950"
          >
            Delete
          </button>

          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={
                    handleCancelEdit
                  }
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={
                    !title.trim()
                  }
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setIsEditing(true)
                }
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
              >
                Edit
              </button>
            )}
          </div>
        </footer>
      </aside>
    </div>
  );
}