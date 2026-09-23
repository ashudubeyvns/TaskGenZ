import {
  useEffect,
  useState,
} from "react";

import type { FormEvent } from "react";

import { Navigate, useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/authStore";

export default function Login() {
  const navigate = useNavigate();

  const {
    login,
    isAuthenticated,
    error,
    clearError,
  } = useAuthStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    clearError();
  }, [clearError]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setIsLoading(true);
    clearError();

    try {
      await login(username, password);

      navigate("/dashboard", {
        replace: true,
      });
    } catch {
      // Error is already stored in Zustand.
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="taskgenz-login relative min-h-screen overflow-hidden bg-slate-100 px-4 text-slate-900 transition-colors duration-500 dark:bg-[#030305] dark:text-white">

      {/* =========================================================
          BACKGROUND
      ========================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Purple orb */}
        <div className="absolute left-[-12%] top-[-15%] h-[520px] w-[520px] rounded-full bg-purple-400/20 blur-[130px] transition-opacity duration-500 dark:bg-purple-600/20 animate-tgz-orb-one" />

        {/* Cyan orb */}
        <div className="absolute bottom-[-18%] right-[-10%] h-[520px] w-[520px] rounded-full bg-cyan-400/20 blur-[140px] transition-opacity duration-500 dark:bg-cyan-500/15 animate-tgz-orb-two" />

        {/* Pink orb */}
        <div className="absolute left-[45%] top-[35%] h-[380px] w-[380px] rounded-full bg-pink-400/15 blur-[120px] transition-opacity duration-500 dark:bg-pink-500/10 animate-tgz-orb-three" />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.06] transition-opacity duration-500 dark:opacity-[0.12] [background-image:linear-gradient(rgba(15,23,42,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.18)_1px,transparent_1px)] dark:[background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:55px_55px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />

        {/* Perspective floor */}
        <div className="absolute bottom-[-30%] left-1/2 h-[70%] w-[140%] -translate-x-1/2 opacity-[0.08] transition-opacity duration-500 dark:opacity-20 [background-image:linear-gradient(rgba(168,85,247,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.25)_1px,transparent_1px)] [background-size:60px_60px] [transform:perspective(600px)_rotateX(62deg)]" />

        {/* Floating particles */}

        <span className="absolute left-[12%] top-[18%] h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.8)] dark:bg-cyan-300 dark:shadow-[0_0_20px_rgba(34,211,238,0.9)] animate-tgz-particle-one" />

        <span className="absolute left-[22%] top-[72%] h-1.5 w-1.5 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.7)] dark:bg-purple-300 dark:shadow-[0_0_18px_rgba(168,85,247,0.9)] animate-tgz-particle-two" />

        <span className="absolute right-[18%] top-[20%] h-2 w-2 rounded-full bg-pink-500 shadow-[0_0_18px_rgba(236,72,153,0.7)] dark:bg-pink-300 dark:shadow-[0_0_20px_rgba(236,72,153,0.9)] animate-tgz-particle-three" />

        <span className="absolute right-[10%] top-[68%] h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.7)] dark:bg-cyan-300 dark:shadow-[0_0_18px_rgba(34,211,238,0.9)] animate-tgz-particle-four" />

        <span className="absolute left-[48%] top-[12%] h-1 w-1 rounded-full bg-slate-500 shadow-[0_0_10px_rgba(100,116,139,0.7)] dark:bg-white dark:shadow-[0_0_15px_white] animate-tgz-particle-five" />

        <span className="absolute left-[72%] top-[78%] h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_18px_rgba(168,85,247,0.7)] dark:bg-purple-300 dark:shadow-[0_0_20px_rgba(168,85,247,0.9)] animate-tgz-particle-six" />

        {/* Floating 3D rings */}

        <div className="absolute left-[7%] top-[35%] h-24 w-24 rounded-full border border-purple-500/20 dark:border-purple-400/20 [transform:perspective(500px)_rotateX(65deg)_rotateZ(20deg)] animate-tgz-ring-one" />

        <div className="absolute right-[8%] top-[38%] h-32 w-32 rounded-full border border-cyan-500/20 dark:border-cyan-400/20 [transform:perspective(500px)_rotateY(65deg)_rotateZ(-20deg)] animate-tgz-ring-two" />

        <div className="absolute bottom-[8%] left-[18%] h-16 w-16 rounded-full border border-pink-500/20 dark:border-pink-400/20 [transform:perspective(400px)_rotateX(65deg)] animate-tgz-ring-three" />
      </div>

      {/* =========================================================
          MAIN CONTENT
      ========================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center py-10">

        <div className="w-full max-w-md [perspective:1400px]">

          {/* =====================================================
              BRAND
          ====================================================== */}

          <div className="mb-8 text-center">

            {/* Animated Logo */}
            <div className="relative mx-auto mb-5 h-20 w-20">

              {/* Outer glow */}
              <div className="absolute inset-[-8px] rounded-[26px] bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-400 opacity-25 blur-xl dark:opacity-30 animate-tgz-logo-glow" />

              {/* Rotating border */}
              <div className="absolute inset-0 rounded-[24px] bg-[conic-gradient(from_0deg,#a855f7,#ec4899,#22d3ee,#a855f7)] p-[2px] animate-tgz-logo-spin">

                <div className="flex h-full w-full items-center justify-center rounded-[22px] bg-white dark:bg-[#08080c]">

                  <span className="bg-gradient-to-br from-purple-700 via-pink-500 to-cyan-500 bg-clip-text text-2xl font-black tracking-tight text-transparent dark:from-white dark:via-purple-200 dark:to-cyan-200">
                    TG
                  </span>

                </div>
              </div>

              {/* Floating highlight */}
              <div className="absolute right-[-4px] top-[-4px] h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] dark:bg-cyan-300 dark:shadow-[0_0_18px_rgba(34,211,238,1)] animate-tgz-dot" />
            </div>

            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-700 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04] dark:text-cyan-300 dark:shadow-none">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.8)] dark:bg-cyan-300 dark:shadow-[0_0_10px_rgba(34,211,238,1)]" />
              Task Management Workspace
            </div>

            <h1 className="mt-4 bg-gradient-to-r from-slate-900 via-purple-700 to-cyan-700 bg-clip-text text-4xl font-black tracking-tight text-transparent dark:from-white dark:via-purple-200 dark:to-cyan-200 sm:text-5xl">
              TaskGenZ
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
              Plan, manage and deliver your work with a modern
              next-generation workspace.
            </p>
          </div>

          {/* =====================================================
              LOGIN CARD
          ====================================================== */}

          <div className="relative">

            {/* Animated gradient border */}
            <div className="absolute -inset-[1px] rounded-[28px] bg-[linear-gradient(120deg,rgba(168,85,247,0.8),rgba(236,72,153,0.4),rgba(34,211,238,0.8),rgba(168,85,247,0.8))] bg-[length:300%_300%] opacity-60 blur-[1px] dark:opacity-70 animate-tgz-border" />

            {/* Card glow */}
            <div className="absolute -inset-8 rounded-[40px] bg-purple-500/10 blur-3xl dark:bg-purple-500/10" />

            {/* Card */}
            <form
              onSubmit={handleSubmit}
              className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.14)] backdrop-blur-2xl transition-all duration-500 hover:[transform:perspective(1200px)_rotateX(1deg)_rotateY(-1deg)] dark:border-white/10 dark:bg-[rgba(9,9,13,0.82)] dark:shadow-[0_30px_100px_rgba(0,0,0,0.65)] sm:p-8"
            >

              {/* Card shine */}
              <div className="pointer-events-none absolute -left-1/2 top-0 h-full w-[70%] rotate-12 bg-gradient-to-r from-transparent via-slate-900/[0.025] to-transparent dark:via-white/[0.04] animate-tgz-shine" />

              {/* Top accent */}
              <div className="mb-7 flex items-center justify-between">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-600 dark:text-purple-300">
                    Secure Access
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                    Welcome back
                  </h2>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-cyan-600 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-cyan-300 dark:shadow-[0_0_25px_rgba(34,211,238,0.08)]">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                    />
                    <path
                      d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.8 1.8-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V22h-2.55v-.1a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.8-1.8.06-.06A1.7 1.7 0 0 0 8.1 17a1.7 1.7 0 0 0-1.56-1.03H6.4v-2.55h.1A1.7 1.7 0 0 0 8.06 12a1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.8-1.8.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 12.43 7.1V7h2.55v.1A1.7 1.7 0 0 0 16 8.66a1.7 1.7 0 0 0 1.88-.34l.06-.06 1.8 1.8-.06.06A1.7 1.7 0 0 0 19.4 12c.18.55.57.94 1.12 1.12h.08v2.55h-.08A1.7 1.7 0 0 0 19.4 15Z"
                    />
                  </svg>
                </div>
              </div>

              <div className="space-y-5">

                {/* =================================================
                    USERNAME
                ================================================== */}

                <div className="group">

                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    Username
                  </label>

                  <div className="relative">

                    <div className="pointer-events-none absolute inset-y-0 left-0 flex w-12 items-center justify-center text-slate-400 transition-colors duration-300 group-focus-within:text-cyan-500 dark:text-slate-500 dark:group-focus-within:text-cyan-300">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M20 21a8 8 0 0 0-16 0" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>

                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(event) =>
                        setUsername(event.target.value)
                      }
                      placeholder="Enter username"
                      autoComplete="username"
                      required
                      className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 hover:border-slate-300 focus:border-cyan-400/60 focus:bg-cyan-50 focus:shadow-[0_0_30px_rgba(34,211,238,0.10)] dark:border-white/10 dark:bg-white/[0.035] dark:text-white dark:placeholder:text-slate-600 dark:hover:border-white/20 dark:focus:bg-cyan-400/[0.035]"
                    />

                    <div className="pointer-events-none absolute bottom-0 left-5 right-5 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent transition-transform duration-500 group-focus-within:scale-x-100" />
                  </div>
                </div>

                {/* =================================================
                    PASSWORD
                ================================================== */}

                <div className="group">

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                    >
                      Password
                    </label>

                    <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-600">
                      Protected
                    </span>
                  </div>

                  <div className="relative">

                    <div className="pointer-events-none absolute inset-y-0 left-0 flex w-12 items-center justify-center text-slate-400 transition-colors duration-300 group-focus-within:text-purple-500 dark:text-slate-500 dark:group-focus-within:text-purple-300">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5 transition-transform duration-300 group-focus-within:scale-110"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <rect
                          x="4"
                          y="10"
                          width="16"
                          height="11"
                          rx="2"
                        />
                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                      </svg>
                    </div>

                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Enter password"
                      autoComplete="current-password"
                      required
                      className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 hover:border-slate-300 focus:border-purple-400/60 focus:bg-purple-50 focus:shadow-[0_0_30px_rgba(168,85,247,0.12)] dark:border-white/10 dark:bg-white/[0.035] dark:text-white dark:placeholder:text-slate-600 dark:hover:border-white/20 dark:focus:bg-purple-400/[0.035]"
                    />

                    <div className="pointer-events-none absolute bottom-0 left-5 right-5 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-purple-400 to-transparent transition-transform duration-500 group-focus-within:scale-x-100" />
                  </div>
                </div>

                {/* =================================================
                    ERROR
                ================================================== */}

                {error && (
                  <div
                    role="alert"
                    className="animate-tgz-error rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 shadow-sm dark:border-red-500/20 dark:bg-red-500/[0.07] dark:text-red-300 dark:shadow-[0_0_30px_rgba(239,68,68,0.08)]"
                  >
                    <div className="flex items-start gap-3">

                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-500/10 dark:text-red-300">
                        !
                      </div>

                      <div>
                        <p className="font-semibold text-red-700 dark:text-red-200">
                          Sign in failed
                        </p>

                        <p className="mt-1 text-xs leading-5 text-red-500/80 dark:text-red-300/80">
                          {error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* =================================================
                    SIGN IN
                ================================================== */}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative h-14 w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-cyan-500 px-4 font-bold text-white shadow-[0_12px_35px_rgba(168,85,247,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(168,85,247,0.35)] active:translate-y-[2px] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >

                  {/* Button shine */}
                  <span className="absolute inset-y-0 -left-[30%] w-[25%] skew-x-[-20deg] bg-white/25 blur-md transition-transform duration-700 group-hover:translate-x-[600%]" />

                  {/* Button glow */}
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-white/10 to-cyan-300/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <span className="relative flex items-center justify-center gap-3">

                    {isLoading ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                        <span>
                          Signing in...
                        </span>
                      </>
                    ) : (
                      <>
                        <span>
                          Sign In
                        </span>

                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M5 12h13" />
                          <path d="m13 6 6 6-6 6" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>

                {/* Security status */}
                <div className="flex items-center justify-center gap-2 pt-1 text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-600">

                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.8)] dark:bg-emerald-400 dark:shadow-[0_0_10px_rgba(52,211,153,0.9)]" />

                  Secure authenticated session

                </div>
              </div>
            </form>
          </div>

          {/* =====================================================
              FOOTER
          ====================================================== */}

          <div className="mt-7 text-center">

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-600">

              <span className="h-px w-10 bg-slate-300 dark:bg-white/10" />

              <span>
                TaskGenZ
              </span>

              <span className="h-px w-10 bg-slate-300 dark:bg-white/10" />

            </div>

            <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-700">
              Modern Sprint & Delivery Workspace
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================
          ANIMATION STYLES
      ========================================================== */}

      <style>{`
        @keyframes tgz-orb-one {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(70px, 45px, 0) scale(1.12);
          }
        }

        @keyframes tgz-orb-two {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(-60px, -50px, 0) scale(1.08);
          }
        }

        @keyframes tgz-orb-three {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(45px, -60px, 0);
          }
        }

        @keyframes tgz-particle-one {
          0%, 100% {
            transform: translate3d(0, 0, 0);
            opacity: .35;
          }

          50% {
            transform: translate3d(45px, -80px, 0);
            opacity: 1;
          }
        }

        @keyframes tgz-particle-two {
          0%, 100% {
            transform: translate3d(0, 0, 0);
            opacity: .2;
          }

          50% {
            transform: translate3d(-50px, -55px, 0);
            opacity: 1;
          }
        }

        @keyframes tgz-particle-three {
          0%, 100% {
            transform: translate3d(0, 0, 0);
            opacity: .3;
          }

          50% {
            transform: translate3d(-35px, 70px, 0);
            opacity: 1;
          }
        }

        @keyframes tgz-particle-four {
          0%, 100% {
            transform: translate3d(0, 0, 0);
            opacity: .25;
          }

          50% {
            transform: translate3d(-60px, -50px, 0);
            opacity: 1;
          }
        }

        @keyframes tgz-particle-five {
          0%, 100% {
            transform: translate3d(0, 0, 0);
            opacity: .2;
          }

          50% {
            transform: translate3d(30px, 60px, 0);
            opacity: .9;
          }
        }

        @keyframes tgz-particle-six {
          0%, 100% {
            transform: translate3d(0, 0, 0);
            opacity: .3;
          }

          50% {
            transform: translate3d(-45px, 45px, 0);
            opacity: 1;
          }
        }

        @keyframes tgz-ring-one {
          0%, 100% {
            transform: perspective(500px) rotateX(65deg) rotateZ(20deg) translateY(0);
          }

          50% {
            transform: perspective(500px) rotateX(65deg) rotateZ(35deg) translateY(-25px);
          }
        }

        @keyframes tgz-ring-two {
          0%, 100% {
            transform: perspective(500px) rotateY(65deg) rotateZ(-20deg) translateY(0);
          }

          50% {
            transform: perspective(500px) rotateY(65deg) rotateZ(-5deg) translateY(25px);
          }
        }

        @keyframes tgz-ring-three {
          0%, 100% {
            transform: perspective(400px) rotateX(65deg) translateX(0);
          }

          50% {
            transform: perspective(400px) rotateX(65deg) translateX(30px);
          }
        }

        @keyframes tgz-logo-spin {
          0% {
            transform: rotate(0deg);
          }

          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes tgz-logo-glow {
          0%, 100% {
            opacity: .25;
            transform: scale(.95);
          }

          50% {
            opacity: .55;
            transform: scale(1.08);
          }
        }

        @keyframes tgz-dot {
          0%, 100% {
            transform: scale(.8);
            opacity: .6;
          }

          50% {
            transform: scale(1.25);
            opacity: 1;
          }
        }

        @keyframes tgz-border {
          0% {
            background-position: 0% 50%;
          }

          50% {
            background-position: 100% 50%;
          }

          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes tgz-shine {
          0% {
            transform: translateX(-80%) rotate(12deg);
          }

          100% {
            transform: translateX(300%) rotate(12deg);
          }
        }

        @keyframes tgz-error {
          0%, 100% {
            transform: translateX(0);
          }

          20% {
            transform: translateX(-7px);
          }

          40% {
            transform: translateX(7px);
          }

          60% {
            transform: translateX(-5px);
          }

          80% {
            transform: translateX(5px);
          }
        }

        .animate-tgz-orb-one {
          animation: tgz-orb-one 12s ease-in-out infinite;
        }

        .animate-tgz-orb-two {
          animation: tgz-orb-two 14s ease-in-out infinite;
        }

        .animate-tgz-orb-three {
          animation: tgz-orb-three 10s ease-in-out infinite;
        }

        .animate-tgz-particle-one {
          animation: tgz-particle-one 7s ease-in-out infinite;
        }

        .animate-tgz-particle-two {
          animation: tgz-particle-two 9s ease-in-out infinite;
        }

        .animate-tgz-particle-three {
          animation: tgz-particle-three 8s ease-in-out infinite;
        }

        .animate-tgz-particle-four {
          animation: tgz-particle-four 10s ease-in-out infinite;
        }

        .animate-tgz-particle-five {
          animation: tgz-particle-five 6s ease-in-out infinite;
        }

        .animate-tgz-particle-six {
          animation: tgz-particle-six 11s ease-in-out infinite;
        }

        .animate-tgz-ring-one {
          animation: tgz-ring-one 9s ease-in-out infinite;
        }

        .animate-tgz-ring-two {
          animation: tgz-ring-two 11s ease-in-out infinite;
        }

        .animate-tgz-ring-three {
          animation: tgz-ring-three 8s ease-in-out infinite;
        }

        .animate-tgz-logo-spin {
          animation: tgz-logo-spin 14s linear infinite;
        }

        .animate-tgz-logo-glow {
          animation: tgz-logo-glow 3s ease-in-out infinite;
        }

        .animate-tgz-dot {
          animation: tgz-dot 2s ease-in-out infinite;
        }

        .animate-tgz-border {
          animation: tgz-border 7s ease infinite;
        }

        .animate-tgz-shine {
          animation: tgz-shine 6s linear infinite;
        }

        .animate-tgz-error {
          animation: tgz-error .45s ease-in-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .taskgenz-login *,
          .taskgenz-login *::before,
          .taskgenz-login *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}