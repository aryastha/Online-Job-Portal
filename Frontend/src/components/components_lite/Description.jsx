import React, { useState, useEffect } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Users,
  ArrowLeft,
  Clock,
  Award,
  FileText,
} from "lucide-react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_ENDPOINT, JOB_API_ENDPOINT } from "@/utils/data";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const Description = (job) => {
  const params = useParams();
  const jobId = params.id;

  const { user } = useSelector((store) => store.auth);
  const { singleJob } = useSelector((store) => store.job);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isInitiallyApplied =
    singleJob?.application?.some(
      (application) => application.applicant === user?._id
    ) || false;

  const [isApplied, setisApplied] = useState(isInitiallyApplied);

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_ENDPOINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setisApplied(true);
        const updateSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        

        console.log(res.data);
        toast.success(res.data.message);
        dispatch(setSingleJob(updateSingleJob));
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      setLoading(true);
      setError(null);
      try {
        
        const res = await axios.get(`${JOB_API_ENDPOINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.status) {
          dispatch(setSingleJob(res.data.job));
          setisApplied(res.data.job.applications.some(application => application.applicant === user?._id));
        } else {
          setError("Failed to fetch the jobs");
        }
      } catch (error) {
        console.error("Fetch error: ", error);
        setError(error.message || "An error occurred while fetching");
      } finally {
        setLoading(false);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  if (loading)
    return (
      <div className="max-w-7xl mx-auto p-8 text-center">
        Loading job details...
      </div>
    );
  if (error)
    return (
      <div className="max-w-7xl mx-auto p-8 text-red-500">Error: {error}</div>
    );
  if (!singleJob)
    return <div className="max-w-7xl mx-auto p-8">No job data found.</div>;

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-xl shadow-lg">
      {/* Back Button */}
      <Link
        to="/jobs"
        className="inline-flex items-center text-[#E67E22] hover:text-[#d9731a] transition mb-6 font-medium"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to all jobs
      </Link>

      {/* Job Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {singleJob?.title}
            </h1>
            <p className="text-lg text-gray-600 mb-4">Open Positions: {singleJob?.position}</p>
          </div>
          <div className="bg-[#E67E22]/10 px-4 py-2 rounded-lg">
            <span className="text-[#E67E22] font-semibold">
              {singleJob.jobType}
            </span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-3 mt-4">
          <Badge className="bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg">
            <MapPin size={16} className="text-[#E67E22]" />
            {singleJob.location}
          </Badge>
          <Badge className="bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg">
            {/* <DollarSign size={16}  */}
            Rs: {singleJob?.salary}
          </Badge>
          <Badge className="bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg">
            <Clock size={16} className="text-[#E67E22]" />
            Posted: {new Date(singleJob.updatedAt).toLocaleDateString()}
          </Badge>
        </div>
      </div>

      {/* Apply Button */}
      <div className="mb-8">
        <Button
          onClick={isApplied ? null : applyJobHandler}
          className={`rounded-xl px-8 py-3 text-lg font-semibold transition-all duration-300 shadow-md ${
            isApplied
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#E67E22] hover:bg-[#d9731a] text-white hover:shadow-lg"
          }`}
          disabled={isApplied}
        >
          {isApplied ? "Application Submitted" : "Apply Now"}
        </Button>
      </div>

      {/* Job Content */}
      <div className="space-y-8">
        {/* Description */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4">
            <FileText size={20} className="text-[#E67E22]" />
            Job Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {singleJob.description}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job Details */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4">
              <Briefcase size={20} className="text-[#E67E22]" />
              Job Details
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">Role</h3>
                <p className="text-gray-700">{singleJob?.title}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Experience Level
                </h3>
                <p className="text-gray-700">{singleJob?.experienceLevel} {singleJob?.experienceLevel?.length !== 1 ? "years" : "year"}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Salary</h3>
                <p className="text-gray-700">Rs: {singleJob?.salary}</p>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4">
              <Award size={20} className="text-[#E67E22]" />
              Requirements
            </h2>
            <ul className="text-gray-700 space-y-2 pl-5 list-disc">
              {singleJob?.requirements?.map((requirement, index) => (
                <li key={index} className="leading-relaxed">
                  {requirement.trim()}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Applicants Info */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Applications</h2>
              <p className="text-gray-600">
                {singleJob?.applications?.length} applicant
                {singleJob?.applications?.length !== 1 ? "s" : ""} have applied
              </p>
            </div>
            <Button
              variant="outline"
              className="border-[#E67E22] text-[#E67E22] hover:bg-[#E67E22]/10"
            >
              View Applicants
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Description;
