import {
  useId,
} from "react";

import type {
  InputHTMLAttributes,
} from "react";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Input({
  label,
  error,
  helperText,
  id,
  className = "",
  ...props
}: InputProps) {
  const generatedId = useId();

  const inputId =
    id ?? generatedId;

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-300"
        >
          {label}
        </label>
      )}

      <input
        {...props}
        id={inputId}
        aria-invalid={
          error ? true : undefined
        }
        aria-describedby={
          error || helperText
            ? `${inputId}-description`
            : undefined
        }
        className={[
          "w-full rounded-lg border bg-slate-950 px-3 py-2.5 text-sm text-white",
          "placeholder:text-slate-600",
          "focus:outline-none focus:ring-2 focus:ring-blue-500",
          error
            ? "border-red-500"
            : "border-slate-700",
          className,
        ].join(" ")}
      />

      {(error || helperText) && (
        <p
          id={`${inputId}-description`}
          className={`text-xs ${
            error
              ? "text-red-400"
              : "text-slate-500"
          }`}
        >
          {error ?? helperText}
        </p>
      )}
    </div>
  );
}
