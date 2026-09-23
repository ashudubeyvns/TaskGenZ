import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuthStore,
} from "../store/authStore";

import {
  useBoardStore,
} from "../store/boardStore";

import {
  useNotificationStore,
} from "../store/notificationStore";

import NotificationBell from "../components/notification/NotificationBell";

import {
  useTasks,
} from "../hooks/useTasks";

import {
  useNotifications,
} from "../hooks/useNotifications";

export default function Dashboard() {
  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuthStore();

  const tasks = useBoardStore(
    (state) => state.tasks,
  );

  const {
    data: serverTasks,
  } = useTasks();

  const initializeTasks =
    useBoardStore(
      (state) => state.initializeTasks,
    );

  const notifications =
    useNotificationStore(
      (state) => state.notifications,
    );

  const [
    activeCard,
    setActiveCard,
  ] = useState<string | null>(
    null,
  );

  // =========================================================
  // LOAD SERVER TASKS
  // =========================================================

  useEffect(() => {
    if (serverTasks) {
      initializeTasks(serverTasks);
    }
  }, [
    serverTasks,
    initializeTasks,
  ]);

  // =========================================================
  // NOTIFICATIONS POLLING
  // =========================================================

  useNotifications();

  // =========================================================
  // REAL DASHBOARD METRICS
  // =========================================================

  const metrics = useMemo(() => {
    const total =
      tasks.length;

    const backlog =
      tasks.filter(
        (task) =>
          task.status ===
          "backlog",
      ).length;

    const inProgress =
      tasks.filter(
        (task) =>
          task.status ===
          "in-progress",
      ).length;

    const review =
      tasks.filter(
        (task) =>
          task.status ===
          "review",
      ).length;

    const completed =
      tasks.filter(
        (task) =>
          task.status ===
          "done",
      ).length;

    const completionRate =
      total > 0
        ? Math.round(
            (completed /
              total) *
              100,
          )
        : 0;

    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0,
    );

    const overdue =
      tasks.filter(
        (task) => {
          if (
            task.status ===
            "done"
          ) {
            return false;
          }

          const dueDate =
            new Date(
              task.dueDate,
            );

          dueDate.setHours(
            0,
            0,
            0,
            0,
          );

          return (
            dueDate < today
          );
        },
      ).length;

    return {
      total,
      backlog,
      inProgress,
      review,
      completed,
      completionRate,
      overdue,
    };
  }, [tasks]);

  // =========================================================
  // RECENT TASKS
  // =========================================================

  const recentTasks =
    useMemo(() => {
      return [...tasks]
        .sort(
          (a, b) =>
            b.id - a.id,
        )
        .slice(0, 5);
    }, [tasks]);

  // =========================================================
  // RECENT ACTIVITY
  // =========================================================

  const recentNotifications =
    useMemo(() => {
      return [...notifications]
        .sort(
          (a, b) =>
            new Date(
              b.createdAt,
            ).getTime() -
            new Date(
              a.createdAt,
            ).getTime(),
        )
        .slice(0, 5);
    }, [notifications]);

  // =========================================================
  // KPI DATA
  // =========================================================

  const kpis = [
    {
      id: "total",
      label: "Total Tasks",
      value: metrics.total,
      description:
        "All tasks in workspace",
      icon: "◈",
      gradient:
        "from-violet-500 to-purple-600",
      glow:
        "rgba(139,92,246,.35)",
      path: "/board",
    },

    {
      id: "completed",
      label: "Completed",
      value: metrics.completed,
      description:
        `${metrics.completionRate}% completion rate`,
      icon: "✓",
      gradient:
        "from-emerald-400 to-teal-500",
      glow:
        "rgba(16,185,129,.30)",
      path: "/board?status=done",
    },

    {
      id: "progress",
      label: "In Progress",
      value: metrics.inProgress,
      description:
        "Currently being worked on",
      icon: "◌",
      gradient:
        "from-purple-500 to-fuchsia-600",
      glow:
        "rgba(168,85,247,.35)",
      path: "/board?status=in-progress",
    },

    {
      id: "overdue",
      label: "Due Soon",
      value: metrics.overdue,
      description:
        "Tasks needing attention",
      icon: "◷",
      gradient:
        "from-pink-500 to-rose-500",
      glow:
        "rgba(236,72,153,.30)",
      path: "/board",
    },
  ];

  // =========================================================
  // STATUS ANALYTICS
  // =========================================================

  const statusAnalytics = [
    {
      label: "Completed",
      value: metrics.completed,
      percentage:
        metrics.total > 0
          ? Math.round(
              (metrics.completed /
                metrics.total) *
                100,
            )
          : 0,
      gradient:
        "from-emerald-400 to-teal-500",
    },

    {
      label: "In Progress",
      value: metrics.inProgress,
      percentage:
        metrics.total > 0
          ? Math.round(
              (metrics.inProgress /
                metrics.total) *
                100,
            )
          : 0,
      gradient:
        "from-violet-500 to-purple-600",
    },

    {
      label: "Review",
      value: metrics.review,
      percentage:
        metrics.total > 0
          ? Math.round(
              (metrics.review /
                metrics.total) *
                100,
            )
          : 0,
      gradient:
        "from-fuchsia-500 to-purple-500",
    },

    {
      label: "Backlog",
      value: metrics.backlog,
      percentage:
        metrics.total > 0
          ? Math.round(
              (metrics.backlog /
                metrics.total) *
                100,
            )
          : 0,
      gradient:
        "from-slate-400 to-zinc-500",
    },
  ];

  // =========================================================
  // LOGOUT
  // =========================================================

  function handleLogout() {
    logout();

    navigate("/login", {
      replace: true,
    });
  }

  // =========================================================
  // STATUS LABEL
  // =========================================================

  function formatStatus(
    status: string,
  ) {
    switch (status) {
      case "in-progress":
        return "In Progress";

      case "backlog":
        return "Backlog";

      case "review":
        return "Review";

      case "done":
        return "Done";

      default:
        return status;
    }
  }

  // =========================================================
  // NOTIFICATION ICON
  // =========================================================

  function notificationIcon(
    type: string,
  ) {
    switch (type) {
      case "task_created":
        return "+";

      case "task_reordered":
        return "↕";

      case "task_moved":
        return "↗";

      case "task_due":
        return "◷";

      default:
        return "✓";
    }
  }

  // =========================================================
  // TIME AGO
  // =========================================================

  function timeAgo(
    date: string,
  ) {
    const seconds =
      Math.floor(
        (Date.now() -
          new Date(
            date,
          ).getTime()) /
          1000,
      );

    if (seconds < 60) {
      return "just now";
    }

    const minutes =
      Math.floor(
        seconds / 60,
      );

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours =
      Math.floor(
        minutes / 60,
      );

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days =
      Math.floor(
        hours / 24,
      );

    return `${days}d ago`;
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-white
        text-slate-900
        dark:bg-[#050505]
        dark:text-white
      "
    >

      {/* =====================================================
          ANIMATED BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="dashboard-orb dashboard-orb-one" />

        <div className="dashboard-orb dashboard-orb-two" />

        <div className="dashboard-orb dashboard-orb-three" />

        <div className="dashboard-grid" />

      </div>

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1600px]
          px-4
          py-6
          sm:px-6
          lg:px-8
        "
      >

        {/* ===================================================
            TOP HEADER
        =================================================== */}

        <header
          className="
            mb-8
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          <div>

            <div className="mb-2 flex items-center gap-3">

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-violet-400/30
                  bg-violet-500/10
                  text-lg
                  shadow-[0_0_25px_rgba(139,92,246,.20)]
                "
              >
                ✦
              </div>

              <span
                className="
                  text-sm
                  font-semibold
                  tracking-[0.2em]
                  text-violet-600
                  uppercase
                  dark:text-violet-300
                "
              >
                Taskgenz
              </span>

            </div>

            <h1
              className="
                text-3xl
                font-bold
                tracking-tight
                text-slate-900
                sm:text-4xl
                lg:text-5xl
                dark:text-white
              "
            >
              Good morning,{" "}

              <span
                className="
                  bg-gradient-to-r
                  from-violet-500
                  via-purple-500
                  to-pink-500
                  bg-clip-text
                  text-transparent
                  dark:from-violet-300
                  dark:via-purple-300
                  dark:to-pink-300
                "
              >
                {user?.firstName ??
                  "Developer"}
              </span>

              ! 👋
            </h1>

            <p
              className="
                mt-3
                max-w-2xl
                text-sm
                text-slate-500
                sm:text-base
                dark:text-slate-400
              "
            >
              Here's what's happening
              with your workspace.
              Stay focused, keep
              building, and ship
              something great today.
            </p>

          </div>

          <div className="flex items-center gap-3">

            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-2
                shadow-sm
                dark:border-white/10
                dark:bg-white/[0.04]
                dark:backdrop-blur-xl
              "
            >
              <NotificationBell />
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/board")
              }
              className="
                rounded-2xl
                border
                border-violet-200
                bg-violet-50
                px-5
                py-3
                text-sm
                font-semibold
                text-violet-700
                transition
                duration-300
                hover:-translate-y-0.5
                hover:bg-violet-100
                hover:shadow-[0_0_30px_rgba(139,92,246,.15)]
                dark:border-violet-400/30
                dark:bg-violet-500/10
                dark:text-violet-200
                dark:hover:bg-violet-500/20
              "
            >
              View Board →
            </button>

            <button
              type="button"
              onClick={
                handleLogout
              }
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-5
                py-3
                text-sm
                font-semibold
                text-slate-600
                transition
                duration-300
                hover:border-red-200
                hover:bg-red-50
                hover:text-red-600
                dark:border-white/10
                dark:bg-white/[0.04]
                dark:text-slate-300
                dark:hover:border-red-400/30
                dark:hover:bg-red-500/10
                dark:hover:text-red-300
              "
            >
              Logout
            </button>

          </div>

        </header>

        {/* ===================================================
            HERO / 3D VISUAL
        =================================================== */}

        <section
          className="
            relative
            mb-8
            overflow-hidden
            rounded-[30px]
            border
            border-slate-200
            bg-gradient-to-br
            from-violet-50
            via-white
            to-fuchsia-50
            p-6
            shadow-xl
            sm:p-8
            lg:p-10
            dark:border-white/10
            dark:from-[#17111f]
            dark:via-[#0d0d0f]
            dark:to-[#151015]
          "
        >

          <div
            className="
              absolute
              inset-0
              bg-[radial-gradient(circle_at_75%_40%,rgba(139,92,246,.14),transparent_35%),radial-gradient(circle_at_90%_20%,rgba(236,72,153,.10),transparent_30%)]
              dark:bg-[radial-gradient(circle_at_75%_40%,rgba(139,92,246,.20),transparent_35%),radial-gradient(circle_at_90%_20%,rgba(236,72,153,.15),transparent_30%)]
            "
          />

          <div
            className="
              relative
              grid
              items-center
              gap-8
              lg:grid-cols-[1fr_430px]
            "
          >

            <div>

              <div
                className="
                  mb-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-violet-200
                  bg-violet-50
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  text-violet-700
                  dark:border-violet-400/20
                  dark:bg-violet-400/5
                  dark:text-violet-300
                "
              >
                <span
                  className="
                    h-2
                    w-2
                    animate-pulse
                    rounded-full
                    bg-violet-500
                  "
                />

                Workspace is active
              </div>

              <h2
                className="
                  max-w-2xl
                  text-3xl
                  font-bold
                  leading-tight
                  text-slate-900
                  sm:text-4xl
                  dark:text-white
                "
              >
                Plan.

                <span className="text-violet-500 dark:text-violet-300">
                  {" "}Organize.
                </span>

                <br />

                <span className="text-fuchsia-500 dark:text-fuchsia-300">
                  Achieve.
                </span>
              </h2>

              <p
                className="
                  mt-4
                  max-w-xl
                  text-sm
                  leading-6
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Keep every task, sprint,
                and team activity
                organized in one
                intelligent workspace.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">

                <button
                  type="button"
                  onClick={() =>
                    navigate("/board")
                  }
                  className="
                    rounded-2xl
                    bg-gradient-to-r
                    from-violet-600
                    via-purple-600
                    to-fuchsia-600
                    px-6
                    py-3.5
                    text-sm
                    font-bold
                    text-white
                    shadow-[0_0_35px_rgba(139,92,246,.25)]
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_0_50px_rgba(139,92,246,.40)]
                  "
                >
                  + Create / Manage Tasks
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/analytics")
                  }
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    px-6
                    py-3.5
                    text-sm
                    font-semibold
                    text-slate-700
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:border-violet-300
                    hover:bg-violet-50
                    dark:border-white/10
                    dark:bg-white/[0.05]
                    dark:text-slate-200
                    dark:hover:border-white/20
                    dark:hover:bg-white/[0.08]
                  "
                >
                  View Analytics
                </button>

              </div>

            </div>

            {/* =================================================
                3D TASK VISUALIZATION
            ================================================= */}

            <div
              className="
                dashboard-3d-scene
                relative
                mx-auto
                h-[300px]
                w-full
                max-w-[430px]
              "
            >

              <div
                className="
                  dashboard-3d-platform
                  absolute
                  bottom-8
                  left-1/2
                  h-20
                  w-64
                  -translate-x-1/2
                  rounded-[50%]
                  border
                  border-violet-400/30
                  bg-gradient-to-r
                  from-violet-500/25
                  via-purple-500/20
                  to-fuchsia-500/25
                  blur-[1px]
                "
              />

              <div className="dashboard-ring dashboard-ring-one" />

              <div className="dashboard-ring dashboard-ring-two" />

              <div className="dashboard-floating-card dashboard-card-back">

                <div className="text-xs font-semibold text-violet-300">
                  IDEAS
                </div>

                <div className="mt-3 h-2 w-24 rounded-full bg-slate-300 dark:bg-white/20" />

                <div className="mt-2 h-2 w-16 rounded-full bg-slate-200 dark:bg-white/10" />

              </div>

              <div className="dashboard-floating-card dashboard-card-middle">

                <div className="flex items-center gap-2">

                  <span className="h-3 w-3 rounded-full bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,.7)]" />

                  <span className="text-xs text-violet-700 dark:text-violet-100">
                    IN PROGRESS
                  </span>

                </div>

                <div className="mt-4 h-2 w-28 rounded-full bg-slate-300 dark:bg-white/20" />

                <div className="mt-2 h-2 w-20 rounded-full bg-slate-200 dark:bg-white/10" />

              </div>

              <div className="dashboard-floating-card dashboard-card-front">

                <div className="flex items-center justify-between">

                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-200">
                    DONE
                  </span>

                  <span
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      bg-emerald-400/15
                      text-lg
                      text-emerald-500
                      dark:text-emerald-300
                    "
                  >
                    ✓
                  </span>

                </div>

                <div className="mt-4 h-2 w-32 rounded-full bg-slate-300 dark:bg-white/20" />

                <div className="mt-2 h-2 w-24 rounded-full bg-slate-200 dark:bg-white/10" />

              </div>

              <div
                className="
                  absolute
                  left-4
                  top-20
                  flex
                  h-11
                  w-11
                  animate-bounce
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-violet-300/30
                  bg-violet-400/10
                  text-xl
                  text-violet-500
                  shadow-[0_0_25px_rgba(139,92,246,.25)]
                "
              >
                ✦
              </div>

              <div
                className="
                  absolute
                  bottom-16
                  right-2
                  flex
                  h-12
                  w-12
                  animate-pulse
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-fuchsia-300/30
                  bg-fuchsia-400/10
                  text-xl
                  text-fuchsia-500
                  shadow-[0_0_25px_rgba(236,72,153,.25)]
                "
              >
                ↗
              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            KPI CARDS
        =================================================== */}

        <section
          className="
            mb-8
            grid
            gap-4
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >

          {kpis.map(
            (kpi) => (
              <button
                key={kpi.id}
                type="button"
                onClick={() =>
                  navigate(
                    kpi.path,
                  )
                }
                onMouseEnter={() =>
                  setActiveCard(
                    kpi.id,
                  )
                }
                onMouseLeave={() =>
                  setActiveCard(
                    null,
                  )
                }
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[24px]
                  border
                  border-slate-200
                  bg-white
                  p-5
                  text-left
                  shadow-sm
                  backdrop-blur-xl
                  transition
                  duration-500
                  hover:-translate-y-2
                  hover:border-violet-300
                  dark:border-white/10
                  dark:bg-white/[0.045]
                  dark:hover:border-white/20
                "
                style={{
                  transform:
                    activeCard ===
                    kpi.id
                      ? "perspective(900px) rotateX(3deg) rotateY(-3deg) translateY(-8px)"
                      : undefined,

                  boxShadow:
                    activeCard ===
                    kpi.id
                      ? `0 25px 70px ${kpi.glow}`
                      : undefined,
                }}
              >

                <div
                  className={`
                    absolute
                    -right-10
                    -top-10
                    h-28
                    w-28
                    rounded-full
                    bg-gradient-to-br
                    ${kpi.gradient}
                    opacity-10
                    blur-2xl
                    transition
                    duration-500
                    group-hover:opacity-30
                  `}
                />

                <div className="relative">

                  <div className="flex items-start justify-between">

                    <div
                      className={`
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-2xl
                        bg-gradient-to-br
                        ${kpi.gradient}
                        text-xl
                        font-bold
                        text-white
                        shadow-lg
                      `}
                    >
                      {kpi.icon}
                    </div>

                    <span
                      className="
                        rounded-full
                        border
                        border-emerald-400/10
                        bg-emerald-400/10
                        px-2.5
                        py-1
                        text-[11px]
                        font-semibold
                        text-emerald-600
                        dark:text-emerald-300
                      "
                    >
                      Live
                    </span>

                  </div>

                  <p
                    className="
                      mt-5
                      text-sm
                      font-medium
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    {kpi.label}
                  </p>

                  <p
                    className="
                      mt-1
                      text-4xl
                      font-bold
                      tracking-tight
                      text-slate-900
                      dark:text-white
                    "
                  >
                    {kpi.value}
                  </p>

                  <p
                    className="
                      mt-2
                      text-xs
                      text-slate-400
                      dark:text-slate-500
                    "
                  >
                    {kpi.description}
                  </p>

                </div>

              </button>
            ),
          )}

        </section>

        {/* ===================================================
            ANALYTICS + PRODUCTIVITY
        =================================================== */}

        <section
          className="
            mb-8
            grid
            gap-5
            xl:grid-cols-[1.8fr_1fr]
          "
        >

          {/* =================================================
              TASK OVERVIEW
          ================================================= */}

          <div
            className="
              rounded-[28px]
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
              backdrop-blur-2xl
              dark:border-white/10
              dark:bg-white/[0.035]
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <h2
                  className="
                    text-xl
                    font-bold
                    text-slate-900
                    dark:text-white
                  "
                >
                  Task Overview
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                    dark:text-slate-500
                  "
                >
                  Live distribution of
                  your workspace tasks.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/board")
                }
                className="
                  rounded-xl
                  border
                  border-slate-200
                  px-3
                  py-2
                  text-xs
                  font-semibold
                  text-slate-600
                  transition
                  hover:border-violet-300
                  hover:bg-violet-50
                  dark:border-white/10
                  dark:text-slate-300
                  dark:hover:bg-white/5
                "
              >
                View Board →
              </button>

            </div>

            {/* ANALYTIC BARS */}

            <div className="mt-8 space-y-6">

              {statusAnalytics.map(
                (item) => (
                  <div
                    key={
                      item.label
                    }
                  >

                    <div
                      className="
                        mb-2
                        flex
                        items-center
                        justify-between
                      "
                    >

                      <span
                        className="
                          text-sm
                          font-medium
                          text-slate-600
                          dark:text-slate-300
                        "
                      >
                        {item.label}
                      </span>

                      <span
                        className="
                          text-sm
                          font-bold
                          text-slate-900
                          dark:text-white
                        "
                      >
                        {item.value}
                      </span>

                    </div>

                    <div
                      className="
                        h-3
                        overflow-hidden
                        rounded-full
                        bg-slate-100
                        dark:bg-white/[0.06]
                      "
                    >

                      <div
                        className={`
                          h-full
                          rounded-full
                          bg-gradient-to-r
                          ${item.gradient}
                          transition-all
                          duration-1000
                        `}
                        style={{
                          width: `${item.percentage}%`,
                          boxShadow:
                            "0 0 18px rgba(139,92,246,.25)",
                        }}
                      />

                    </div>

                    <div
                      className="
                        mt-1
                        text-right
                        text-[11px]
                        text-slate-400
                        dark:text-slate-600
                      "
                    >
                      {item.percentage}%
                    </div>

                  </div>
                ),
              )}

            </div>

            {/* MINI VISUAL */}

            <div
              className="
                mt-8
                rounded-2xl
                border
                border-slate-100
                bg-slate-50
                p-5
                dark:border-white/5
                dark:bg-black/20
              "
            >

              <div
                className="
                  mb-4
                  flex
                  items-center
                  justify-between
                "
              >

                <span
                  className="
                    text-sm
                    font-semibold
                    text-slate-600
                    dark:text-slate-300
                  "
                >
                  Workspace Health
                </span>

                <span
                  className="
                    text-xs
                    font-semibold
                    text-violet-600
                    dark:text-violet-300
                  "
                >
                  {metrics.completionRate >=
                  70
                    ? "Excellent"
                    : metrics.completionRate >=
                      40
                    ? "Good"
                    : "Building"}
                </span>

              </div>

              <div className="flex h-32 items-end gap-2">

                {statusAnalytics.map(
                  (
                    item,
                    index,
                  ) => (
                    <div
                      key={
                        item.label
                      }
                      className="
                        flex
                        flex-1
                        flex-col
                        items-center
                        justify-end
                        gap-2
                      "
                    >

                      <div
                        className={`
                          w-full
                          max-w-12
                          rounded-t-xl
                          bg-gradient-to-t
                          ${item.gradient}
                          opacity-80
                          transition-all
                          duration-700
                        `}
                        style={{
                          height: `${Math.max(
                            item.percentage *
                              1.1,
                            10,
                          )}%`,
                          animationDelay: `${index * 100}ms`,
                        }}
                      />

                      <span
                        className="
                          text-[10px]
                          text-slate-400
                          dark:text-slate-600
                        "
                      >
                        {index + 1}
                      </span>

                    </div>
                  ),
                )}

              </div>

            </div>

          </div>

          {/* =================================================
              PRODUCTIVITY
          ================================================= */}

          <div
            className="
              rounded-[28px]
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
              backdrop-blur-2xl
              dark:border-white/10
              dark:bg-white/[0.035]
            "
          >

            <h2
              className="
                text-xl
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              Productivity
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Overall completion progress.
            </p>

            <div className="mt-8 flex justify-center">

              <div
                className="
                  relative
                  flex
                  h-52
                  w-52
                  items-center
                  justify-center
                  rounded-full
                "
                style={{
                  background: `conic-gradient(
                    #a855f7 ${metrics.completionRate}%,
                    #ec4899 ${metrics.completionRate}%,
                    rgba(148,163,184,.15) ${metrics.completionRate}%
                  )`,
                  boxShadow:
                    "0 0 60px rgba(139,92,246,.15)",
                }}
              >

                <div
                  className="
                    absolute
                    inset-[10px]
                    flex
                    flex-col
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    dark:bg-[#0b0b0d]
                  "
                >

                  <span
                    className="
                      text-5xl
                      font-black
                      tracking-tight
                      text-slate-900
                      dark:text-white
                    "
                  >
                    {metrics.completionRate}%
                  </span>

                  <span
                    className="
                      mt-1
                      text-xs
                      font-medium
                      text-slate-500
                    "
                  >
                    Completed
                  </span>

                </div>

              </div>

            </div>

            <div className="mt-8 space-y-3">

              {statusAnalytics.map(
                (item) => (
                  <div
                    key={
                      item.label
                    }
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <div className="flex items-center gap-3">

                      <span
                        className={`
                          h-3
                          w-3
                          rounded-full
                          bg-gradient-to-r
                          ${item.gradient}
                        `}
                      />

                      <span
                        className="
                          text-sm
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        {item.label}
                      </span>

                    </div>

                    <span
                      className="
                        text-sm
                        font-semibold
                        text-slate-900
                        dark:text-white
                      "
                    >
                      {item.value}
                    </span>

                  </div>
                ),
              )}

            </div>

          </div>

        </section>

        {/* ===================================================
            RECENT TASKS + ACTIVITY
        =================================================== */}

        <section
          className="
            grid
            gap-5
            xl:grid-cols-2
          "
        >

          {/* =================================================
              RECENT TASKS
          ================================================= */}

          <div
            className="
              rounded-[28px]
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
              backdrop-blur-2xl
              dark:border-white/10
              dark:bg-white/[0.035]
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <h2
                  className="
                    text-xl
                    font-bold
                    text-slate-900
                    dark:text-white
                  "
                >
                  Recent Tasks
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >
                  Latest activity on
                  your board.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/board")
                }
                className="
                  text-sm
                  font-semibold
                  text-violet-600
                  transition
                  hover:text-violet-500
                  dark:text-violet-300
                  dark:hover:text-violet-200
                "
              >
                View All
              </button>

            </div>

            <div className="mt-6 space-y-2">

              {recentTasks.length ===
              0 ? (
                <div
                  className="
                    rounded-2xl
                    border
                    border-dashed
                    border-slate-200
                    py-12
                    text-center
                    dark:border-white/10
                  "
                >

                  <div className="text-3xl">
                    ✦
                  </div>

                  <p
                    className="
                      mt-3
                      text-sm
                      font-medium
                      text-slate-500
                    "
                  >
                    No tasks yet
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/board",
                      )
                    }
                    className="
                      mt-3
                      text-xs
                      font-semibold
                      text-violet-600
                      dark:text-violet-300
                    "
                  >
                    Create your first task →
                  </button>

                </div>
              ) : (
                recentTasks.map(
                  (task) => (
                    <button
                      key={
                        task.id
                      }
                      type="button"
                      onClick={() =>
                        navigate(
                          "/board",
                        )
                      }
                      className="
                        group
                        flex
                        w-full
                        items-center
                        gap-4
                        rounded-2xl
                        border
                        border-transparent
                        px-3
                        py-3
                        text-left
                        transition
                        duration-300
                        hover:border-slate-200
                        hover:bg-slate-50
                        dark:hover:border-white/10
                        dark:hover:bg-white/[0.045]
                      "
                    >

                      <span
                        className={`
                          h-3
                          w-3
                          shrink-0
                          rounded-full
                          ${
                            task.status ===
                            "done"
                              ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.6)]"
                              : task.status ===
                                "in-progress"
                              ? "bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,.6)]"
                              : task.status ===
                                "review"
                              ? "bg-fuchsia-400 shadow-[0_0_12px_rgba(232,121,249,.6)]"
                              : "bg-slate-400"
                          }
                        `}
                      />

                      <div className="min-w-0 flex-1">

                        <p
                          className="
                            truncate
                            text-sm
                            font-semibold
                            text-slate-700
                            transition
                            group-hover:text-slate-900
                            dark:text-slate-200
                            dark:group-hover:text-white
                          "
                        >
                          {task.title}
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-slate-400
                            dark:text-slate-600
                          "
                        >
                          Task #{task.id}
                        </p>

                      </div>

                      <span
                        className="
                          shrink-0
                          rounded-full
                          border
                          border-slate-200
                          bg-slate-50
                          px-3
                          py-1
                          text-[10px]
                          font-semibold
                          text-slate-500
                          dark:border-white/10
                          dark:bg-white/[0.04]
                          dark:text-slate-400
                        "
                      >
                        {formatStatus(
                          task.status,
                        )}
                      </span>

                    </button>
                  ),
                )
              )}

            </div>

          </div>

          {/* =================================================
              RECENT ACTIVITY
          ================================================= */}

          <div
            className="
              rounded-[28px]
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
              backdrop-blur-2xl
              dark:border-white/10
              dark:bg-white/[0.035]
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <h2
                  className="
                    text-xl
                    font-bold
                    text-slate-900
                    dark:text-white
                  "
                >
                  Recent Activity
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >
                  What's happening in
                  your workspace.
                </p>

              </div>

              <span
                className="
                  rounded-full
                  border
                  border-violet-200
                  bg-violet-50
                  px-3
                  py-1
                  text-[10px]
                  font-semibold
                  text-violet-600
                  dark:border-violet-400/20
                  dark:bg-violet-400/10
                  dark:text-violet-300
                "
              >
                LIVE
              </span>

            </div>

            <div className="mt-6 space-y-2">

              {recentNotifications.length ===
              0 ? (
                <div
                  className="
                    rounded-2xl
                    border
                    border-dashed
                    border-slate-200
                    py-12
                    text-center
                    dark:border-white/10
                  "
                >

                  <div className="text-3xl">
                    ◌
                  </div>

                  <p
                    className="
                      mt-3
                      text-sm
                      font-medium
                      text-slate-500
                    "
                  >
                    No recent activity
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-slate-400
                      dark:text-slate-600
                    "
                  >
                    Activity will appear
                    here automatically.
                  </p>

                </div>
              ) : (
                recentNotifications.map(
                  (
                    notification,
                  ) => (
                    <div
                      key={
                        notification.id
                      }
                      className="
                        flex
                        items-center
                        gap-4
                        rounded-2xl
                        border
                        border-transparent
                        px-3
                        py-3
                        transition
                        hover:border-slate-200
                        hover:bg-slate-50
                        dark:hover:border-white/10
                        dark:hover:bg-white/[0.045]
                      "
                    >

                      <div
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-gradient-to-br
                          from-violet-500/20
                          to-fuchsia-500/20
                          text-sm
                          font-bold
                          text-violet-600
                          dark:text-violet-200
                        "
                      >
                        {notificationIcon(
                          notification.type,
                        )}
                      </div>

                      <div className="min-w-0 flex-1">

                        <p
                          className="
                            text-sm
                            font-semibold
                            text-slate-700
                            dark:text-slate-200
                          "
                        >
                          {notification.title}
                        </p>

                        <p
                          className="
                            mt-1
                            truncate
                            text-xs
                            text-slate-400
                            dark:text-slate-500
                          "
                        >
                          {
                            notification.message
                          }
                        </p>

                      </div>

                      <span
                        className="
                          shrink-0
                          text-[10px]
                          text-slate-400
                          dark:text-slate-600
                        "
                      >
                        {timeAgo(
                          notification.createdAt,
                        )}
                      </span>

                    </div>
                  ),
                )
              )}

            </div>

          </div>

        </section>

        {/* ===================================================
            FOOTER STATUS
        =================================================== */}

        <footer
          className="
            mt-8
            flex
            flex-col
            items-center
            justify-between
            gap-3
            rounded-2xl
            border
            border-slate-200
            bg-white
            px-5
            py-4
            text-xs
            text-slate-400
            shadow-sm
            sm:flex-row
            dark:border-white/5
            dark:bg-white/[0.025]
            dark:text-slate-600
          "
        >

          <span>
            Taskgenz Workspace
          </span>

          <div className="flex items-center gap-2">

            <span
              className="
                h-2
                w-2
                animate-pulse
                rounded-full
                bg-emerald-400
              "
            />

            <span>
              All systems operational
            </span>

          </div>

        </footer>

      </div>

      {/* =====================================================
          DASHBOARD ANIMATION STYLES
      ===================================================== */}

      <style>
        {`
          .dashboard-grid {
            position: absolute;
            inset: 0;
            opacity: .12;

            background-image:
              linear-gradient(
                rgba(100,116,139,.08) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(100,116,139,.08) 1px,
                transparent 1px
              );

            background-size: 55px 55px;

            mask-image:
              linear-gradient(
                to bottom,
                black,
                transparent 80%
              );
          }

          .dashboard-orb {
            position: absolute;
            border-radius: 9999px;
            filter: blur(80px);
            opacity: .16;

            animation:
              dashboardFloat
              12s
              ease-in-out
              infinite;
          }

          .dashboard-orb-one {
            width: 360px;
            height: 360px;
            left: -140px;
            top: 80px;
            background: #7c3aed;
          }

          .dashboard-orb-two {
            width: 300px;
            height: 300px;
            right: -100px;
            top: 380px;
            background: #18181b;

            animation-delay: -4s;
          }

          .dashboard-orb-three {
            width: 240px;
            height: 240px;
            left: 45%;
            bottom: -80px;
            background: #ec4899;

            animation-delay: -7s;
          }

          .dashboard-3d-scene {
            perspective: 1000px;
            transform-style: preserve-3d;
          }

          .dashboard-3d-platform {
            transform:
              translateX(-50%)
              rotateX(65deg)
              translateZ(-20px);

            animation:
              platformPulse
              4s
              ease-in-out
              infinite;
          }

          .dashboard-ring {
            position: absolute;
            left: 50%;
            top: 55%;

            border:
              2px solid
              rgba(139,92,246,.35);

            border-radius: 9999px;

            transform-style: preserve-3d;

            pointer-events: none;
          }

          .dashboard-ring-one {
            width: 290px;
            height: 100px;

            transform:
              translate(-50%, -50%)
              rotateX(70deg)
              rotateZ(15deg);

            animation:
              ringRotate
              8s
              linear
              infinite;
          }

          .dashboard-ring-two {
            width: 250px;
            height: 90px;

            border-color:
              rgba(236,72,153,.30);

            transform:
              translate(-50%, -50%)
              rotateX(70deg)
              rotateZ(-30deg);

            animation:
              ringRotateReverse
              10s
              linear
              infinite;
          }

          .dashboard-floating-card {
            position: absolute;

            width: 180px;
            height: 125px;

            padding: 18px;

            border-radius: 20px;

            border:
              1px solid
              rgba(255,255,255,.14);

            background:
              linear-gradient(
                135deg,
                rgba(255,255,255,.12),
                rgba(255,255,255,.035)
              );

            box-shadow:
              0 25px 60px
              rgba(0,0,0,.35),

              inset 0 1px
              rgba(255,255,255,.12);

            backdrop-filter:
              blur(16px);

            transform-style:
              preserve-3d;
          }

          .dashboard-card-back {
            left: 5%;
            top: 10%;

            transform:
              rotateY(20deg)
              rotateX(8deg)
              translateZ(-40px);

            animation:
              cardBackFloat
              5s
              ease-in-out
              infinite;
          }

          .dashboard-card-middle {
            right: 4%;
            top: 28%;

            transform:
              rotateY(-18deg)
              rotateX(7deg)
              translateZ(10px);

            animation:
              cardMiddleFloat
              4.5s
              ease-in-out
              infinite;
          }

          .dashboard-card-front {
            left: 30%;
            top: 44%;

            transform:
              rotateY(-5deg)
              rotateX(5deg)
              translateZ(60px);

            animation:
              cardFrontFloat
              4s
              ease-in-out
              infinite;
          }

          @keyframes dashboardFloat {
            0%, 100% {
              transform:
                translate3d(0,0,0)
                scale(1);
            }

            50% {
              transform:
                translate3d(20px,-30px,0)
                scale(1.08);
            }
          }

          @keyframes platformPulse {
            0%, 100% {
              opacity: .55;

              transform:
                translateX(-50%)
                rotateX(65deg)
                scale(1);
            }

            50% {
              opacity: .9;

              transform:
                translateX(-50%)
                rotateX(65deg)
                scale(1.08);
            }
          }

          @keyframes ringRotate {
            from {
              transform:
                translate(-50%, -50%)
                rotateX(70deg)
                rotateZ(0deg);
            }

            to {
              transform:
                translate(-50%, -50%)
                rotateX(70deg)
                rotateZ(360deg);
            }
          }

          @keyframes ringRotateReverse {
            from {
              transform:
                translate(-50%, -50%)
                rotateX(70deg)
                rotateZ(360deg);
            }

            to {
              transform:
                translate(-50%, -50%)
                rotateX(70deg)
                rotateZ(0deg);
            }
          }

          @keyframes cardBackFloat {
            0%, 100% {
              transform:
                rotateY(20deg)
                rotateX(8deg)
                translate3d(0,0,-40px);
            }

            50% {
              transform:
                rotateY(24deg)
                rotateX(12deg)
                translate3d(-8px,-18px,-20px);
            }
          }

          @keyframes cardMiddleFloat {
            0%, 100% {
              transform:
                rotateY(-18deg)
                rotateX(7deg)
                translate3d(0,0,10px);
            }

            50% {
              transform:
                rotateY(-24deg)
                rotateX(10deg)
                translate3d(10px,-15px,30px);
            }
          }

          @keyframes cardFrontFloat {
            0%, 100% {
              transform:
                rotateY(-5deg)
                rotateX(5deg)
                translate3d(0,0,60px);
            }

            50% {
              transform:
                rotateY(-10deg)
                rotateX(9deg)
                translate3d(0,-15px,80px);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .dashboard-orb,
            .dashboard-ring,
            .dashboard-floating-card,
            .dashboard-3d-platform {
              animation: none !important;
            }
          }

          @media (max-width: 768px) {
            .dashboard-floating-card {
              width: 145px;
              height: 105px;
              padding: 14px;
            }

            .dashboard-ring-one {
              width: 230px;
            }

            .dashboard-ring-two {
              width: 200px;
            }
          }
        `}
      </style>

    </main>
  );
}