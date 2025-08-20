import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Loading from "./Pages/Loading";
import RequireAuth from "./utils/RequireAuth";
import { ToastContainer } from "react-toastify";

const Home = lazy(() => import("./Home/Home"));
const AboutUs = lazy(() => import("./AboutUs/AboutUs"));
const Achievements = lazy(() => import("./Pages/Achievements"));
const ContactUs = lazy(() => import("./ContactUs/ContactUs"));
const SignUp = lazy(() => import("./SignUp/SignUp"));
const SignIn = lazy(() => import("./SignIn/SignIn"));
const EmailVerify = lazy(() => import("./Pages/EmailVerify"));
const ForgotPassword = lazy(() => import("./Pages/ForgotPassword"));
const PasswordReset = lazy(() => import("./Pages/PasswordReset"));
const WorkPage = lazy(() => import("./Pages/WorkPage"));
const Logout = lazy(() => import("./Pages/Logout"));
const ApplyType = lazy(() => import("./Home/ApplyType"));
const ExpertDetails = lazy(() => import("./Pages/ExpertDetails"));
const Payment = lazy(() => import("./DashboardStudent/Payment"));
const MyOrders = lazy(() => import("./DashboardStudent/MyOrders"));
const TakeAction = lazy(() => import("./Pages/TakeAction"));
const UpdateFile = lazy(() => import("./Pages/UpdateFile"));
const MyProfile = lazy(() => import("./Pages/MyProfile"));
const UpdateData = lazy(() => import("./Pages/UpdateData"));
const Insights = lazy(() => import("./Pages/Insights"));

function App() {
  return (
    <Router>
      <div className="App">
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public Routes */}
            <Route index element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/users/:id/verify/:token" element={<EmailVerify />} />
            <Route path="/password-reset" element={<ForgotPassword />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/logout" element={<Logout />} />

            {/* Protected Routes */}
            <Route
              path="/expert-details"
              element={
                <RequireAuth>
                  <ExpertDetails />
                </RequireAuth>
              }
            />
            <Route
              path="/password-reset/:id/:token"
              element={
                <RequireAuth>
                  <PasswordReset />
                </RequireAuth>
              }
            />
            <Route
              path="/user"
              element={
                <RequireAuth>
                  <WorkPage />
                </RequireAuth>
              }
            />
            <Route
              path="/my-orders"
              element={
                <RequireAuth>
                  <MyOrders />
                </RequireAuth>
              }
            />
            <Route
              path="/payment"
              element={
                <RequireAuth>
                  <Payment />
                </RequireAuth>
              }
            />
            <Route
              path="/apply/:type"
              element={
                <RequireAuth>
                  <ApplyType />
                </RequireAuth>
              }
            />
            <Route
              path="/update-files"
              element={
                <RequireAuth>
                  <UpdateFile />
                </RequireAuth>
              }
            />
            <Route
              path="/my-profile"
              element={
                <RequireAuth>
                  <MyProfile />
                </RequireAuth>
              }
            />
            <Route
              path="/take-action"
              element={
                <RequireAuth>
                  <TakeAction />
                </RequireAuth>
              }
            />
            <Route
              path="/update-data"
              element={
                <RequireAuth>
                  <UpdateData />
                </RequireAuth>
              }
            />
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
