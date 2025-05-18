import React from "react";
import Home from "./components/components_lite/Home";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Login from "./components/authentication/Login";
import Signup from "./components/authentication/Signup";
import Jobs from "./components/components_lite/Jobs.jsx";
import Browse from "./components/components_lite/Browse.jsx";
import Description from "./components/components_lite/Description.jsx";
import Profile from "./components/components_lite/Profile.jsx";
import Companies from "./components/recruitercomponents/Companies.jsx";
import CompanyCreate from "./components/recruitercomponents/CompanyCreate.jsx";
import CompanySetup from "./components/recruitercomponents/CompanySetup.jsx";
import ResumeBuilderPage from "./components/components_lite/ResumeBuilderPage.jsx";
import RecruiterJobs from "./components/recruitercomponents/recruiterJobs.jsx";
import PostJob from "./components/recruitercomponents/PostJob";
import Applicants from "./components/recruitercomponents/Applicants";
import RecruiterProtectedRoute from "./components/recruitercomponents/ProtectedRoute";
import RecruiterDashboard from "./components/recruitercomponents/recruiterDashboard";
import AllApplicants from "./components/recruitercomponents/AllApplicants";
import RecruiterProfile from "./components/recruitercomponents/RecruiterProfile";
import SavedJobs from "./components/components_lite/SavedJobs";
import PendingApplications from "./components/recruitercomponents/PendingApplications";
import AdminDashboard from "./components/admincomponents/AdminDashboard";
import AdminUsers from "./components/admincomponents/AdminUsers";
import AdminCompanies from "./components/admincomponents/AdminCompanies";
import AdminProtectedRoute from "./components/admincomponents/ProtectedRoute";
import AdminJob from "./components/admincomponents/AdminJob";
import Messages from "./components/messagecomponents/Messages";
import ProtectedRoute from "./components/authentication/ProtectedRoute";
import InterviewList from "./components/Interview/InterviewList";
import InterviewDetails from "./components/Interview/InterviewCard";
import ScheduleInterviewForm from "./components/Interview/ScheduleInterviewForm";
import RecruiterScheduledInterviews from "./components/recruitercomponents/RecruiterScheduledInterviews";
import InterviewCalendar from "./components/Interview/InterviewCalendar";

import { AuthProvider } from "./context/AuthContext"; 


const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: (
      // <PublicRoute>
      //   <Login />
      // </PublicRoute>
      <Login />
    ),
  },
  {
    path: "/register",
    element: (
      // <PublicRoute>
      //   <Signup />
      // </PublicRoute>
      <Signup />
    ),
  },
  {
    path: "/jobs",
    element: <Jobs />,
  },
  {
    path: "/browse",
    element: <Browse />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/description/:id",
    element: <Description />,
  },
  {
    path: "/resume/create",
    element: <ResumeBuilderPage />,
  },
  // Admin routes
  {
    path: "/admin/dashboard",
    element: (
      <AdminProtectedRoute>
        <AdminDashboard />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <AdminProtectedRoute>
        <AdminUsers />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/companies",
    element: (
      <AdminProtectedRoute>
        <AdminCompanies />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs",
    element: (
      <AdminProtectedRoute>
        <AdminJob />
      </AdminProtectedRoute>
    ),
  },
  //recruiter

  {
    path: "/recruiter/profile",
    element:
    <RecruiterProtectedRoute>
    {" "}
    <RecruiterProfile />
  </RecruiterProtectedRoute>
  },

  {
    path: "/recruiter/dashboard",
    element:
    <RecruiterProtectedRoute>
    {" "}
    <RecruiterDashboard />
  </RecruiterProtectedRoute>
  },
  {
    path: "/recruiter/companies",
    element: (
      <RecruiterProtectedRoute>
        {" "}
        <Companies />
      </RecruiterProtectedRoute>
    ),
  },
  {
    path: "/recruiter/companies/create",
    element: (
      <RecruiterProtectedRoute>
        <CompanyCreate />
      </RecruiterProtectedRoute>
    ),
  },
  {
    path: "/recruiter/companies/:id",
    element: (
      <RecruiterProtectedRoute>
        <CompanySetup />
      </RecruiterProtectedRoute>
    ),
  },
  {
    path: "/recruiter/jobs",
    element: (
      <RecruiterProtectedRoute>
        <RecruiterJobs />
      </RecruiterProtectedRoute>
    ),
  },
  {
    path: "/schedule-interview",
    element: (
      <RecruiterProtectedRoute>
        <Navigate to="/recruiter/interviews/schedule" replace />
      </RecruiterProtectedRoute>
    ),
  },
  {
    path: "/recruiter/jobs/create",
    element: (
      <RecruiterProtectedRoute>
        <PostJob />
      </RecruiterProtectedRoute>
    ),
  },
  {
    path: "/recruiter/jobs/:id/applicants",
    element: (
      <RecruiterProtectedRoute>
        <Applicants />
      </RecruiterProtectedRoute>
    ),
  },
  {
    path: "/recruiter/applicants",
    element: (
      <RecruiterProtectedRoute>
        <AllApplicants/>
      </RecruiterProtectedRoute>
    )
  },
  {
    path: "/saved/jobs",
    element: <SavedJobs />,
  },
  {
    path: "/messages",
    element: (
      <ProtectedRoute>
        <Messages />
      </ProtectedRoute>
    ),
  },
  {
    path: "/recruiter/applications/pending",
    element: <RecruiterProtectedRoute><PendingApplications /></RecruiterProtectedRoute>
  },
  // Interview routes
  {
    path: "/interviews",
    element: (
      <ProtectedRoute>
        <InterviewList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/interviews/calendar",
    element: (
      <ProtectedRoute>
        <InterviewCalendar />
      </ProtectedRoute>
    ),
  },
  {
    path: "/interviews/:interviewId",
    element: (
      <ProtectedRoute>
        <InterviewDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "/recruiter/interviews",
    element: (
      <RecruiterProtectedRoute>
        <RecruiterScheduledInterviews />
      </RecruiterProtectedRoute>
    ),
  },
  {
    path: "/recruiter/interviews/schedule",
    element: (
      <RecruiterProtectedRoute>
        <ScheduleInterviewForm />
      </RecruiterProtectedRoute>
    ),
  },
]);

function App() {
  const currentUser = JSON.parse(localStorage.getItem('user')) || null;
  return (
    <div>
      <AuthProvider user={currentUser}>
        <RouterProvider router={appRouter} />
      </AuthProvider>
    </div>
  );
}

export default App;
