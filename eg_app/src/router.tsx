import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Home from "./pages/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
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
