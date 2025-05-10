import React from "react";
import Home from "./components/components_lite/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
import ProtectedRoute from "./components/recruitercomponents/ProtectedRoute";
import RecruiterDashboard from "./components/recruitercomponents/recruiterDashboard";
import AllApplicants from "./components/recruitercomponents/AllApplicants";
import RecruiterProfile from "./components/recruitercomponents/RecruiterProfile";
import SavedJobs from "./components/components_lite/SavedJobs";
import PendingApplications from "./components/recruitercomponents/PendingApplications";
// import PublicRoute from "./components/authentication/PublicRoute";

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
  //recruiter

  {
    path: "/recruiter/profile",
    element:
    <ProtectedRoute>
    {" "}
    <RecruiterProfile />
  </ProtectedRoute>
  },

  {
    path: "/recruiter/dashboard",
    element:
    <ProtectedRoute>
    {" "}
    <RecruiterDashboard />
  </ProtectedRoute>
  },
  {
    path: "/recruiter/companies",
    element: (
      <ProtectedRoute>
        {" "}
        <Companies />
      </ProtectedRoute>
    ),
  },
  {
    path: "/recruiter/companies/create",
    element: (
      <ProtectedRoute>
        <CompanyCreate />
      </ProtectedRoute>
    ),
  },
  {
    path: "/recruiter/companies/:id",
    element: (
      <ProtectedRoute>
        <CompanySetup />
      </ProtectedRoute>
    ),
  },
  {
    path: "/recruiter/jobs",
    element: (
      <ProtectedRoute>
        <RecruiterJobs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/recruiter/jobs/create",
    element: (
      <ProtectedRoute>
        <PostJob />
      </ProtectedRoute>
    ),
  },
  {
    path: "/recruiter/jobs/:id/applicants",
    element: (
      <ProtectedRoute>
        <Applicants />
      </ProtectedRoute>
    ),
  },
  {
    path: "/recruiter/applicants",
    element: (
      <ProtectedRoute>
        <AllApplicants/>
      </ProtectedRoute>
    )
  },
  {
    path: "/saved/jobs",
    element: <SavedJobs />,
  },
  {
    path: "/recruiter/applications/pending",
    element: <PendingApplications />
  }
]);

function App() {
  return (
    <div>
      <RouterProvider router={appRouter}></RouterProvider>
    </div>
  );
}

export default App;
