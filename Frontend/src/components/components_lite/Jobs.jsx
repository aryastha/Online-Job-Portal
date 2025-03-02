import React from "react";
import Navbar from "./Navbar.jsx";
import FilterCard from "./FilterCard.jsx";
import Job1 from "./Job1.jsx";

const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const Jobs = () => {
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
          {jobsArray.length <= 0 ? (
            <span className="text-gray-600">No jobs found</span>
          ) : (
            <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> {/* Responsive grid */}
                {jobsArray.map((job, index) => (
                  <div key={index}>
                    <Job1 />
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