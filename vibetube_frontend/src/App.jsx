import React, { lazy, Suspense } from "react";
import {
  Outlet,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  useNavigation,
} from "react-router-dom";
import NProgress from "nprogress";
import { useEffect } from "react";
import ProgressBar from "./components/progress_bar/ProgressBar";
// import ProgressBar from "./components/progress_bar/ProgressBar";
const LoginPage = lazy(() => import("./pages/Login"));
const RegisterPage = lazy(() => import("./pages/Register"));
const HomePage = lazy(() => import("./pages/Homepage"));
const Logout = lazy(() => import("./pages/Logout"));
const UploadPage = lazy(() => import("./pages/UploadPage"));
const WatchPage = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(import("./pages/WatchPage")), 5500); // 1.5 second delay
    }),
);
const SearchPage = lazy(() => import("./pages/SearchPage"));
const TestPage = lazy(() => import("./pages/Testpage"));
const LikedPage = lazy(() => import("./pages/Likedpage"));
const HistoryPage = lazy(() => import("./pages/Historypage"));
const TrendingPage = lazy(() => import("./pages/Trendingpage"));
const ProfilePage = lazy(() => import("./pages/Profilepage"));

NProgress.configure({ showSpinner: false, trickleSpeed: 200 });

function RootLayout() {
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === "loading") {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [navigation.state]);

  // Outlet renders whatever page route is currently active
  return <Outlet />;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/logout" element={<Logout />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/watch/:id" element={<WatchPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/liked" element={<LikedPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/trending" element={<TrendingPage />} />
      <Route path="/profile/:id" element={<ProfilePage />} />
      <Route path="/testpage" element={<TestPage />} />
    </Route>,
  ),
);

export default function App() {
  return (
    <Suspense fallback={null}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
