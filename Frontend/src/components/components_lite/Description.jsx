import React, { useState ,useEffect} from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Briefcase, MapPin, DollarSign, Users } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { JOB_API_ENDPOINT } from "@/utils/data";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
const Description = () => {
  const params = useParams() //hook that will be used for dynamic URL
  const jobId = params.id;
  console.log("Job Id from description", jobId);
  
  const {user} = useSelector((store)=>store.auth);
  const {singleJob} = useSelector((store )=>(store.job)); //get the job from the setore
  
  const dispatch= useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(()=>{
    const fetchSingleJOb = async()=>{
      try{
        setLoading(true);
        setError(null);
        const res= await axios.get(`${JOB_API_ENDPOINT}/get/${jobId}`,
          {withCredentials:true},
        );
        console.log("API Response:", res.data);
        if (res.data.status){
          dispatch(setSingleJob(res.data.job));
        }else{
          setError("Failed to fetch the jobs");
        }
      }catch(error){
        console.error("Fetched error: ", error);
        setError(error.message || "An error occurred while fetching");
      }finally{
        setLoading(false);
      }
    }
    fetchSingleJOb();
  }),[jobId, dispatch, user?._id]

  if (!singleJob) return <div>No job data found.</div>;

  const isApplied = true;
  return (
    <div className="max-w-7xl mx-auto my-4 p-6 bg-white shadow-md rounded-lg">
      {/* Job Title & Badges */}
      <div className="mb-6">
        <h2 className="font-semibold text-xl text-gray-900"> {singleJob?.title} </h2>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge className="bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center gap-1 px-3 py-1 text-sm border border-gray-200">
            <DollarSign size={14} /> {singleJob?.salary}
          </Badge>
          <Badge className="bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center gap-1 px-3 py-1 text-sm border border-gray-200">
            <Briefcase size={14} /> {singleJob?.position}
          </Badge>
          <Badge className="bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center gap-1 px-3 py-1 text-sm border border-gray-200">
            <Users size={14} /> {singleJob.jobType}
          </Badge>
          <Badge className="bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center gap-1 px-3 py-1 text-sm border border-gray-200">
            <MapPin size={14} /> {singleJob.location}
          </Badge>
        </div>
      </div>

      {/* Apply Button */}
      <div className="mb-6">
        <Button
          disabled={isApplied}
          className={`rounded-lg px-6 py-2 font-medium transition-all duration-300 ${
            isApplied
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#E67E22] hover:bg-[#dd9352] text-white"
          }`}
        >
          {isApplied ? "Already Applied" : "Apply"}
        </Button>
      </div>

      {/* Job Description Section */}
      <div className="border-b-2 pb-4 mb-4">
        <h1 className="font-semibold text-lg text-gray-800">{singleJob.description}</h1>
      </div>

      {/* Job Details */}
      <div className="space-y-2">
        <h1 className="font-bold text-gray-900">
          Role: <span className="text-gray-700 font-normal pl-2">{singleJob?.title} </span>
        </h1>
        <h1 className="font-bold text-gray-900">
          Location: <span className="text-gray-700 font-normal pl-2"> {singleJob?.location}</span>
        </h1>
        <h1 className="font-bold text-gray-900">
          Salary: <span className="text-gray-700 font-normal pl-2">Rs: {singleJob?.salary}</span>
        </h1>
        <h1 className="font-bold text-gray-900">
          Experience: <span className="text-gray-700 font-normal pl-2">{singleJob?.experienceLevel}</span>
        </h1>
        <h1 className="font-bold text-gray-900">
          Job Type: <span className="text-gray-700 font-normal pl-2">{singleJob?.jobType}</span>
        </h1>
        <h1 className="font-bold text-gray-900">
          Post Date: <span className="text-gray-700 font-normal pl-2">{singleJob.updatedAt.split("T")[0]}</span>
        </h1>
      </div>

      {/* About Company */}
      <div className="mt-4">
      <h1 className="font-bold text-gray-900">Requirements:</h1>
      <ul className="text-gray-700 font-normal pl-4 list-disc">
        {singleJob?.requirements?.map((requirement, index) => (
          <li key={index}>{requirement.trim()}</li> // Trim removes extra spaces
        ))}
      </ul>
    </div>
    

      {/* Total Applicants */}
      <div className="mt-4">
        <h1 className="font-bold text-gray-900">
          Total Applicants:
          <span className="text-gray-700 font-normal pl-2">{singleJob?.applications?.length}</span>
        </h1>
      </div>
    </div>
  );
};

export default Description;
