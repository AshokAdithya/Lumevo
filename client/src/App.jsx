import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Loading from "./Pages/Loading";
const Home = lazy(() => import("./Pages/Home"));
const AboutUs = lazy(() => import("./Pages/AboutUs"));
const Achievements = lazy(() => import("./Pages/Achievements"));
const ContactUs = lazy(() => import("./Pages/ContactUs"));
const SignUp = lazy(() => import("./Pages/SignUp"));
const SignIn = lazy(() => import("./Pages/SignIn"));
const EmailVerify = lazy(() => import("./Pages/EmailVerify"));
const ForgotPassword = lazy(() => import("./Pages/ForgotPassword"));
const PasswordReset = lazy(() => import("./Pages/PasswordReset"));
const WorkPage = lazy(() => import("./Pages/WorkPage"));
const Logout = lazy(() => import("./Pages/Logout"));
const ApplyType = lazy(() => import("./Pages/ApplyType"));
const ExpertDetails = lazy(() => import("./Pages/ExpertDetails"));
const Payment = lazy(() => import("./Pages/Payment"));
const MyOrders = lazy(() => import("./Pages/MyOrders"));
const TakeAction = lazy(() => import("./Pages/TakeAction"));
const UpdateFile = lazy(() => import("./Pages/UpdateFile"));
const MyProfile = lazy(() => import("./Pages/MyProfile"));
const UpdateData = lazy(() => import("./Pages/UpdateData"));

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
            <Route path="/expert-details" exact element={<ExpertDetails />} />
            <Route path="/password-reset" exact element={<ForgotPassword />} />
            <Route
              path="/password-reset/:id/:token"
              exact
              element={<PasswordReset />}
            />
            <Route path="/user" exact element={<WorkPage />} />
            <Route path="logout" exact element={<Logout />} />

            {/* Student */}
            <Route path="/my-orders" exact element={<MyOrders />} />
            <Route path="/payment" exact element={<Payment />} />
            <Route path="/apply/:type" exact element={<ApplyType />} />
            <Route path="/update-files" exact element={<UpdateFile />} />
            <Route path="/my-profile" exact element={<MyProfile />} />

            {/* Expert */}
            <Route path="/take-action" exact element={<TakeAction />} />

            {/* Admin */}
            <Route path="/update-data" exact element={<UpdateData />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
