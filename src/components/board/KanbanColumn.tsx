import { useDroppable } from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type {
  Task,
  TaskStatus,
  User,
} from "../../types/task";

import TaskCard from "./TaskCard";

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  users: User[];
  onTaskClick: (task: Task) => void;
}

const columnTheme: Record<
  TaskStatus,
  {
    accent: string;
    glow: string;
    dot: string;
  }
> = {
  backlog: {
    accent: "from-slate-400 to-slate-600",
    glow: "bg-slate-500/10",
    dot: "bg-slate-400",
  },

  "in-progress": {
    accent: "from-violet-500 to-purple-600",
    glow: "bg-violet-500/10",
    dot: "bg-violet-400",
  },

  review: {
    accent: "from-pink-500 to-rose-600",
    glow: "bg-pink-500/10",
    dot: "bg-pink-400",
  },

  done: {
    accent: "from-emerald-400 to-cyan-500",
    glow: "bg-emerald-500/10",
    dot: "bg-emerald-400",
  },
};

export default function KanbanColumn({
  id,
  title,
  tasks,
  users,
  onTaskClick,
}: KanbanColumnProps) {
  const {
    setNodeRef,
    isOver,
  } = useDroppable({
    id: `column-${id}`,
  });

  const theme = columnTheme[id];

  return (
    <section
      ref={setNodeRef}
      className={[
        "group relative min-h-[600px]",
        "overflow-hidden rounded-[26px]",
        "border p-3",
        "backdrop-blur-2xl",
        "transition-all duration-500",
        "shadow-[0_20px_70px_rgba(15,23,42,.06)]",
        "dark:shadow-[0_25px_80px_rgba(0,0,0,.28)]",

        "border-slate-200/80 bg-white/75",
        "dark:border-white/[0.08]",
        "dark:bg-white/[0.035]",

        isOver
          ? "scale-[1.01] border-violet-400/70 bg-violet-50/80 shadow-[0_25px_80px_rgba(168,85,247,.16)] dark:border-violet-400/40 dark:bg-violet-500/[0.08] dark:shadow-[0_25px_90px_rgba(168,85,247,.16)]"
          : "",
      ].join(" ")}
    >
      {/* Ambient column glow */}
      <div
        className={[
          "pointer-events-none absolute -right-20 -top-20",
          "h-48 w-48 rounded-full blur-[80px]",
          theme.glow,
          "transition-all duration-700",
          "group-hover:scale-125",
        ].join(" ")}
      />

      {/* Top neon line */}
      <div
        className={[
          "absolute left-5 right-5 top-0 h-[2px]",
          "rounded-full bg-gradient-to-r",
          theme.accent,
          "opacity-40 transition-all duration-500",
          "group-hover:opacity-100",
        ].join(" ")}
      />

      {/* Header */}
      <header className="relative mb-4 px-2 pt-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={[
                "relative flex h-9 w-9 shrink-0",
                "items-center justify-center",
                "rounded-xl",
                "border border-slate-200",
                "bg-slate-50",
                "dark:border-white/[0.08]",
                "dark:bg-white/[0.05]",
              ].join(" ")}
            >
              <span
                className={[
                  "h-2.5 w-2.5 rounded-full",
                  theme.dot,
                  "shadow-[0_0_14px_currentColor]",
                  isOver ? "animate-ping" : "",
                ].join(" ")}
              />
            </span>

            <div className="min-w-0">
              <h2
                className="
                  truncate text-sm font-black
                  text-slate-900
                  dark:text-white
                "
              >
                {title}
              </h2>

              <p
                className="
                  mt-0.5 text-[10px] font-medium
                  text-slate-400
                  dark:text-slate-600
                "
              >
                {tasks.length}{" "}
                {tasks.length === 1 ? "task" : "tasks"}
              </p>
            </div>
          </div>

          <span
            className="
              flex h-8 min-w-8 items-center
              justify-center rounded-xl
              border border-slate-200
              bg-slate-50 px-2
              text-[10px] font-black
              text-slate-500
              dark:border-white/[0.08]
              dark:bg-white/[0.05]
              dark:text-slate-400
            "
          >
            {tasks.length}
          </span>
        </div>
      </header>

      {/* Tasks */}
      <SortableContext
        items={tasks.map((task) => String(task.id))}
        strategy={verticalListSortingStrategy}
      >
        <div className="relative space-y-3">
          {tasks.length === 0 ? (
            <div
              className={[
                "flex min-h-36 items-center",
                "justify-center rounded-[20px]",
                "border border-dashed",
                "transition-all duration-500",
                isOver
                  ? "border-violet-400/60 bg-violet-500/10"
                  : "border-slate-200 bg-slate-50/60 dark:border-white/[0.08] dark:bg-white/[0.015]",
              ].join(" ")}
            >
              <div className="text-center">
                <div
                  className="
                    mx-auto flex h-11 w-11
                    items-center justify-center
                    rounded-2xl
                    border border-slate-200
                    bg-white
                    text-slate-400
                    dark:border-white/[0.08]
                    dark:bg-white/[0.04]
                  "
                >
                  {isOver ? "↓" : "＋"}
                </div>

                <p
                  className="
                    mt-3 text-[10px] font-semibold
                    text-slate-400
                    dark:text-slate-600
                  "
                >
                  {isOver
                    ? "Release to drop"
                    : "Drop tasks here"}
                </p>
              </div>
            </div>
          ) : (
            tasks.map((task, index) => {
              const user = users.find(
                (item) =>
                  item.id === task.assigneeId,
              );

              return (
                <div
                  key={task.id}
                  style={{
                    animationDelay: `${Math.min(
                      index * 70,
                      420,
                    )}ms`,
                  }}
                  className="animate-[taskgenzTaskEnter_.55s_ease-out_both]"
                >
                  <TaskCard
                    task={task}
                    user={user}
                    onClick={() =>
                      onTaskClick(task)
                    }
                  />
                </div>
              );
            })
          )}
        </div>
      </SortableContext>
    </section>
  );
}