import {
  useEffect,
  useRef,
  useState,
} from "react";

import { createPortal } from "react-dom";

import { useNotificationStore } from "../../store/notificationStore";

type StoredNotification =
  ReturnType<
    typeof useNotificationStore.getState
  >["notifications"][number];

type DropdownPosition = {
  top: number;
  right: number;
};

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);

  const [toastNotification, setToastNotification] =
    useState<StoredNotification | null>(null);

  const [dropdownPosition, setDropdownPosition] =
    useState<DropdownPosition>({
      top: 76,
      right: 24,
    });

  const containerRef =
    useRef<HTMLDivElement>(null);

  const bellRef =
    useRef<HTMLButtonElement>(null);

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  const toastRef =
    useRef<HTMLButtonElement>(null);

  /*
   * Remember when NotificationBell was mounted.
   *
   * This allows notifications created immediately before
   * Dashboard mounted to appear as a toast.
   */
  const mountedAtRef = useRef(Date.now());

  /*
   * IDs that existed when NotificationBell was first mounted.
   */
  const previousNotificationIds =
    useRef<Set<number> | null>(null);

  const notifications =
    useNotificationStore(
      (state) => state.notifications,
    );

  const markAsRead =
    useNotificationStore(
      (state) => state.markAsRead,
    );

  const markAllAsRead =
    useNotificationStore(
      (state) => state.markAllAsRead,
    );

  const removeNotification =
    useNotificationStore(
      (state) => state.removeNotification,
    );

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read,
    ).length;

  // =========================================================
  // DROPDOWN POSITION
  // =========================================================

  function updateDropdownPosition() {
    const button = bellRef.current;

    if (!button) {
      return;
    }

    const rect =
      button.getBoundingClientRect();

    const dropdownWidth = 380;

    const viewportPadding = 16;

    const right =
      Math.max(
        viewportPadding,
        window.innerWidth -
          rect.right,
      );

    const top =
      rect.bottom + 12;

    /*
     * Prevent the dropdown from going outside
     * the right side of the viewport.
     */
    const maxRight =
      window.innerWidth -
      dropdownWidth -
      viewportPadding;

    const safeRight =
      Math.min(
        right,
        Math.max(
          viewportPadding,
          maxRight,
        ),
      );

    setDropdownPosition({
      top,
      right: safeRight,
    });
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    updateDropdownPosition();

    function handleViewportChange() {
      updateDropdownPosition();
    }

    window.addEventListener(
      "resize",
      handleViewportChange,
    );

    window.addEventListener(
      "scroll",
      handleViewportChange,
      true,
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleViewportChange,
      );

      window.removeEventListener(
        "scroll",
        handleViewportChange,
        true,
      );
    };
  }, [isOpen]);

  // =========================================================
  // DETECT NEW NOTIFICATIONS
  // =========================================================

  useEffect(() => {
    const currentIds =
      new Set(
        notifications.map(
          (notification) =>
            notification.id,
        ),
      );

    /*
     * FIRST RENDER
     *
     * Old localStorage notifications should not
     * automatically show as toast.
     *
     * But a notification created immediately before
     * Dashboard mounted should be shown.
     */
    if (
      previousNotificationIds.current ===
      null
    ) {
      previousNotificationIds.current =
        currentIds;

      const recentNotification =
        [...notifications]
          .filter(
            (notification) =>
              !notification.read &&
              new Date(
                notification.createdAt,
              ).getTime() >=
                mountedAtRef.current -
                  30000,
          )
          .sort(
            (a, b) =>
              new Date(
                b.createdAt,
              ).getTime() -
              new Date(
                a.createdAt,
              ).getTime(),
          )[0];

      if (recentNotification) {
        setToastNotification(
          recentNotification,
        );
      }

      return;
    }

    /*
     * NORMAL UPDATE
     *
     * Find newly created notifications.
     */
    const previousIds =
      previousNotificationIds.current;

    const newNotifications =
      notifications.filter(
        (notification) =>
          !previousIds.has(
            notification.id,
          ),
      );

    previousNotificationIds.current =
      currentIds;

    if (
      newNotifications.length ===
      0
    ) {
      return;
    }

    /*
     * Show the newest notification.
     */
    const newestNotification =
      [...newNotifications].sort(
        (a, b) =>
          new Date(
            b.createdAt,
          ).getTime() -
          new Date(
            a.createdAt,
          ).getTime(),
      )[0];

    if (
      newestNotification &&
      !isOpen
    ) {
      setToastNotification(
        newestNotification,
      );
    }
  }, [
    notifications,
    isOpen,
  ]);

  // =========================================================
  // AUTO HIDE TOAST
  // =========================================================

  useEffect(() => {
    if (!toastNotification) {
      return;
    }

    const timeout =
      window.setTimeout(() => {
        setToastNotification(null);
      }, 6000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [toastNotification]);

  // =========================================================
  // CLOSE WHEN CLICKING OUTSIDE
  // =========================================================

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent,
    ) {
      const target =
        event.target as Node;

      const clickedInsideBell =
        containerRef.current?.contains(
          target,
        );

      const clickedInsideDropdown =
        dropdownRef.current?.contains(
          target,
        );

      const clickedInsideToast =
        toastRef.current?.contains(
          target,
        );

      if (
        !clickedInsideBell &&
        !clickedInsideDropdown &&
        !clickedInsideToast
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  // =========================================================
  // FORMAT TIME
  // =========================================================

  function formatTime(
    date: string,
  ) {
    const notificationDate =
      new Date(date);

    return notificationDate.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  }

  // =========================================================
  // NOTIFICATION ICON
  // =========================================================

  function getNotificationIcon(
    type: string,
  ) {
    switch (type) {
      case "task_assigned":
        return "👤";

      case "task_updated":
        return "✏️";

      case "task_moved":
        return "↔️";

      case "task_due":
        return "⏰";

      default:
        return "🔔";
    }
  }

  // =========================================================
  // TOAST CLICK
  // =========================================================

  function handleToastClick() {
    if (!toastNotification) {
      return;
    }

    markAsRead(
      toastNotification.id,
    );

    setToastNotification(null);

    updateDropdownPosition();

    setIsOpen(true);
  }

  // =========================================================
  // TOGGLE DROPDOWN
  // =========================================================

  function handleBellClick() {
    if (!isOpen) {
      updateDropdownPosition();
    }

    setIsOpen(
      (value) => !value,
    );
  }

  // =========================================================
  // TOAST
  // =========================================================

  const toastElement =
    toastNotification &&
    !isOpen
      ? createPortal(
          <button
            ref={toastRef}
            type="button"
            onClick={
              handleToastClick
            }
            className="fixed right-4 top-4 z-[99999] w-[min(380px,calc(100vw-2rem))] rounded-2xl border border-slate-700 bg-slate-900 p-4 text-left shadow-2xl shadow-black/50 transition hover:border-blue-500 hover:bg-slate-800"
          >
            <div className="flex gap-3">

              {/* Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-lg">
                {getNotificationIcon(
                  toastNotification.type,
                )}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">

                <div className="flex items-start justify-between gap-3">

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">
                      {toastNotification.title}
                    </p>

                    <p className="mt-1 text-sm font-semibold leading-5 text-white">
                      {toastNotification.message}
                    </p>
                  </div>

                  <span
                    role="button"
                    aria-label="Close notification"
                    onClick={(event) => {
                      event.stopPropagation();

                      setToastNotification(
                        null,
                      );
                    }}
                    className="rounded-md px-1.5 py-1 text-slate-500 hover:bg-slate-800 hover:text-white"
                  >
                    ×
                  </span>
                </div>

                <p className="mt-2 text-[11px] text-slate-600">
                  {formatTime(
                    toastNotification.createdAt,
                  )}
                </p>

              </div>
            </div>
          </button>,
          document.body,
        )
      : null;

  // =========================================================
  // DROPDOWN
  // =========================================================

  const dropdownElement =
    isOpen
      ? createPortal(
          <div
            ref={dropdownRef}
            style={{
              top:
                dropdownPosition.top,
              right:
                dropdownPosition.right,
            }}
            className="fixed z-[99999] w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl shadow-black/60"
          >

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4">

              <div>
                <h2 className="text-sm font-semibold text-white">
                  Notifications
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {unreadCount > 0
                    ? `${unreadCount} unread`
                    : "You're all caught up"}
                </p>
              </div>

              {unreadCount >
                0 && (
                <button
                  type="button"
                  onClick={
                    markAllAsRead
                  }
                  className="text-xs font-medium text-blue-400 transition hover:text-blue-300"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notification list */}
            <div className="max-h-[420px] overflow-y-auto">

              {notifications.length ===
              0 ? (
                <div className="px-6 py-12 text-center">

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-xl">
                    🔔
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-white">
                    No notifications
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    You're all caught up.
                  </p>

                </div>
              ) : (
                notifications.map(
                  (notification) => (
                    <div
                      key={
                        notification.id
                      }
                      className={`group border-b border-slate-900 px-4 py-4 transition ${
                        notification.read
                          ? "bg-slate-950"
                          : "bg-blue-500/5"
                      }`}
                    >

                      <div className="flex gap-3">

                        {/* Icon */}
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm">
                          {getNotificationIcon(
                            notification.type,
                          )}
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">

                          <div className="flex items-start justify-between gap-3">

                            <button
                              type="button"
                              onClick={() =>
                                markAsRead(
                                  notification.id,
                                )
                              }
                              className="text-left"
                            >

                              <p
                                className={`text-sm ${
                                  notification.read
                                    ? "font-medium text-slate-300"
                                    : "font-semibold text-white"
                                }`}
                              >
                                {
                                  notification.title
                                }
                              </p>

                              <p className="mt-1 text-xs leading-5 text-slate-500">
                                {
                                  notification.message
                                }
                              </p>

                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() =>
                                removeNotification(
                                  notification.id,
                                )
                              }
                              aria-label="Remove notification"
                              className="shrink-0 rounded-md px-1.5 py-1 text-slate-600 opacity-0 transition hover:bg-slate-800 hover:text-slate-300 group-hover:opacity-100"
                            >
                              ×
                            </button>

                          </div>

                          <div className="mt-2 flex items-center justify-between">

                            <span className="text-[11px] text-slate-600">
                              {formatTime(
                                notification.createdAt,
                              )}
                            </span>

                            {!notification.read && (
                              <span className="flex items-center gap-1 text-[11px] font-medium text-blue-400">

                                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />

                                Unread

                              </span>
                            )}

                          </div>

                        </div>
                      </div>
                    </div>
                  ),
                )
              )}

            </div>
          </div>,
          document.body,
        )
      : null;

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <>
      {/* =====================================================
          NOTIFICATION CONTAINER
      ====================================================== */}

      <div
        ref={containerRef}
        className="relative z-[10000]"
      >

        {/* ===================================================
            BELL BUTTON
        ==================================================== */}

        <button
          ref={bellRef}
          type="button"
          onClick={
            handleBellClick
          }
          aria-label="Notifications"
          aria-expanded={isOpen}
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
        >

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 0 1-5.714 0M18.75 10.5c0 3.142.75 4.5 1.5 5.25H3.75c.75-.75 1.5-2.108 1.5-5.25a6.75 6.75 0 1 1 13.5 0Z"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 19.5a2.25 2.25 0 0 0 4.5 0"
            />
          </svg>

          {/* Unread badge */}
          {unreadCount >
            0 && (
            <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-bold text-white ring-2 ring-slate-950">
              {unreadCount >
              99
                ? "99+"
                : unreadCount}
            </span>
          )}

        </button>
      </div>

      {/* =====================================================
          PORTAL TOAST
      ====================================================== */}

      {toastElement}

      {/* =====================================================
          PORTAL DROPDOWN
      ====================================================== */}

      {dropdownElement}
    </>
  );
}