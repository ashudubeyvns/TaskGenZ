import type { FormEvent } from "react";
import { useState } from "react";

import type {
  Sprint,
  TaskPriority,
  User,
} from "../../types/task";

import { useBoardStore } from "../../store/boardStore";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Modal from "../ui/Modal";

interface AddTaskModalProps {
  users: User[];
  sprints: Sprint[];
  onClose: () => void;
}

export default function AddTaskModal({
  users,
  sprints,
  onClose,
}: AddTaskModalProps) {
  const addTask = useBoardStore(
    (state) => state.addTask,
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [priority, setPriority] =
    useState<TaskPriority>("medium");

  const [assigneeId, setAssigneeId] =
    useState<number>(users[0]?.id ?? 1);

  const [sprintId, setSprintId] =
    useState<number>(sprints[0]?.id ?? 1);

  const [dueDate, setDueDate] =
    useState("");

  const [error, setError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  /*
   * Keep the selected sprint valid when
   * server sprint data changes.
   */
  useState(() => {
    if (sprints.length > 0) {
      setSprintId(sprints[0].id);
    }
  });

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Task title is required.");
      return;
    }

    if (!dueDate) {
      setError("Due date is required.");
      return;
    }

    if (!sprintId) {
      setError("Please select a sprint.");
      return;
    }

    const taskDescription =
      description.trim() ||
      "No description provided.";

    setIsSubmitting(true);
    setError("");

    void addTask({
      title: trimmedTitle,
      description: taskDescription,
      priority,
      assigneeId,
      dueDate,
      sprintId,
    })
      .then(() => {
        onClose();
      })
      .catch((error: unknown) => {
        setIsSubmitting(false);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to create task.",
        );
      });
  }

  const priorityOptions = [
    {
      value: "low",
      label: "Low",
    },
    {
      value: "medium",
      label: "Medium",
    },
    {
      value: "high",
      label: "High",
    },
  ];

  const assigneeOptions = users.map(
    (user) => ({
      value: String(user.id),
      label: user.name,
    }),
  );

  const sprintOptions = sprints.map(
    (sprint) => ({
      value: String(sprint.id),
      label: sprint.name,
    }),
  );

  return (
    <Modal
      open={true}
      onClose={onClose}
      title="Create New Task"
      size="lg"
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
          Taskgenz
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Create a new task and assign it
          to a sprint.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {error && (
          <div
            role="alert"
            className="
              rounded-xl border border-red-900
              bg-red-950/30 px-4 py-3
              text-sm text-red-400
            "
          >
            {error}
          </div>
        )}

        {/* TITLE */}

        <Input
          id="new-task-title"
          label="Title"
          required
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setError("");
          }}
          placeholder="e.g. Implement notification system"
          autoFocus
        />

        {/* DESCRIPTION */}

        <div className="space-y-1.5">
          <label
            htmlFor="new-task-description"
            className="
              block text-sm font-medium
              text-slate-300
            "
          >
            Description
          </label>

          <textarea
            id="new-task-description"
            rows={4}
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value,
              )
            }
            placeholder="Describe what needs to be done..."
            className="
              w-full resize-none rounded-lg
              border border-slate-700
              bg-slate-950 px-3 py-3
              text-sm leading-6 text-white
              outline-none transition
              placeholder:text-slate-600
              focus:border-violet-500
              focus:ring-2 focus:ring-violet-500
            "
          />
        </div>

        {/* SPRINT */}

        <Select
          id="new-task-sprint"
          label="Sprint"
          value={String(sprintId)}
          onChange={(event) => {
            setSprintId(
              Number(event.target.value),
            );
            setError("");
          }}
          options={sprintOptions}
        />

        {/* PRIORITY + ASSIGNEE */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            id="new-task-priority"
            label="Priority"
            value={priority}
            onChange={(event) =>
              setPriority(
                event.target
                  .value as TaskPriority,
              )
            }
            options={priorityOptions}
          />

          <Select
            id="new-task-assignee"
            label="Assignee"
            value={String(assigneeId)}
            onChange={(event) =>
              setAssigneeId(
                Number(
                  event.target.value,
                ),
              )
            }
            options={assigneeOptions}
          />
        </div>

        {/* DUE DATE */}

        <Input
          id="new-task-due-date"
          label="Due Date"
          type="date"
          required
          value={dueDate}
          onChange={(event) => {
            setDueDate(event.target.value);
            setError("");
          }}
        />

        {/* FOOTER */}

        <div
          className="
            flex items-center justify-end
            gap-3 border-t border-slate-800 pt-5
          "
        >
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Creating..."
              : "Create Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}