import React, { useCallback } from "react";
import useAuth from "../hooks/TokenManagement";
import ExpertPage from "../DashboardExpert/ExpertPage.jsx";
import StudentPage from "../DashboardStudent/StudentPage.jsx";
import AdminPage from "./AdminPage";
import Loading from "./Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WorkPage = React.memo(() => {
  const { loading, user, isAuthenticated } = useAuth();

  const renderPage = useCallback(() => {
    if (user.role.includes("admin")) return <AdminPage />;
    if (user.role.includes("expert")) return <ExpertPage />;
    if (user.role.includes("student")) return <StudentPage />;
    return <div>User Not Authorized</div>;
  }, [user.role]);

  if (loading) return <Loading />;
  if (!isAuthenticated) return <div>User Not Authenticated</div>;

  return <div>{renderPage()}</div>;
});

export default WorkPage;
