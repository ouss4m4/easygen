import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <nav>whatever</nav>
        <Outlet />
      </div>
    ),
    children: [
      {
        index: true,
        element: <div>Home Page</div>,
      },
      {
        path: "/login",
        element: <div>login page</div>,
      },
      {
        path: "/signup",
        element: <div>signup page</div>,
      },
      {
        path: "/profile",
        element: <div>profile guarded page</div>,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Outlet />
  </StrictMode>
);
