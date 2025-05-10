import React, { useState } from "react";
import Navbar from "../components_lite/Navbar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllRecruiterJobs from "@/hooks/useGetAllRecruiterJobs";
import useGetAllCompanies from "@/hooks/useGetAllComapnies";
import usePendingApplications from "@/hooks/usePendingApplications";
import useScheduleInterview from "@/hooks/useScheduleInterview";
import useInterviewApplications from "@/hooks/useInterviewApplications";
import {
  Briefcase,
  Building,
  Users,
  FileText,
  Plus,
  ArrowRight,
  Calendar,
  Clock,
  PieChart,
  Activity,
  MessageSquare,
  Star,
} from "lucide-react";
import InterviewModal from "./InterviewModal";

const recruiterDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { companies } = useSelector((store) => store.company);
  const { allRecruiterJobs } = useSelector((store) => store.job);
  const { pendingApplications } = useSelector((store) => store.application);

  // Call the hooks
  useGetAllRecruiterJobs();
  useGetAllCompanies();
  usePendingApplications();

  // Calculate stats


  const totalJobs = allRecruiterJobs?.length || 0;
  const totalCompanies = companies?.length || 0;
  const totalApplications =
    allRecruiterJobs?.reduce(
      (acc, job) => acc + (job.applications?.length || 0),
      0
    ) || 0;
  const interviewCount =
  allRecruiterJobs?.reduce(
    (acc, job) =>
      acc +
      (job.applications?.filter(
        (app) => app.interview?.interviewStatus === "scheduled"
      )?.length || 0),
    0
  ) || 0;


  // Add these new state variables
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const { scheduleInterview } = useScheduleInterview();

  // Create this hook similar to your usePendingApplications
  const { interviews } = useSelector((store) => store.application);
  useInterviewApplications();

  // Replace your mock upcomingInterviews with real data
  const upcomingInterviews =
    interviews?.map((interview) => ({
      id: interview._id,
      candidate: interview.applicant?.fullname || "Unknown",
      job: interview.job?.title || "Unknown Position",
      time: new Date(interview.interview?.scheduledAt).toLocaleString(),
      location: interview.interview?.location || "Online",
      interviewer: interview.interview?.interviewer || "Not specified",
    })) || [];

  // Add this function to handle interview scheduling
  const handleScheduleInterview = async (interviewData) => {
    try {
      await scheduleInterview(selectedApplication._id, interviewData);
      // The hook will automatically update the Redux store
    } catch (error) {
      console.error("Error scheduling interview:", error);
    }
  };

  // Stats cards data (now 5 cards)
  const stats = [
    {
      title: "Total Jobs",
      value: totalJobs,
      icon: <Briefcase className="w-5 h-5" />,
      color: "bg-blue-100 text-blue-600",
      path: "/recruiter/jobs",
    },
    {
      title: "Total Companies",
      value: totalCompanies,
      icon: <Building className="w-5 h-5" />,
      color: "bg-purple-100 text-purple-600",
      path: "/recruiter/companies",
    },
    {
      title: "Total Applications",
      value: totalApplications,
      icon: <Users className="w-5 h-5" />,
      color: "bg-green-100 text-green-600",
      path: "/recruiter/applicants",
    },
    {
      title: "New Applications",
      value: pendingApplications?.length || 0,
      icon: <FileText className="w-5 h-5" />,
      color: "bg-orange-100 text-orange-600",
      path: "/recruiter/applications/pending",
    },
    {
      title: "Interviews",
      value: interviewCount,
      icon: <Calendar className="w-5 h-5" />,
      color: "bg-amber-100 text-amber-600",
      path: "/recruiter/applicants?Interviewstatus=scheduled",
    },
  ];

  // Mock data for sections
  // const upcomingInterviews = [
  //   { id: 1, candidate: "John Doe", job: "Frontend Developer", time: "Today, 2:00 PM" },
  //   { id: 2, candidate: "Jane Smith", job: "Product Manager", time: "Tomorrow, 10:00 AM" }
  // ];

  const performanceMetrics = [
    { name: "Avg. Time to Hire", value: "24 days", trend: "down 12%" },
    { name: "Offer Accept Rate", value: "78%", trend: "up 5%" },
    { name: "Candidate Satisfaction", value: "4.2/5", trend: "steady" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-4 md:p-6">
        {/* Welcome Banner */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                Welcome, {user?.fullname || "Recruiter"}
              </h1>
              <p className="text-gray-600 mt-1">
                Here's your recruitment dashboard overview
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid - Now 5 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(stat.path)}
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-full p-2 ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h3 className="text-xl font-bold">{stat.value}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Recent Jobs */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-semibold">
                  Recent Job Postings
                </h2>
                <button
                  onClick={() => navigate("/recruiter/jobs")}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                  View all <ArrowRight className="ml-1 w-4 h-4" />
                </button>
              </div>

              {allRecruiterJobs?.length > 0 ? (
                <div className="space-y-3">
                  {allRecruiterJobs.slice(0, 5).map((job) => (
                    <div
                      key={job._id}
                      className="border-b pb-3 last:border-b-0 hover:bg-gray-50 p-2 rounded cursor-pointer"
                      onClick={() =>
                        navigate(`/recruiter/jobs/${job._id}/applicants`)
                      }
                    >
                      <h3 className="font-medium text-sm md:text-base">
                        {job.title}
                      </h3>
                      <div className="flex justify-between text-xs md:text-sm text-gray-500 mt-1">
                        <span>
                          {job.position} • {job.jobType}
                        </span>
                        <span>{job.applications?.length || 0} applicants</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No jobs posted yet</p>
                  <button
                    onClick={() => navigate("/recruiter/jobs/create")}
                    className="mt-3 text-blue-600 hover:text-blue-800 text-sm flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Post a new job
                  </button>
                </div>
              )}
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-semibold flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-indigo-600" />
                  Performance Metrics
                </h2>
              </div>
              <div className="space-y-4">
                {performanceMetrics.map((metric, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{metric.name}</span>
                      <span className="font-medium">{metric.value}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          metric.trend.includes("up")
                            ? "bg-green-500"
                            : metric.trend.includes("down")
                            ? "bg-red-500"
                            : "bg-blue-500"
                        }`}
                        style={{ width: `${Math.random() * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-xs mt-1 text-gray-500">
                      {metric.trend}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            {/* Companies List */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-semibold">
                  Your Companies
                </h2>
                <button
                  onClick={() => navigate("/recruiter/companies")}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                  View all <ArrowRight className="ml-1 w-4 h-4" />
                </button>
              </div>

              {companies?.length > 0 ? (
                <div className="space-y-3">
                  {companies.slice(0, 5).map((company) => (
                    <div
                      key={company._id}
                      className="border-b pb-3 last:border-b-0 hover:bg-gray-50 p-2 rounded cursor-pointer"
                      onClick={() =>
                        navigate(`/recruiter/companies/${company._id}`)
                      }
                    >
                      <h3 className="font-medium text-sm md:text-base">
                        {company.name}
                      </h3>
                      <div className="flex justify-between text-xs md:text-sm text-gray-500 mt-1">
                        <span>{company.industry}</span>
                        <span>{company.jobs?.length || 0} jobs</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No companies added yet</p>
                  <button
                    onClick={() => navigate("/recruiter/companies/create")}
                    className="mt-3 text-blue-600 hover:text-blue-800 text-sm flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add a company
                  </button>
                </div>
              )}
            </div>

            {/* Upcoming Interviews */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-semibold flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-amber-600" />
                  Upcoming Interviews
                </h2>
                <button
                  onClick={() => navigate("/recruiter/calendar")}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                  View all <ArrowRight className="ml-1 w-4 h-4" />
                </button>
              </div>
              <div className="flex space-x-2 mt-2">
                <button
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                  onClick={() =>
                    navigate(`/recruiter/applications/${interview.id}`)
                  }
                >
                  View Details
                </button>
                <button
                  className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded hover:bg-gray-200"
                  onClick={() => {
                    setSelectedApplication(interview);
                    setIsInterviewModalOpen(true);
                  }}
                >
                  Reschedule
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-600" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => navigate("/recruiter/jobs/create")}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base"
                >
                  <span className="flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                    Post New Job
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => navigate("/recruiter/companies/create")}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base"
                >
                  <span className="flex items-center">
                    <Building className="w-5 h-5 mr-2 text-purple-600" />
                    Add Company
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => navigate("/recruiter/candidates")}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base"
                >
                  <span className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-green-600" />
                    View Candidates
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => navigate("/recruiter/reports")}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base"
                >
                  <span className="flex items-center">
                    <PieChart className="w-5 h-5 mr-2 text-indigo-600" />
                    Generate Reports
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-semibold flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-gray-600" />
                  Recent Activity
                </h2>
              </div>
              <div className="space-y-3">
                {[
                  "You posted a new Frontend Developer position",
                  "3 new applications received for Product Manager",
                  "Interview scheduled with John Doe for tomorrow",
                  "Company 'Tech Innovations' was added",
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start pb-3 border-b last:border-b-0"
                  >
                    <div className="bg-gray-100 p-1 rounded-full mr-3">
                      <div className="bg-blue-500 w-2 h-2 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm">{activity}</p>
                      <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
      <InterviewModal
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        application={selectedApplication}
        onSchedule={handleScheduleInterview}
      />
    </div>
  );
};

export default recruiterDashboard;
