import {
  lazy,
  Suspense,
  useEffect,
} from "react";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";

import {
  useAuthStore,
} from "./store/authStore";

import {
  useThemeStore,
} from "./store/themeStore";

import ThemeToggle from "./components/layout/ThemeToggle";

// =========================================================
// LAZY LOADED PAGES
// =========================================================

const Login = lazy(
  () => import("./pages/Login"),
);

const Dashboard = lazy(
  () => import("./pages/Dashboard"),
);

const Board = lazy(
  () => import("./pages/Board"),
);

const Analytics = lazy(
  () => import("./pages/Analytics"),
);

// =========================================================
// ROUTE LOADING FALLBACK
// =========================================================

function RouteLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="text-center">
        <div
          aria-hidden="true"
          className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-800 border-t-blue-500"
        />

        <p className="mt-4 text-sm text-slate-400">
          Loading TaskGenZ...
        </p>
      </div>
    </main>
  );
}

// =========================================================
// APP
// =========================================================

function App() {
  const initializeAuth =
    useAuthStore(
      (state) =>
        state.initializeAuth,
    );

  const theme =
    useThemeStore(
      (state) => state.theme,
    );

  // =======================================================
  // AUTH INITIALIZATION
  // =======================================================

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  // =======================================================
  // APPLY THEME BEFORE / AFTER ROUTE CHANGES
  // =======================================================

  useEffect(() => {
  const root =
    document.documentElement;

  root.classList.toggle(
    "theme-light",
    theme === "light",
  );

  root.classList.toggle(
    "theme-dark",
    theme === "dark",
  );

  // Tailwind dark: support
  root.classList.toggle(
    "dark",
    theme === "dark",
  );

  root.setAttribute(
    "data-theme",
    theme,
  );
}, [theme]);

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <RouteLoading />
        }
      >
        <Routes>
          {/* ================================================= */}
          {/* LOGIN */}
          {/* ================================================= */}

          <Route
            path="/login"
            element={<Login />}
          />

          {/* ================================================= */}
          {/* PROTECTED ROUTES */}
          {/* ================================================= */}

          <Route
            element={
              <ProtectedRoute />
            }
          >
            <Route
              path="/dashboard"
              element={
                <Dashboard />
              }
            />

            <Route
              path="/board"
              element={
                <Board />
              }
            />

            <Route
              path="/analytics"
              element={
                <Analytics />
              }
            />
          </Route>

          {/* ================================================= */}
          {/* ROOT */}
          {/* ================================================= */}

          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          {/* ================================================= */}
          {/* UNKNOWN ROUTE */}
          {/* ================================================= */}

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />
        </Routes>
      </Suspense>

      {/* =====================================================
          GLOBAL THEME TOGGLE
      ===================================================== */}

      <ThemeToggle />
    </BrowserRouter>
  );
}

export default App;