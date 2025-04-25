import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Register />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
]);
