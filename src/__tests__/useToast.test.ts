import {
  act,
  renderHook,
} from "@testing-library/react";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  useToast,
} from "../hooks/useToast";

describe(
  "useToast",
  () => {
    it(
      "shows a success toast",
      () => {
        const {
          result,
        } = renderHook(() =>
          useToast(),
        );

        expect(
          result.current.toast,
        ).toBeNull();

        act(() => {
          result.current.showToast(
            "Task created",
            "success",
          );
        });

        expect(
          result.current.toast,
        ).toEqual({
          message:
            "Task created",
          type: "success",
        });
      },
    );

    it(
      "shows an error toast",
      () => {
        const {
          result,
        } = renderHook(() =>
          useToast(),
        );

        act(() => {
          result.current.showToast(
            "Something went wrong",
            "error",
          );
        });

        expect(
          result.current.toast,
        ).toEqual({
          message:
            "Something went wrong",
          type: "error",
        });
      },
    );

    it(
      "uses info as the default toast type",
      () => {
        const {
          result,
        } = renderHook(() =>
          useToast(),
        );

        act(() => {
          result.current.showToast(
            "Information",
          );
        });

        expect(
          result.current.toast?.type,
        ).toBe("info");
      },
    );

    it(
      "hides the current toast",
      () => {
        const {
          result,
        } = renderHook(() =>
          useToast(),
        );

        act(() => {
          result.current.showToast(
            "Hello",
          );
        });

        expect(
          result.current.toast,
        ).not.toBeNull();

        act(() => {
          result.current.hideToast();
        });

        expect(
          result.current.toast,
        ).toBeNull();
      },
    );
  },
);