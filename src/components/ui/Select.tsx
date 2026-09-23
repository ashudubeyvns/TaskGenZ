import {
  useId,
} from "react";

import type {
  SelectHTMLAttributes,
} from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export default function Select({
  label,
  options,
  error,
  id,
  className = "",
  ...props
}: SelectProps) {
  const generatedId = useId();

  const selectId =
    id ?? generatedId;

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-slate-300"
        >
          {label}
        </label>
      )}

      <select
        {...props}
        id={selectId}
        aria-invalid={
          error ? true : undefined
        }
        className={[
          "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white",
          "focus:outline-none focus:ring-2 focus:ring-blue-500",
          className,
        ].join(" ")}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}