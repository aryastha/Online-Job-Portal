import React from "react";
import Home from "./components/components_lite/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/authentication/Login";
import Signup from "./components/authentication/Signup";
import Jobs from "./components/components_lite/Jobs.jsx";
import Browse from "./components/components_lite/Browse.jsx";
import Description from "./components/components_lite/Description.jsx";
import Profile from "./components/components_lite/Profile.jsx";
import Companies from "./components/admincomponents/Companies.jsx";
import CompanyCreate from "./components/admincomponents/CompanyCreate.jsx";
import CompanySetup from "./components/admincomponents/CompanySetup.jsx";
import ResumeBuilderPage from "./components/components_lite/ResumeBuilderPage.jsx";
import AdminJobs from "./components/admincomponents/AdminJobs.jsx";
import PostJob from "./components/admincomponents/PostJob";
import Applicants from "./components/admincomponents/Applicants";
import ProtectedRoute from "./components/admincomponents/ProtectedRoute";
import AdminDashboard from "./components/admincomponents/AdminDashboard";
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
  //admin
  {
    path: "/admin/dashboard",
    element:
    <ProtectedRoute>
    {" "}
    <AdminDashboard />
  </ProtectedRoute>
  },
  {
    path: "/admin/companies",
    element: (
      <ProtectedRoute>
        {" "}
        <Companies />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/companies/create",
    element: (
      <ProtectedRoute>
        <CompanyCreate />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/companies/:id",
    element: (
      <ProtectedRoute>
        <CompanySetup />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs",
    element: (
      <ProtectedRoute>
        <AdminJobs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/create",
    element: (
      <ProtectedRoute>
        <PostJob />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: (
      <ProtectedRoute>
        <Applicants />
      </ProtectedRoute>
    ),
    // In your App.jsx, add this route:


  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={appRouter}></RouterProvider>
    </div>
  );
}

export default App;
