import { lazy, Suspense, type ReactNode } from "react";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  useLocation,
} from "react-router";
import PageLoader from "./Loading";

const MainLayout = lazy(() => import("./MainLayout"));
const Board = lazy(() => import("../Pages/Board/Board"));
const Projects = lazy(() => import("../Pages/Projects/Projects"));
const Backlog = lazy(() => import("../Pages/Backlog/Backlog"));
const CheckIn = lazy(() => import("../Pages/CheckIn/CheckIn"));
const Reports = lazy(() => import("../Pages/Reports/Reports"));
const Settings = lazy(() => import("../Pages/Settings/Settings"));
const Login = lazy(() => import("../Pages/AuthFlow/Components/Login"));
const Signup = lazy(() => import("../Pages/AuthFlow/Components/Signup"));
const ForgotPassword = lazy(
  () => import("../Pages/AuthFlow/Components/ForgotPassword")
);
const NotFound = lazy(() => import("./NotFound"));

export const RouteNames = {
  home: "/projects",
  login: "/login",
  signup: "/signup",
  forgot: "/forgot-password",
  projects: "/projects",
  board: "/board",
  backlog: "/backlog",
  checkIn: "/check-in",
  reports: "/reports",
  settings: "/settings",
};

export const isLoggedIn = () => localStorage.getItem("is_loggedIn") === "true";

const ProtectedRoute = () => {
  const location = useLocation();
  return isLoggedIn() ? (
    <Outlet />
  ) : (
    <Navigate to={RouteNames.login} replace state={{ from: location }} />
  );
};

const PublicOnlyRoute = () =>
  isLoggedIn() ? <Navigate to={RouteNames.home} replace /> : <Outlet />;

const withSuspense = (el: ReactNode) => (
  <Suspense fallback={<PageLoader />}>{el}</Suspense>
);

export const AppRouter = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: RouteNames.login, element: withSuspense(<Login />) },
      { path: RouteNames.signup, element: withSuspense(<Signup />) },
      { path: RouteNames.forgot, element: withSuspense(<ForgotPassword />) },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: withSuspense(<MainLayout />),
        children: [
          { index: true, element: <Navigate to={RouteNames.projects} replace /> },
          { path: "projects", element: withSuspense(<Projects />) },
          { path: "board", element: withSuspense(<Board />) },
          { path: "backlog", element: withSuspense(<Backlog />) },
          { path: "check-in", element: withSuspense(<CheckIn />) },
          { path: "reports", element: withSuspense(<Reports />) },
          { path: "settings", element: withSuspense(<Settings />) },
          { path: "*", element: withSuspense(<NotFound />) },
        ],
      },
    ],
  },
  { path: "*", element: withSuspense(<NotFound />) },
]);
