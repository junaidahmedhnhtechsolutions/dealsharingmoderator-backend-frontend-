import { BrowserRouter, Routes, Route } from "react-router";
import { ToastContainer } from "react-toastify";
import { lazy, Suspense } from "react";
import AppLayout from "./layout/AppLayout";
import { useTheme } from "./context/ThemeContext";
import { useAuth } from "./context/AuthContext";
import routes from "./helper/routes";
import Loader from "./components/common/Loader";

// Lazy-loaded pages
const SignIn = lazy(() => import("./pages/AuthPages/SignIn"));
const ForgetPasswordPage = lazy(
  () => import("./pages/AuthPages/ForgetPasswordPage")
);
const ChangePasswordPage = lazy(
  () => import("./pages/AuthPages/ChangePasswordPage")
);

const DashboardPage = lazy(() => import("./pages/OtherPage/DashboardPage"));
const ProfilePage = lazy(() => import("./pages/OtherPage/ProfilePage"));
const DealPage = lazy(() => import("./pages/OtherPage/DealPage"));
const DealDetailPage = lazy(() => import("./pages/OtherPage/DealDetailPage"));
const ModeratorPage = lazy(() => import("./pages/OtherPage/ModeratorPage"));
const UsersPage = lazy(() => import("./pages/OtherPage/UsersPage"));
const NotFound = lazy(() => import("./pages/OtherPage/NotFound"));

export default function App() {
  const { theme } = useTheme();
  const { user } = useAuth();

  const isMaster = user?.role === "Master_Vendor";
  const canManageUsers = user?.permissions?.includes("user_management");
  const canReviewDeals = user?.permissions?.includes("review_deals");

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop={false}
        closeOnClick={false}
        pauseOnFocusLoss
        pauseOnHover
        rtl={false}
        theme={theme}
      />
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Protected Layout */}
            <Route element={<AppLayout />}>
              <Route index path={routes.profile} element={<ProfilePage />} />
              <Route
                index
                path={routes.dashboard}
                element={<DashboardPage />}
              />

              {isMaster && (
                <>
                  <Route index path={routes.deal} element={<DealPage />} />
                  <Route index path={routes.user} element={<UsersPage />} />
                  <Route
                    index
                    path={routes.moderator}
                    element={<ModeratorPage />}
                  />
                  <Route
                    index
                    path={`${routes.dealDetail}/:id`}
                    element={<DealDetailPage />}
                  />
                </>
              )}

              {!isMaster && (
                <>
                  {canManageUsers && (
                    <Route index path={routes.user} element={<UsersPage />} />
                  )}
                  {canReviewDeals && (
                    <>
                      <Route
                        index
                        path={`${routes.dealDetail}/:id`}
                        element={<DealDetailPage />}
                      />
                      <Route index path={routes.deal} element={<DealPage />} />
                    </>
                  )}
                </>
              )}
            </Route>

            {/* Auth Routes */}
            <Route path={routes.signin} element={<SignIn />} />
            <Route
              path={routes.resetPassword}
              element={<ForgetPasswordPage />}
            />
            <Route
              path={routes.changePassword}
              element={<ChangePasswordPage />}
            />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}
