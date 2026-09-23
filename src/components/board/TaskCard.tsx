import { memo } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { Task, User } from "../../types/task";

interface TaskCardProps {
  task: Task;
  user?: User;
  onClick: () => void;
}

const priorityStyles = {
  high: {
    badge:
      "border-red-400/30 bg-red-500/10 text-red-400 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-300",
    glow: "from-red-500/20 via-transparent to-transparent",
    dot: "bg-red-400",
  },

  medium: {
    badge:
      "border-amber-400/30 bg-amber-500/10 text-amber-500 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-300",
    glow: "from-amber-500/20 via-transparent to-transparent",
    dot: "bg-amber-400",
  },

  low: {
    badge:
      "border-emerald-400/30 bg-emerald-500/10 text-emerald-500 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-300",
    glow: "from-emerald-500/20 via-transparent to-transparent",
    dot: "bg-emerald-400",
  },
};

function TaskCard({
  task,
  user,
  onClick,
}: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: String(task.id),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priority = priorityStyles[task.priority];

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={[
        "group relative [perspective:1200px]",
        isDragging
          ? "z-50 opacity-50"
          : "z-auto opacity-100",
      ].join(" ")}
    >
      {/* Outer 3D glow */}
      <div
        className={[
          "pointer-events-none absolute -inset-[1px] rounded-[20px]",
          "bg-gradient-to-br",
          priority.glow,
          "opacity-0 blur-xl transition-all duration-500",
          "group-hover:opacity-100",
          isDragging ? "opacity-100" : "",
        ].join(" ")}
      />

      {/* Actual card */}
      <div
        className={[
          "relative overflow-hidden rounded-[20px]",
          "border border-slate-200/80 bg-white/90",
          "shadow-[0_12px_35px_rgba(15,23,42,.07)]",
          "backdrop-blur-xl",
          "transition-all duration-500 ease-out",
          "dark:border-white/[0.09]",
          "dark:bg-[#101012]/90",
          "dark:shadow-[0_15px_50px_rgba(0,0,0,.35)]",

          "group-hover:-translate-y-1",
          "group-hover:[transform:rotateX(2deg)_rotateY(-2deg)_translateY(-4px)]",
          "group-hover:border-violet-300/60",
          "dark:group-hover:border-violet-400/30",

          isDragging
            ? "[transform:rotateX(6deg)_rotateY(-5deg)_scale(1.04)] shadow-[0_25px_70px_rgba(168,85,247,.25)]"
            : "",
        ].join(" ")}
      >
        {/* Animated shine */}
        <div
          className="
            pointer-events-none absolute -right-16 -top-20
            h-36 w-36 rounded-full
            bg-violet-500/10 blur-3xl
            transition-all duration-700
            group-hover:scale-150
            group-hover:bg-pink-500/10
          "
        />

        <div
          className="
            pointer-events-none absolute bottom-0 left-0 right-0
            h-px bg-gradient-to-r
            from-transparent via-violet-500/40 to-transparent
            opacity-0 transition-opacity duration-500
            group-hover:opacity-100
          "
        />

        {/* Inner animated content */}
        <div
          className={[
            "relative p-4",
            "transition-transform duration-500",
            isDragging
              ? ""
              : "animate-[taskgenzTaskFloat_6s_ease-in-out_infinite]",
          ].join(" ")}
        >
          <div className="flex items-start gap-3">
            {/* Drag handle */}
            <button
              type="button"
              aria-label={`Drag ${task.title}`}
              {...listeners}
              {...attributes}
              className="
                mt-1 flex h-7 w-7 shrink-0
                cursor-grab touch-none select-none
                items-center justify-center
                rounded-lg border border-transparent
                text-slate-400
                transition-all duration-200
                hover:border-violet-200
                hover:bg-violet-50
                hover:text-violet-600
                active:cursor-grabbing
                dark:text-slate-600
                dark:hover:border-violet-400/20
                dark:hover:bg-violet-500/10
                dark:hover:text-violet-300
              "
            >
              <span className="text-sm tracking-[-3px]">
                ⋮⋮
              </span>
            </button>

            {/* Task content */}
            <button
              type="button"
              onClick={onClick}
              className="min-w-0 flex-1 text-left"
            >
              {/* Title + priority */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span
                      className={[
                        "h-1.5 w-1.5 shrink-0 rounded-full",
                        priority.dot,
                        "shadow-[0_0_10px_currentColor]",
                      ].join(" ")}
                    />

                    <span
                      className="
                        text-[9px] font-bold uppercase
                        tracking-[0.18em]
                        text-slate-400
                        dark:text-slate-600
                      "
                    >
                      Task
                    </span>
                  </div>

                  <h3
                    className="
                      line-clamp-2
                      text-[15px] font-bold leading-5
                      text-slate-900
                      transition-colors
                      group-hover:text-violet-600
                      dark:text-white
                      dark:group-hover:text-violet-300
                    "
                  >
                    {task.title}
                  </h3>
                </div>

                <span
                  className={[
                    "shrink-0 rounded-full border px-2.5 py-1",
                    "text-[9px] font-bold uppercase tracking-wide",
                    priority.badge,
                  ].join(" ")}
                >
                  {task.priority}
                </span>
              </div>

              {/* Description */}
              <p
                className="
                  mt-3 line-clamp-2
                  text-xs leading-5
                  text-slate-500
                  dark:text-slate-500
                "
              >
                {task.description}
              </p>

              {/* Footer */}
              <div
                className="
                  mt-4 flex items-center
                  justify-between gap-3
                  border-t border-slate-100
                  pt-3
                  dark:border-white/[0.06]
                "
              >
                {/* Due date */}
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="
                      flex h-7 w-7 items-center justify-center
                      rounded-lg
                      bg-slate-100
                      text-[11px]
                      text-slate-500
                      dark:bg-white/[0.05]
                      dark:text-slate-500
                    "
                  >
                    ◷
                  </span>

                  <div className="min-w-0">
                    <p
                      className="
                        text-[8px] font-bold uppercase
                        tracking-[0.15em]
                        text-slate-400
                        dark:text-slate-600
                      "
                    >
                      Due
                    </p>

                    <p
                      className="
                        truncate text-[10px] font-semibold
                        text-slate-600
                        dark:text-slate-400
                      "
                    >
                      {task.dueDate}
                    </p>
                  </div>
                </div>

                {/* Assignee */}
                {user ? (
                  <div
                    className="flex items-center gap-2"
                    title={user.name}
                  >
                    <span
                      className="
                        hidden max-w-20 truncate
                        text-[10px] font-semibold
                        text-slate-500
                        dark:text-slate-500
                        sm:inline
                      "
                    >
                      {user.name}
                    </span>

                    <div className="relative">
                      <div
                        className="
                          absolute -inset-1 rounded-full
                          bg-gradient-to-r
                          from-violet-500 to-pink-500
                          opacity-0 blur
                          transition-opacity duration-300
                          group-hover:opacity-70
                        "
                      />

                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="
                          relative h-8 w-8
                          rounded-full object-cover
                          border-2 border-white
                          dark:border-[#101012]
                        "
                      />
                    </div>
                  </div>
                ) : (
                  <span
                    className="
                      flex h-8 w-8 items-center justify-center
                      rounded-full
                      bg-gradient-to-br
                      from-violet-600 to-pink-500
                      text-[10px] font-bold text-white
                      shadow-lg shadow-violet-500/20
                    "
                  >
                    {task.assigneeId}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/*
 * Prevent unnecessary re-renders when a task card's
 * props have not changed.
 */
export default memo(TaskCard);