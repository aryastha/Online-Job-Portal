import React from "react";
import Navbar from "./Navbar.jsx";
import FilterCard from "./FilterCard.jsx";
import Job1 from "./Job1.jsx";
import { useSelector } from "react-redux";

const Jobs = () => {

  const { allJobs } = useSelector((store) => store.job);  
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5 px-4"> {/* Added padding for better spacing on smaller screens */}
        <div className="flex gap-5">
          {/* FilterCard - Takes 20% of the width */}
          <div className="w-1/5">
            <FilterCard />
          </div>

          {/* Job List - Takes 80% of the width */}
          {allJobs.length <= 0 ? (
            <span className="text-gray-600">No jobs found</span>
          ) : (
            <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> {/* Responsive grid */}
                {allJobs.map((job) => (
                  <div key={job._id}>
                    <Job1  job={job}/>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
