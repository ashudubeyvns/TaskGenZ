import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  useSprints,
  useTasks,
} from "../hooks/useTasks";

import type {
  TaskPriority,
  TaskStatus,
} from "../types/task";

/* =========================================================
   COLORS
========================================================= */

const STATUS_COLORS: Record<TaskStatus, string> = {
  backlog: "#8b5cf6",
  "in-progress": "#a855f7",
  review: "#ec4899",
  done: "#22c55e",
};

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: "#22c55e",
  medium: "#f59e0b",
  high: "#ef4444",
};

/* =========================================================
   HELPERS
========================================================= */

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

/* =========================================================
   ANALYTICS PAGE
========================================================= */

export default function Analytics() {
  const navigate = useNavigate();

  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useTasks();

  const {
    data: sprints,
    isLoading: sprintsLoading,
    isError: sprintsError,
  } = useSprints();

  const loading = tasksLoading || sprintsLoading;

  const hasError = tasksError || sprintsError;

  /* =======================================================
     STATUS DATA
  ======================================================= */

  const statusData = useMemo(() => {
    if (!tasks) {
      return [];
    }

    const counts: Record<TaskStatus, number> = {
      backlog: 0,
      "in-progress": 0,
      review: 0,
      done: 0,
    };

    tasks.forEach((task) => {
      const status = task.status;

      if (
        Object.prototype.hasOwnProperty.call(
          counts,
          status,
        )
      ) {
        counts[status] += 1;
      }
    });

    return [
      {
        name: "Backlog",
        value: counts.backlog,
        color: STATUS_COLORS.backlog,
      },
      {
        name: "In Progress",
        value: counts["in-progress"],
        color: STATUS_COLORS["in-progress"],
      },
      {
        name: "Review",
        value: counts.review,
        color: STATUS_COLORS.review,
      },
      {
        name: "Done",
        value: counts.done,
        color: STATUS_COLORS.done,
      },
    ];
  }, [tasks]);

  /* =======================================================
     PRIORITY DATA
  ======================================================= */

  const priorityData = useMemo(() => {
    if (!tasks) {
      return [];
    }

    const counts: Record<TaskPriority, number> = {
      low: 0,
      medium: 0,
      high: 0,
    };

    tasks.forEach((task) => {
      const priority = task.priority;

      if (
        Object.prototype.hasOwnProperty.call(
          counts,
          priority,
        )
      ) {
        counts[priority] += 1;
      }
    });

    return [
      {
        name: "Low",
        tasks: counts.low,
        color: PRIORITY_COLORS.low,
      },
      {
        name: "Medium",
        tasks: counts.medium,
        color: PRIORITY_COLORS.medium,
      },
      {
        name: "High",
        tasks: counts.high,
        color: PRIORITY_COLORS.high,
      },
    ];
  }, [tasks]);

  /* =======================================================
     SPRINT VELOCITY
  ======================================================= */

  const velocityData = useMemo(() => {
    if (!tasks || !sprints) {
      return [];
    }

    return sprints.map((sprint) => {
      const sprintTasks = tasks.filter(
        (task) => task.sprintId === sprint.id,
      );

      const completed = sprintTasks.filter(
        (task) =>
          task.status === "done" ||
          task.completedAt !== null,
      ).length;

      return {
        name: sprint.name,
        completed,
        total: sprintTasks.length,
      };
    });
  }, [tasks, sprints]);

  /* =======================================================
     COMPLETION TREND
  ======================================================= */

  const completionTrend = useMemo(() => {
    if (!tasks) {
      return [];
    }

    const completedTasks = tasks
      .filter(
        (task) => task.completedAt !== null,
      )
      .sort(
        (a, b) =>
          new Date(
            a.completedAt as string,
          ).getTime() -
          new Date(
            b.completedAt as string,
          ).getTime(),
      );

    let completedCount = 0;

    return completedTasks.map((task) => {
      completedCount += 1;

      return {
        date: formatDate(
          task.completedAt as string,
        ),
        completed: completedCount,
        task: task.title,
      };
    });
  }, [tasks]);

  /* =======================================================
     KPI
  ======================================================= */

  const totalTasks = tasks?.length ?? 0;

  const completedTasks =
    tasks?.filter(
      (task) =>
        task.status === "done" ||
        task.completedAt !== null,
    ).length ?? 0;

  const inProgressTasks =
    tasks?.filter(
      (task) =>
        task.status === "in-progress",
    ).length ?? 0;

  const highPriorityTasks =
    tasks?.filter(
      (task) =>
        task.priority === "high",
    ).length ?? 0;

  const completionRate =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100,
        );

  /* =======================================================
     KPI NAVIGATION
  ======================================================= */

  const openAllTasks = () => {
    navigate("/board");
  };

  const openCompletedTasks = () => {
    navigate("/board?status=done");
  };

  const openInProgressTasks = () => {
    navigate("/board?status=in-progress");
  };

  const openHighPriorityTasks = () => {
    navigate("/board?priority=high");
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <main
        className="
          flex min-h-screen
          items-center justify-center
          bg-white
          dark:bg-[#050505]
        "
      >
        <div className="text-center">
          <div
            className="
              mx-auto h-12 w-12
              animate-spin rounded-full border-4
              border-slate-200
              border-t-violet-500
              dark:border-white/10
              dark:border-t-violet-400
            "
          />

          <p
            className="
              mt-5 text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            Building analytics...
          </p>
        </div>
      </main>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (
    hasError ||
    !tasks ||
    !sprints
  ) {
    return (
      <main
        className="
          flex min-h-screen
          items-center justify-center
          bg-white p-6
          dark:bg-[#050505]
        "
      >
        <div
          className="
            rounded-[28px]
            border border-red-200
            bg-red-50
            p-8
            text-center
            dark:border-red-500/20
            dark:bg-red-500/5
          "
        >
          <h1
            className="
              text-lg font-bold
              text-red-600
              dark:text-red-300
            "
          >
            Unable to load analytics
          </h1>

          <p
            className="
              mt-2 text-sm
              text-red-500
              dark:text-red-400
            "
          >
            Please try again later.
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="
              mt-5 rounded-xl
              bg-red-500 px-4 py-2
              text-sm font-bold text-white
              transition
              hover:bg-red-600
            "
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main
      className="
        relative min-h-screen
        overflow-hidden
        bg-white p-5
        dark:bg-[#050505]
        md:p-8
      "
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute inset-0
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            -left-32 -top-32
            h-96 w-96
            rounded-full
            bg-violet-500/10
            blur-[100px]
            dark:bg-violet-600/10
            animate-[analyticsOrbOne_10s_ease-in-out_infinite]
          "
        />

        <div
          className="
            absolute
            -right-32 top-40
            h-96 w-96
            rounded-full
            bg-pink-500/10
            blur-[100px]
            dark:bg-pink-600/10
            animate-[analyticsOrbTwo_12s_ease-in-out_infinite]
          "
        />

        <div
          className="
            absolute
            bottom-[-180px]
            left-[35%]
            h-96 w-96
            rounded-full
            bg-purple-500/10
            blur-[120px]
            dark:bg-purple-600/10
            animate-[analyticsOrbThree_14s_ease-in-out_infinite]
          "
        />

        <div
          className="
            absolute inset-0
            opacity-[0.025]
            [background-image:linear-gradient(rgba(139,92,246,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,.8)_1px,transparent_1px)]
            [background-size:48px_48px]
            dark:opacity-[0.045]
          "
        />
      </div>

      <div
        className="
          relative mx-auto
          max-w-[1600px]
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <header
          className="
            mb-8
            animate-[taskgenzFadeUp_.6s_ease-out]
          "
        >
          <div
            className="
              inline-flex
              items-center gap-2
              rounded-full
              border
              border-violet-200
              bg-violet-50
              px-3 py-1.5
              text-xs
              font-bold
              uppercase
              tracking-[0.18em]
              text-violet-600
              dark:border-violet-400/20
              dark:bg-violet-500/10
              dark:text-violet-300
            "
          >
            <span
              className="
                h-2 w-2
                animate-pulse
                rounded-full
                bg-violet-500
                shadow-[0_0_12px_rgba(168,85,247,.8)]
              "
            />

            Live Analytics
          </div>

          <h1
            className="
              mt-4
              text-4xl
              font-black
              tracking-tight
              text-slate-900
              dark:text-white
              md:text-5xl
            "
          >
            Analytics
          </h1>

          <p
            className="
              mt-3 max-w-2xl
              text-sm leading-6
              text-slate-500
              dark:text-slate-400
            "
          >
            Understand sprint velocity,
            workload, priorities and
            completion trends from your
            real Taskgenz data.
          </p>

          {/* =================================================
              NAVIGATION
          ================================================= */}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="
                group
                rounded-xl
                border border-slate-200
                bg-white
                px-4 py-2.5
                text-sm font-semibold
                text-slate-700
                shadow-sm
                transition-all duration-300
                hover:-translate-y-1
                hover:border-violet-300
                hover:text-violet-600
                hover:shadow-[0_12px_30px_rgba(124,58,237,.12)]
                dark:border-white/10
                dark:bg-white/[0.04]
                dark:text-slate-300
                dark:hover:border-violet-400/30
                dark:hover:text-violet-300
              "
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>{" "}
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => navigate("/board")}
              className="
                group
                rounded-xl
                bg-gradient-to-r
                from-violet-600
                via-purple-600
                to-pink-500
                px-5 py-2.5
                text-sm font-bold
                text-white
                shadow-[0_10px_30px_rgba(168,85,247,.22)]
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-[0_18px_50px_rgba(168,85,247,.34)]
              "
            >
              Open Board
              <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </header>

        {/* =================================================
            KPI
        ================================================= */}

        <section
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          <MetricCard
            title="Total Tasks"
            value={totalTasks}
            subtitle="Across all sprints"
            icon="◈"
            gradient="from-violet-500 to-purple-600"
            onClick={openAllTasks}
          />

          <MetricCard
            title="Completed"
            value={completedTasks}
            subtitle={`${completionRate}% completion`}
            icon="✓"
            gradient="from-emerald-400 to-cyan-500"
            onClick={openCompletedTasks}
          />

          <MetricCard
            title="In Progress"
            value={inProgressTasks}
            subtitle="Currently active"
            icon="◌"
            gradient="from-purple-500 to-fuchsia-500"
            onClick={openInProgressTasks}
          />

          <MetricCard
            title="High Priority"
            value={highPriorityTasks}
            subtitle="Needs attention"
            icon="!"
            gradient="from-pink-500 to-rose-500"
            onClick={openHighPriorityTasks}
          />
        </section>

        {/* =================================================
            PROGRESS
        ================================================= */}

        <section
          className="
            mt-6
            overflow-hidden
            rounded-[30px]
            border
            border-slate-200
            bg-gradient-to-br
            from-white
            via-violet-50
            to-pink-50
            p-6
            shadow-[0_20px_80px_rgba(124,58,237,.08)]
            dark:border-white/10
            dark:from-[#111012]
            dark:via-[#0d0a11]
            dark:to-[#130b12]
            dark:shadow-[0_20px_100px_rgba(168,85,247,.08)]
            md:p-8
          "
        >
          <div
            className="
              flex flex-col gap-8
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div>
              <p
                className="
                  text-xs font-bold
                  uppercase
                  tracking-[0.18em]
                  text-violet-500
                  dark:text-violet-300
                "
              >
                Workspace Progress
              </p>

              <h2
                className="
                  mt-2
                  text-2xl font-black
                  text-slate-900
                  dark:text-white
                "
              >
                {completedTasks} of{" "}
                {totalTasks} tasks completed
              </h2>

              <p
                className="
                  mt-2 text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Keep the momentum moving.
              </p>
            </div>

            <div
              className="
                relative
                h-40 w-40
                shrink-0
                self-center
              "
            >
              <div
                className="
                  absolute inset-0
                  rounded-full
                  transition-all
                  duration-1000
                "
                style={{
                  background:
                    `conic-gradient(
                      #a855f7 0 ${completionRate}%,
                      #ec4899 ${completionRate}% ${Math.min(
                        completionRate + 4,
                        100,
                      )}%,
                      rgba(148,163,184,.15) ${Math.min(
                        completionRate + 4,
                        100,
                      )}% 100%
                    )`,
                  boxShadow:
                    "0 0 60px rgba(168,85,247,.2)",
                }}
              />

              <div
                className="
                  absolute inset-3
                  flex flex-col
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  dark:bg-[#09090b]
                "
              >
                <span
                  className="
                    text-3xl font-black
                    text-slate-900
                    dark:text-white
                  "
                >
                  {completionRate}%
                </span>

                <span
                  className="
                    mt-1 text-[10px]
                    font-bold uppercase
                    tracking-widest
                    text-slate-500
                  "
                >
                  Done
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            CHARTS
        ================================================= */}

        <section
          className="
            mt-6
            grid
            grid-cols-1
            gap-6
            xl:grid-cols-2
          "
        >
          {/* SPRINT VELOCITY */}

          <ChartCard
            title="Sprint Velocity"
            description="Completed tasks per sprint."
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart data={velocityData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#27272a"
                />

                <XAxis
                  dataKey="name"
                  stroke="#71717a"
                />

                <YAxis
                  allowDecimals={false}
                  stroke="#71717a"
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#09090b",
                    border:
                      "1px solid rgba(255,255,255,.1)",
                    borderRadius: "14px",
                    color: "#fff",
                  }}
                />

                <Bar
                  dataKey="completed"
                  name="Completed"
                  fill="#a855f7"
                  radius={[
                    8,
                    8,
                    0,
                    0,
                  ]}
                  animationDuration={1200}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* TASK STATUS */}

          <ChartCard
            title="Task Status"
            description="Current distribution."
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={112}
                  paddingAngle={4}
                  animationDuration={1200}
                >
                  {statusData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.color}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#09090b",
                    border:
                      "1px solid rgba(255,255,255,.1)",
                    borderRadius: "14px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* PRIORITY */}

          <ChartCard
            title="Priority Breakdown"
            description="Tasks grouped by priority."
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart data={priorityData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#27272a"
                />

                <XAxis
                  dataKey="name"
                  stroke="#71717a"
                />

                <YAxis
                  allowDecimals={false}
                  stroke="#71717a"
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#09090b",
                    border:
                      "1px solid rgba(255,255,255,.1)",
                    borderRadius: "14px",
                    color: "#fff",
                  }}
                />

                <Bar
                  dataKey="tasks"
                  name="Tasks"
                  fill="#a855f7"
                  radius={[
                    8,
                    8,
                    0,
                    0,
                  ]}
                  animationDuration={1000}
                >
                  {priorityData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.color}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* COMPLETION TREND */}

          <ChartCard
            title="Completion Trend"
            description="Cumulative completed tasks."
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart data={completionTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#27272a"
                />

                <XAxis
                  dataKey="date"
                  stroke="#71717a"
                />

                <YAxis
                  allowDecimals={false}
                  stroke="#71717a"
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#09090b",
                    border:
                      "1px solid rgba(255,255,255,.1)",
                    borderRadius: "14px",
                    color: "#fff",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#ec4899"
                  strokeWidth={4}
                  dot={{
                    r: 4,
                    fill: "#a855f7",
                  }}
                  activeDot={{
                    r: 7,
                  }}
                  animationDuration={1400}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </section>

        {/* =================================================
            WORK DISTRIBUTION
        ================================================= */}

        <section
          className="
            mt-6
            rounded-[30px]
            border border-slate-200
            bg-white
            p-6
            dark:border-white/10
            dark:bg-white/[0.035]
            md:p-8
          "
        >
          <div>
            <h2
              className="
                text-xl font-black
                text-slate-900
                dark:text-white
              "
            >
              Work Distribution
            </h2>

            <p
              className="
                mt-1 text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Current workload by status.
            </p>
          </div>

          <div
            className="
              mt-8
              grid gap-5
              md:grid-cols-2
            "
          >
            {statusData.map((item) => {
              const percentage =
                totalTasks === 0
                  ? 0
                  : Math.round(
                      (item.value /
                        totalTasks) *
                        100,
                    );

              return (
                <div
                  key={item.name}
                  className="
                    group rounded-2xl
                    border border-slate-200
                    p-4
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-violet-300
                    hover:shadow-[0_15px_40px_rgba(124,58,237,.08)]
                    dark:border-white/10
                    dark:hover:border-violet-400/30
                  "
                >
                  <div
                    className="
                      mb-3
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <div
                      className="
                        flex items-center
                        gap-3
                      "
                    >
                      <span
                        className="
                          h-3 w-3
                          rounded-full
                        "
                        style={{
                          background:
                            item.color,
                          boxShadow:
                            `0 0 14px ${item.color}`,
                        }}
                      />

                      <span
                        className="
                          text-sm font-semibold
                          text-slate-700
                          dark:text-slate-300
                        "
                      >
                        {item.name}
                      </span>
                    </div>

                    <span
                      className="
                        text-sm font-bold
                        text-slate-900
                        dark:text-white
                      "
                    >
                      {item.value}
                    </span>
                  </div>

                  <div
                    className="
                      h-2 overflow-hidden
                      rounded-full
                      bg-slate-100
                      dark:bg-white/[0.06]
                    "
                  >
                    <div
                      className="
                        h-full rounded-full
                        transition-all
                        duration-1000
                      "
                      style={{
                        width:
                          `${percentage}%`,
                        background:
                          item.color,
                        boxShadow:
                          `0 0 18px ${item.color}`,
                      }}
                    />
                  </div>

                  <p
                    className="
                      mt-2 text-right
                      text-[11px]
                      text-slate-500
                    "
                  >
                    {percentage}%
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* =====================================================
          ANIMATIONS
      ===================================================== */}

      <style>{`
        @keyframes taskgenzFadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes analyticsOrbOne {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(70px, 40px, 0);
          }
        }

        @keyframes analyticsOrbTwo {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(-60px, -35px, 0);
          }
        }

        @keyframes analyticsOrbThree {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(50px, -35px, 0);
          }
        }
      `}</style>
    </main>
  );
}

/* ===========================================================
   METRIC CARD
=========================================================== */

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  gradient,
  onClick,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: string;
  gradient: string;
  onClick?: () => void;
}) {
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (
      onClick &&
      (event.key === "Enter" ||
        event.key === " ")
    ) {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className="
        group relative
        cursor-pointer
        overflow-hidden
        rounded-[24px]
        border border-slate-200
        bg-white p-5
        shadow-[0_12px_45px_rgba(15,23,42,.06)]
        transition-all duration-300
        hover:-translate-y-2
        hover:border-violet-300
        hover:shadow-[0_25px_70px_rgba(124,58,237,.14)]
        active:scale-[0.99]
        dark:border-white/10
        dark:bg-white/[0.035]
        dark:shadow-none
        dark:hover:border-violet-400/30
      "
    >
      {/* Glow */}

      <div
        className="
          pointer-events-none
          absolute
          -right-8 -top-8
          h-28 w-28
          rounded-full
          bg-violet-500/10
          blur-2xl
          transition
          group-hover:bg-pink-500/15
        "
      />

      {/* Click indicator */}

      <div
        className="
          absolute
          right-4 bottom-4
          text-[9px]
          font-bold
          uppercase
          tracking-wider
          text-slate-300
          opacity-0
          transition-all
          duration-300
          group-hover:translate-x-0
          group-hover:opacity-100
          dark:text-slate-600
        "
      >
        Open
      </div>

      <div
        className="
          relative
          flex items-start
          justify-between
        "
      >
        <div>
          <p
            className="
              text-xs font-semibold
              uppercase
              tracking-wider
              text-slate-500
              dark:text-slate-400
            "
          >
            {title}
          </p>

          <p
            className="
              mt-3 text-4xl
              font-black
              text-slate-900
              dark:text-white
            "
          >
            {value}
          </p>

          <p
            className="
              mt-2 text-xs
              text-slate-500
              dark:text-slate-400
            "
          >
            {subtitle}
          </p>
        </div>

        <div
          className={`
            flex h-11 w-11
            items-center justify-center
            rounded-2xl
            bg-gradient-to-br
            ${gradient}
            text-lg font-black
            text-white
            shadow-lg
            transition
            duration-300
            group-hover:scale-110
            group-hover:rotate-6
          `}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ===========================================================
   CHART CARD
=========================================================== */

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="
        group
        rounded-[28px]
        border border-slate-200
        bg-white p-6
        shadow-[0_12px_50px_rgba(15,23,42,.05)]
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_25px_70px_rgba(124,58,237,.10)]
        dark:border-white/10
        dark:bg-white/[0.035]
        dark:shadow-none
        md:p-7
      "
    >
      <div className="mb-5">
        <h2
          className="
            text-lg font-black
            text-slate-900
            dark:text-white
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-1 text-xs
            text-slate-500
            dark:text-slate-400
          "
        >
          {description}
        </p>
      </div>

      <div className="h-[320px]">
        {children}
      </div>
    </section>
  );
}