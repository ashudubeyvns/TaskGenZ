import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 px-6 py-10"
    >
      <div className="max-w-md text-center">
        <div
          aria-hidden="true"
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-xl"
        >
          📋
        </div>

        <h2 className="text-lg font-semibold text-white">
          {title}
        </h2>

        {description && (
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}

        {action && (
          <div className="mt-5">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}