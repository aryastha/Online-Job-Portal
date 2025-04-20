import React from "react";
import { useSelector } from "react-redux";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { JOB_API_ENDPOINT } from "@/utils/data";
const SavedJobs = () => {
  const { user } = useSelector((state) => state.auth);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const response = await axios.get(`${JOB_API_ENDPOINT}/saved/jobs`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setSavedJobs(response.data.savedJobs);

        // Transform the response to include isSaved flag for each job
        const jobsWithSavedStatus = response.data.savedJobs.map(job => ({
          ...job,
          isSaved: true // All jobs here are saved by definition
        }));
        
        setSavedJobs(jobsWithSavedStatus);

      } catch (err) {
        console.error("Error fetching saved jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSavedJobs();
    }else{
      setSavedJobs([]);
    }
  }, [user]);


 



  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-[#2C3E50] flex items-center gap-2">
        <Bookmark size={28} className="text-[#E67E22]" /> Saved Jobs
      </h1>

      {savedJobs.length === 0 ? (
        <p className="text-gray-600">
          You haven't saved any jobs yet. Go to{" "}
          <Link to="/jobs" className="text-[#E67E22] underline">
            Browse Jobs
          </Link>{" "}
          and save ones you're interested in.
        </p>
      ) : (
        <div className="space-y-6">
          {savedJobs.map((job) => (
            <div
              key={job._id}
              className="border p-5 rounded-lg shadow-sm bg-white flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold text-[#2C3E50]">
                  {job.title}
                </h2>
                <p className="text-gray-600">{job.company?.name}</p>
              </div>
              <Link to={`/description/${job._id}`}>
                <Button className="bg-[#E67E22] hover:bg-[#cf6715] text-white">
                  View Job
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
