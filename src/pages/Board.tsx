import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import type {
  Task,
  TaskStatus,
} from "../types/task";

import TaskDrawer from "../components/task/TaskDrawer";
import AddTaskModal from "../components/task/AddTaskModal";
import NotificationBell from "../components/notification/NotificationBell";

import {
  useTasks,
  useUsers,
  useSprints,
  useComments,
} from "../hooks/useTasks";

import { useNotifications } from "../hooks/useNotifications";

import { useBoardStore } from "../store/boardStore";

import KanbanBoard from "../components/board/KanbanBoard";

export default function Board() {
  const navigate = useNavigate();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
    error: taskError,
  } = useTasks();

  const {
    data: comments,
    isLoading: commentsLoading,
  } = useComments();

  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
  } = useUsers();

  const {
    data: sprints,
    isLoading: sprintsLoading,
  } = useSprints();

  const initializeTasks =
    useBoardStore(
      (state) =>
        state.initializeTasks,
    );

  const initializeComments =
    useBoardStore(
      (state) =>
        state.initializeComments,
    );

  const boardTasks =
    useBoardStore(
      (state) => state.tasks,
    );

  const [
    selectedTask,
    setSelectedTask,
  ] = useState<Task | null>(
    null,
  );

  const [
    showAddTask,
    setShowAddTask,
  ] = useState(false);

  // =========================================================
  // SEARCH
  // =========================================================

  const [
    search,
    setSearch,
  ] = useState("");

  // =========================================================
  // FILTERS
  // =========================================================

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<
    "all" | TaskStatus
  >(() => {
    const status =
      searchParams.get(
        "status",
      );

    if (
      status === "backlog" ||
      status === "in-progress" ||
      status === "review" ||
      status === "done"
    ) {
      return status;
    }

    return "all";
  });

  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState<
    "all" | Task["priority"]
  >("all");

  const [
    assigneeFilter,
    setAssigneeFilter,
  ] = useState<
    number | "all"
  >("all");

  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  useNotifications();

  // =========================================================
  // SERVER DATA -> ZUSTAND
  // =========================================================

  useEffect(() => {
    if (tasks) {
      initializeTasks(tasks);
    }

    if (comments) {
      initializeComments(comments);
    }
  }, [
    tasks,
    comments,
    initializeTasks,
    initializeComments,
  ]);

  // =========================================================
  // KEEP URL STATUS IN SYNC
  // =========================================================

  useEffect(() => {
    const status =
      searchParams.get(
        "status",
      );

    if (
      status === "backlog" ||
      status === "in-progress" ||
      status === "review" ||
      status === "done"
    ) {
      if (
        statusFilter !== status
      ) {
        setStatusFilter(
          status,
        );
      }

      return;
    }

    if (
      statusFilter !== "all"
    ) {
      setStatusFilter(
        "all",
      );
    }
  }, [
    searchParams,
    statusFilter,
  ]);

  // =========================================================
  // KEEP SELECTED TASK FRESH
  // =========================================================

  useEffect(() => {
    if (!selectedTask) {
      return;
    }

    const fresh =
      boardTasks.find(
        (task) =>
          task.id ===
          selectedTask.id,
      );

    if (fresh) {
      setSelectedTask(
        fresh,
      );
    }
  }, [
    boardTasks,
    selectedTask?.id,
  ]);

  // =========================================================
  // FILTER TASKS
  // =========================================================

  const filteredTasks =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return boardTasks.filter(
        (task) => {
          const matchesSearch =
            !query ||
            task.title
              .toLowerCase()
              .includes(query) ||
            task.description
              .toLowerCase()
              .includes(query);

          const matchesStatus =
            statusFilter ===
              "all" ||
            task.status ===
              statusFilter;

          const matchesPriority =
            priorityFilter ===
              "all" ||
            task.priority ===
              priorityFilter;

          const matchesAssignee =
            assigneeFilter ===
              "all" ||
            task.assigneeId ===
              assigneeFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesPriority &&
            matchesAssignee
          );
        },
      );
    }, [
      boardTasks,
      search,
      statusFilter,
      priorityFilter,
      assigneeFilter,
    ]);

  // =========================================================
  // STATUS FILTER
  // =========================================================

  function handleStatusChange(
    value:
      | "all"
      | TaskStatus,
  ) {
    setStatusFilter(
      value,
    );

    const params =
      new URLSearchParams(
        searchParams,
      );

    if (
      value === "all"
    ) {
      params.delete(
        "status",
      );
    } else {
      params.set(
        "status",
        value,
      );
    }

    setSearchParams(
      params,
      {
        replace: true,
      },
    );
  }

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  function clearFilters() {
    setSearch("");
    setStatusFilter(
      "all",
    );
    setPriorityFilter(
      "all",
    );
    setAssigneeFilter(
      "all",
    );

    const params =
      new URLSearchParams(
        searchParams,
      );

    params.delete(
      "status",
    );

    setSearchParams(
      params,
      {
        replace: true,
      },
    );
  }

  const filtersActive =
    search.trim() !== "" ||
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    assigneeFilter !== "all";

  // =========================================================
  // LOADING
  // =========================================================

  if (
    tasksLoading ||
    usersLoading ||
    commentsLoading ||
    sprintsLoading
  ) {
    return (
      <main
        className="
          relative flex min-h-screen
          items-center justify-center
          overflow-hidden
          bg-white
          dark:bg-[#050505]
        "
      >
        <div
          className="
            pointer-events-none absolute
            -left-40 -top-40
            h-96 w-96 rounded-full
            bg-violet-500/10 blur-[120px]
          "
        />

        <div
          className="
            pointer-events-none absolute
            -bottom-40 -right-40
            h-96 w-96 rounded-full
            bg-pink-500/10 blur-[120px]
          "
        />

        <div className="relative text-center">
          <div
            className="
              mx-auto flex h-16 w-16
              items-center justify-center
              rounded-[22px]
              border border-violet-200
              bg-violet-50
              shadow-[0_15px_50px_rgba(168,85,247,.15)]
              dark:border-violet-400/20
              dark:bg-violet-500/10
            "
          >
            <div
              className="
                h-7 w-7 animate-spin
                rounded-full border-4
                border-violet-200
                border-t-violet-500
                dark:border-white/10
                dark:border-t-violet-400
              "
            />
          </div>

          <p
            className="
              mt-5 text-sm font-semibold
              text-slate-500
              dark:text-slate-400
            "
          >
            Loading Taskgenz board...
          </p>

          <p
            className="
              mt-1 text-xs
              text-slate-400
              dark:text-slate-600
            "
          >
            Preparing your workspace
          </p>
        </div>
      </main>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (
    tasksError ||
    usersError ||
    !tasks ||
    !users ||
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
            relative max-w-md overflow-hidden
            rounded-[28px]
            border border-red-200
            bg-red-50 p-8 text-center
            shadow-[0_25px_80px_rgba(239,68,68,.08)]
            dark:border-red-500/20
            dark:bg-red-500/5
          "
        >
          <div
            className="
              absolute -right-16 -top-16
              h-40 w-40 rounded-full
              bg-red-500/10 blur-3xl
            "
          />

          <div
            className="
              relative mx-auto flex h-14 w-14
              items-center justify-center
              rounded-2xl
              bg-red-500/10
              text-xl font-black
              text-red-500
            "
          >
            !
          </div>

          <h1
            className="
              relative mt-5 font-black
              text-red-600
              dark:text-red-300
            "
          >
            Unable to load Sprint Board
          </h1>

          <p
            className="
              relative mt-2 text-sm
              text-red-500
              dark:text-red-400
            "
          >
            {taskError instanceof Error
              ? taskError.message
              : "Please try again."}
          </p>
        </div>
      </main>
    );
  }

  // =========================================================
  // MAIN BOARD
  // =========================================================

  return (
    <main
      className="
        relative min-h-screen
        overflow-x-auto
        overflow-y-hidden
        bg-white
        p-5
        dark:bg-[#050505]
        md:p-8
      "
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Purple orb */}
        <div
          className="
            absolute -left-40 top-0
            h-[520px] w-[520px]
            rounded-full
            bg-violet-500/[0.09]
            blur-[140px]
            animate-[taskgenzOrbOne_10s_ease-in-out_infinite]
          "
        />

        {/* Pink orb */}
        <div
          className="
            absolute -right-40 top-[18%]
            h-[500px] w-[500px]
            rounded-full
            bg-pink-500/[0.08]
            blur-[140px]
            animate-[taskgenzOrbTwo_12s_ease-in-out_infinite]
          "
        />

        {/* Bottom violet */}
        <div
          className="
            absolute bottom-[-220px]
            left-[35%]
            h-[500px] w-[500px]
            rounded-full
            bg-purple-500/[0.06]
            blur-[150px]
            animate-[taskgenzOrbThree_14s_ease-in-out_infinite]
          "
        />

        {/* Grid */}
        <div
          className="
            absolute inset-0 opacity-[0.025]
            [background-image:linear-gradient(rgba(139,92,246,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,.8)_1px,transparent_1px)]
            [background-size:48px_48px]
            dark:opacity-[0.045]
          "
        />
      </div>

      <div className="relative mx-auto max-w-[1700px]">
        {/* ===================================================
            3D HERO
        =================================================== */}

        <section
          className="
            relative mb-7
            min-h-[260px]
            overflow-hidden
            rounded-[34px]
            border border-slate-200/80
            bg-gradient-to-br
            from-white
            via-white
            to-violet-50/70
            shadow-[0_25px_90px_rgba(15,23,42,.07)]
            dark:border-white/[0.08]
            dark:bg-gradient-to-br
            dark:from-[#0b0b0d]
            dark:via-[#09090b]
            dark:to-[#140b1d]
            dark:shadow-[0_30px_100px_rgba(0,0,0,.4)]
          "
        >
          {/* Hero glow */}
          <div
            className="
              pointer-events-none absolute
              -left-20 -top-24
              h-72 w-72 rounded-full
              bg-violet-500/15 blur-[100px]
            "
          />

          <div
            className="
              pointer-events-none absolute
              -right-20 bottom-[-100px]
              h-80 w-80 rounded-full
              bg-pink-500/10 blur-[100px]
            "
          />

          {/* Hero grid */}
          <div
            className="
              pointer-events-none absolute inset-0
              opacity-20
              [background-image:linear-gradient(rgba(168,85,247,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,.18)_1px,transparent_1px)]
              [background-size:40px_40px]
              [mask-image:linear-gradient(to_bottom,black,transparent)]
              dark:opacity-30
            "
          />

          {/* Hero content */}
          <div
            className="
              relative z-10
              flex min-h-[260px]
              flex-col justify-center
              px-7 py-8
              md:px-10
              lg:max-w-[58%]
            "
          >
            <div
              className="
                inline-flex w-fit
                items-center gap-2
                rounded-full
                border border-violet-200
                bg-violet-50/90
                px-3 py-1.5
                text-[10px] font-black
                uppercase tracking-[0.18em]
                text-violet-600
                dark:border-violet-400/20
                dark:bg-violet-500/10
                dark:text-violet-300
              "
            >
              <span
                className="
                  h-1.5 w-1.5 rounded-full
                  bg-violet-500
                  shadow-[0_0_12px_rgba(168,85,247,.9)]
                  animate-pulse
                "
              />

              Taskgenz Workspace
            </div>

            <h1
              className="
                mt-4 text-4xl
                font-black tracking-[-0.04em]
                text-slate-950
                md:text-5xl
                dark:text-white
              "
            >
              Sprint Board
            </h1>

            <p
              className="
                mt-3 max-w-xl
                text-sm leading-6
                text-slate-500
                dark:text-slate-400
              "
            >
              Move, organize and track your work
              with a visual workflow built for
              fast-moving teams.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div
                className="
                  rounded-xl
                  border border-slate-200
                  bg-white/80
                  px-3 py-2
                  dark:border-white/[0.08]
                  dark:bg-white/[0.04]
                "
              >
                <span
                  className="
                    text-lg font-black
                    text-violet-600
                    dark:text-violet-300
                  "
                >
                  {filteredTasks.length}
                </span>

                <span
                  className="
                    ml-2 text-[10px] font-bold
                    uppercase tracking-wider
                    text-slate-400
                  "
                >
                  Visible
                </span>
              </div>

              <div
                className="
                  rounded-xl
                  border border-slate-200
                  bg-white/80
                  px-3 py-2
                  dark:border-white/[0.08]
                  dark:bg-white/[0.04]
                "
              >
                <span
                  className="
                    text-lg font-black
                    text-pink-500
                    dark:text-pink-300
                  "
                >
                  {boardTasks.length}
                </span>

                <span
                  className="
                    ml-2 text-[10px] font-bold
                    uppercase tracking-wider
                    text-slate-400
                  "
                >
                  Total Tasks
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
              3D FLOATING TASK PREVIEW
          ================================================= */}

          <div
            className="
              pointer-events-none
              absolute right-[-40px] top-1/2
              hidden h-[280px] w-[520px]
              -translate-y-1/2
              [perspective:1200px]
              lg:block
            "
          >
            {/* Main floating card */}
            <div
              className="
                absolute right-24 top-8
                w-60
                rounded-[22px]
                border border-white/50
                bg-white/75
                p-4
                shadow-[0_30px_80px_rgba(76,29,149,.18)]
                backdrop-blur-2xl
                [transform-style:preserve-3d]
                animate-[taskgenzHeroFloat_5s_ease-in-out_infinite]
                dark:border-white/10
                dark:bg-white/[0.07]
                dark:shadow-[0_30px_90px_rgba(168,85,247,.18)]
              "
            >
              <div className="flex items-center justify-between">
                <span
                  className="
                    rounded-full
                    bg-violet-500/10
                    px-2 py-1
                    text-[8px] font-black
                    uppercase tracking-wider
                    text-violet-500
                    dark:text-violet-300
                  "
                >
                  In Progress
                </span>

                <span className="text-xs text-slate-400">
                  •••
                </span>
              </div>

              <div className="mt-4">
                <div
                  className="
                    h-2 w-32 rounded-full
                    bg-slate-200
                    dark:bg-white/10
                  "
                />

                <div
                  className="
                    mt-2 h-2 w-44 rounded-full
                    bg-slate-100
                    dark:bg-white/[0.06]
                  "
                />

                <div className="mt-4 flex items-center gap-2">
                  <span
                    className="
                      h-7 w-7 rounded-full
                      bg-gradient-to-br
                      from-violet-500 to-pink-500
                    "
                  />

                  <span
                    className="
                      h-2 w-16 rounded-full
                      bg-slate-200
                      dark:bg-white/10
                    "
                  />
                </div>
              </div>
            </div>

            {/* Back card */}
            <div
              className="
                absolute right-4 top-20
                h-44 w-48
                rounded-[22px]
                border border-white/40
                bg-gradient-to-br
                from-pink-500/20
                to-violet-500/10
                backdrop-blur-xl
                [transform:rotateY(-18deg)_rotateX(8deg)_rotateZ(5deg)]
                animate-[taskgenzHeroBackFloat_6s_ease-in-out_infinite]
                dark:border-white/10
              "
            />

            {/* Small floating card */}
            <div
              className="
                absolute right-64 top-40
                w-36
                rounded-2xl
                border border-white/50
                bg-white/80
                p-3
                shadow-[0_20px_50px_rgba(236,72,153,.15)]
                backdrop-blur-xl
                [transform:rotateY(12deg)_rotateX(-6deg)]
                animate-[taskgenzMiniFloat_4.5s_ease-in-out_infinite]
                dark:border-white/10
                dark:bg-white/[0.06]
              "
            >
              <div
                className="
                  h-2 w-20 rounded-full
                  bg-gradient-to-r
                  from-pink-400 to-violet-500
                "
              />

              <div
                className="
                  mt-3 h-2 w-24 rounded-full
                  bg-slate-200
                  dark:bg-white/10
                "
              />

              <div
                className="
                  mt-2 h-2 w-16 rounded-full
                  bg-slate-100
                  dark:bg-white/[0.06]
                "
              />
            </div>

            {/* Floating orb */}
            <div
              className="
                absolute right-20 top-0
                h-8 w-8 rounded-full
                bg-gradient-to-br
                from-violet-400 to-pink-500
                shadow-[0_0_30px_rgba(168,85,247,.5)]
                animate-[taskgenzOrbFloat_3s_ease-in-out_infinite]
              "
            />
          </div>
        </section>

        {/* ===================================================
            HEADER ACTIONS
        =================================================== */}

        <header
          className="
            mb-6 flex flex-col gap-5
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          <div>
            <div
              className="
                inline-flex items-center gap-2
                rounded-full
                border border-violet-200
                bg-violet-50
                px-3 py-1.5
                text-xs font-bold
                uppercase tracking-[0.16em]
                text-violet-600
                dark:border-violet-400/20
                dark:bg-violet-500/10
                dark:text-violet-300
              "
            >
              <span
                className="
                  h-2 w-2 animate-pulse
                  rounded-full bg-violet-500
                "
              />

              Live Board
            </div>

            <p
              className="
                mt-3 text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              <span
                className="
                  font-bold text-violet-500
                  dark:text-violet-300
                "
              >
                {filteredTasks.length}
              </span>{" "}
              of{" "}
              <span
                className="
                  font-bold text-slate-700
                  dark:text-slate-200
                "
              >
                {boardTasks.length}
              </span>{" "}
              tasks visible
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                navigate("/dashboard")
              }
              className="
                rounded-xl
                border border-slate-200
                bg-white
                px-4 py-2.5
                text-sm font-semibold
                text-slate-600
                transition-all
                hover:-translate-y-0.5
                hover:border-violet-300
                hover:text-violet-600
                dark:border-white/10
                dark:bg-white/[0.04]
                dark:text-slate-300
                dark:hover:border-violet-400/30
                dark:hover:text-violet-300
              "
            >
              ← Dashboard
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/analytics")
              }
              className="
                rounded-xl
                border border-slate-200
                bg-white
                px-4 py-2.5
                text-sm font-semibold
                text-slate-600
                transition-all
                hover:-translate-y-0.5
                hover:border-violet-300
                hover:text-violet-600
                dark:border-white/10
                dark:bg-white/[0.04]
                dark:text-slate-300
                dark:hover:border-violet-400/30
                dark:hover:text-violet-300
              "
            >
              Analytics
            </button>

            <NotificationBell />

            <button
              type="button"
              onClick={() =>
                setShowAddTask(true)
              }
              className="
                group relative
                overflow-hidden
                rounded-xl
                bg-gradient-to-r
                from-violet-600
                via-purple-600
                to-pink-500
                px-5 py-2.5
                text-sm font-bold text-white
                shadow-[0_10px_30px_rgba(168,85,247,.22)]
                transition-all
                hover:-translate-y-1
                hover:shadow-[0_18px_50px_rgba(168,85,247,.34)]
              "
            >
              <span
                className="
                  absolute inset-0
                  translate-x-[-120%]
                  bg-gradient-to-r
                  from-transparent
                  via-white/20
                  to-transparent
                  transition-transform
                  duration-700
                  group-hover:translate-x-[120%]
                "
              />

              <span className="relative">
                + Add Task
              </span>
            </button>
          </div>
        </header>

        {/* ===================================================
            FILTER PANEL
        =================================================== */}

        <section
          className="
            relative mb-7
            overflow-hidden
            rounded-[26px]
            border border-slate-200
            bg-white/75
            p-4
            shadow-[0_15px_60px_rgba(15,23,42,.05)]
            backdrop-blur-2xl
            dark:border-white/[0.08]
            dark:bg-white/[0.035]
            dark:shadow-none
          "
        >
          <div
            className="
              pointer-events-none absolute
              left-0 top-0 h-full w-1
              bg-gradient-to-b
              from-violet-500
              via-purple-500
              to-pink-500
            "
          />

          <div
            className="
              flex flex-col gap-3
              xl:flex-row
            "
          >
            {/* Search */}
            <div className="relative flex-1">
              <span
                className="
                  pointer-events-none
                  absolute left-4 top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              >
                ⌕
              </span>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search tasks..."
                className="
                  w-full rounded-xl
                  border border-slate-200
                  bg-slate-50
                  py-3 pl-11 pr-4
                  text-sm text-slate-900
                  outline-none transition
                  focus:border-violet-400
                  focus:ring-4
                  focus:ring-violet-500/10
                  dark:border-white/10
                  dark:bg-black/30
                  dark:text-white
                  dark:placeholder:text-slate-600
                "
              />
            </div>

            {/* Status */}
            <FilterSelect
              value={statusFilter}
              onChange={(value) =>
                handleStatusChange(
                  value as
                    | "all"
                    | TaskStatus,
                )
              }
              options={[
                [
                  "all",
                  "All Statuses",
                ],
                [
                  "backlog",
                  "Backlog",
                ],
                [
                  "in-progress",
                  "In Progress",
                ],
                [
                  "review",
                  "Review",
                ],
                [
                  "done",
                  "Done",
                ],
              ]}
            />

            {/* Priority */}
            <FilterSelect
              value={priorityFilter}
              onChange={(value) =>
                setPriorityFilter(
                  value as
                    | "all"
                    | Task["priority"],
                )
              }
              options={[
                [
                  "all",
                  "All Priorities",
                ],
                [
                  "high",
                  "High",
                ],
                [
                  "medium",
                  "Medium",
                ],
                [
                  "low",
                  "Low",
                ],
              ]}
            />

            {/* Assignee */}
            <select
              value={assigneeFilter}
              onChange={(event) => {
                const value =
                  event.target.value;

                setAssigneeFilter(
                  value === "all"
                    ? "all"
                    : Number(value),
                );
              }}
              className="
                rounded-xl
                border border-slate-200
                bg-slate-50
                px-4 py-3
                text-sm text-slate-700
                outline-none
                focus:border-violet-400
                dark:border-white/10
                dark:bg-black/30
                dark:text-slate-300
              "
            >
              <option value="all">
                All Assignees
              </option>

              {users.map((user) => (
                <option
                  key={user.id}
                  value={user.id}
                >
                  {user.name}
                </option>
              ))}
            </select>

            {filtersActive && (
              <button
                type="button"
                onClick={clearFilters}
                className="
                  rounded-xl
                  border border-slate-200
                  px-4 py-3
                  text-sm font-semibold
                  text-slate-500
                  transition
                  hover:border-pink-300
                  hover:text-pink-500
                  dark:border-white/10
                  dark:text-slate-400
                "
              >
                Clear
              </button>
            )}
          </div>
        </section>

        {/* ===================================================
            KANBAN
        =================================================== */}

        <div
          className="
            animate-[taskgenzBoardIn_.8s_ease-out]
          "
        >
          <KanbanBoard
            users={users}
            tasks={filteredTasks}
            onTaskClick={
              setSelectedTask
            }
          />
        </div>
      </div>

      {/* =====================================================
          TASK DRAWER
      ===================================================== */}

      <TaskDrawer
        task={selectedTask}
        users={users}
        onClose={() =>
          setSelectedTask(null)
        }
      />

      {/* =====================================================
          ADD TASK MODAL
      ===================================================== */}

      {showAddTask && (
        <AddTaskModal
          users={users}
          sprints={sprints}
          onClose={() =>
            setShowAddTask(false)
          }
        />
      )}

      {/* =====================================================
          BOARD ANIMATIONS
      ===================================================== */}

      <style>{`
        @keyframes taskgenzBoardIn {
          from {
            opacity: 0;
            transform: translateY(24px) scale(.985);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes taskgenzTaskEnter {
          from {
            opacity: 0;
            transform: translateY(16px) scale(.97);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes taskgenzTaskFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-2px);
          }
        }

        @keyframes taskgenzHeroFloat {
          0%,
          100% {
            transform:
              translate3d(0, 0, 35px)
              rotateX(4deg)
              rotateY(-8deg);
          }

          50% {
            transform:
              translate3d(0, -14px, 55px)
              rotateX(7deg)
              rotateY(-12deg);
          }
        }

        @keyframes taskgenzHeroBackFloat {
          0%,
          100% {
            transform:
              rotateY(-18deg)
              rotateX(8deg)
              rotateZ(5deg)
              translateY(0);
          }

          50% {
            transform:
              rotateY(-24deg)
              rotateX(12deg)
              rotateZ(7deg)
              translateY(-12px);
          }
        }

        @keyframes taskgenzMiniFloat {
          0%,
          100% {
            transform:
              rotateY(12deg)
              rotateX(-6deg)
              translateY(0);
          }

          50% {
            transform:
              rotateY(18deg)
              rotateX(-10deg)
              translateY(-10px);
          }
        }

        @keyframes taskgenzOrbFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(-10px, -15px, 20px) scale(1.12);
          }
        }

        @keyframes taskgenzOrbOne {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(80px, 40px, 0);
          }
        }

        @keyframes taskgenzOrbTwo {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(-70px, -40px, 0);
          }
        }

        @keyframes taskgenzOrbThree {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(60px, -30px, 0);
          }
        }
      `}</style>
    </main>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (
    value: string,
  ) => void;
  options: [
    string,
    string,
  ][];
}) {
  return (
    <select
      value={value}
      onChange={(event) =>
        onChange(
          event.target.value,
        )
      }
      className="
        rounded-xl
        border border-slate-200
        bg-slate-50
        px-4 py-3
        text-sm text-slate-700
        outline-none
        transition
        focus:border-violet-400
        focus:ring-4
        focus:ring-violet-500/10
        dark:border-white/10
        dark:bg-black/30
        dark:text-slate-300
      "
    >
      {options.map(
        ([
          optionValue,
          label,
        ]) => (
          <option
            key={optionValue}
            value={optionValue}
          >
            {label}
          </option>
        ),
      )}
    </select>
  );
}