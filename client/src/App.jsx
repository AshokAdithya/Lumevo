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
            <Route path="/" exact element={<Home />} />
            <Route path="/about-us" exact element={<AboutUs />} />
            <Route path="/achievements" exact element={<Achievements />} />
            <Route path="/contact-us" exact element={<ContactUs />} />
            <Route path="/signup" exact element={<SignUp />} />
            <Route path="/signin" exact element={<SignIn />} />
            <Route
              path="/users/:id/verify/:token"
              exact
              element={<EmailVerify />}
            />
            <Route
              path="/expert-details"
              exact
              element={
                <RequireAuth>
                  <ExpertDetails />
                </RequireAuth>
              }
            />
            <Route path="/password-reset" exact element={<ForgotPassword />} />
            <Route
              path="/password-reset/:id/:token"
              exact
              element={
                <RequireAuth>
                  <PasswordReset />
                </RequireAuth>
              }
            />
            <Route
              path="/user"
              exact
              element={
                <RequireAuth>
                  <WorkPage />
                </RequireAuth>
              }
            />
            <Route path="logout" exact element={<Logout />} />
            <Route path="insights" exact element={<Insights />} />

            {/* Student */}
            <Route
              path="/my-orders"
              exact
              element={
                <RequireAuth>
                  <MyOrders />
                </RequireAuth>
              }
            />
            <Route
              path="/payment"
              exact
              element={
                <RequireAuth>
                  <Payment />
                </RequireAuth>
              }
            />
            <Route
              path="/apply/:type"
              exact
              element={
                <RequireAuth>
                  <ApplyType />
                </RequireAuth>
              }
            />
            <Route
              path="/update-files"
              exact
              element={
                <RequireAuth>
                  <UpdateFile />
                </RequireAuth>
              }
            />
            <Route
              path="/my-profile"
              exact
              element={
                <RequireAuth>
                  <MyProfile />
                </RequireAuth>
              }
            />

            {/* Expert */}
            <Route
              path="/take-action"
              exact
              element={
                <RequireAuth>
                  <TakeAction />
                </RequireAuth>
              }
            />

            {/* Admin */}
            <Route
              path="/update-data"
              exact
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
