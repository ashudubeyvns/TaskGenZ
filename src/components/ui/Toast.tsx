import {
  useEffect,
} from "react";

export type ToastVariant =
  | "success"
  | "error"
  | "info"
  | "warning";

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  onClose?: () => void;
  duration?: number;
}

export default function Toast({
  message,
  variant = "info",
  onClose,
  duration = 4000,
}: ToastProps) {
  useEffect(() => {
    if (!onClose) {
      return;
    }

    const timer =
      window.setTimeout(
        onClose,
        duration,
      );

    return () => {
      window.clearTimeout(timer);
    };
  }, [onClose, duration]);

  const styles = {
    success:
      "border-emerald-800 bg-emerald-950/90 text-emerald-300",
    error:
      "border-red-800 bg-red-950/90 text-red-300",
    info:
      "border-blue-800 bg-blue-950/90 text-blue-300",
    warning:
      "border-amber-800 bg-amber-950/90 text-amber-300",
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-[100] flex max-w-sm items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-2xl ${styles[variant]}`}
    >
      <span className="flex-1">
        {message}
      </span>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="rounded px-1 text-current opacity-70 hover:opacity-100"
        >
          ×
        </button>
      )}
    </div>
  );
}