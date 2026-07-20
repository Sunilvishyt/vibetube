import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/my_components/RootLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        lazy: () => import("./pages/Homepage"),
      },
      {
        path: "auth/login",
        lazy: () => import("./pages/Login"),
      },
      {
        path: "register",
        lazy: () => import("./pages/Register"),
      },
      {
        path: "auth/logout",
        lazy: () => import("./pages/Logout"),
      },
      {
        path: "upload",
        lazy: () => import("./pages/UploadPage"),
      },
      {
        path: "watch/:id",
        lazy: () => import("./pages/WatchPage"),
      },
      {
        path: "search",
        lazy: () => import("./pages/SearchPage"),
      },
      {
        path: "liked",
        lazy: () => import("./pages/Likedpage"),
      },
      {
        path: "history",
        lazy: () => import("./pages/Historypage"),
      },
      {
        path: "trending",
        lazy: () => import("./pages/Trendingpage"),
      },
      {
        path: "profile/:id",
        lazy: () => import("./pages/Profilepage"),
      },
      {
        path: "testpage",
        lazy: () => import("./pages/Testpage"),
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
