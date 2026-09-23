import {
  useCallback,
  useState,
} from "react";

export type ToastType =
  | "success"
  | "error"
  | "info"
  | "warning";

export interface ToastState {
  message: string;
  type: ToastType;
}

export function useToast() {
  const [toast, setToast] =
    useState<ToastState | null>(
      null,
    );

  const showToast =
    useCallback(
      (
        message: string,
        type: ToastType = "info",
      ) => {
        setToast({
          message,
          type,
        });
      },
      [],
    );

  const hideToast =
    useCallback(() => {
      setToast(null);
    }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
}