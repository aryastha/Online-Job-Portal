import React from "react";
import Navbar from "./Navbar.jsx";
import FilterCard from "./FilterCard.jsx";
import Job1 from "./Job1.jsx";

const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const Jobs = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5">
        <div className='flex gap-5'>
          {/* FilterCard */}
          <div className="w-1/5">
            <FilterCard />
          </div>
          {/* Job*/}
          {jobsArray.length <= 0 ?(
            <span className=''> Job not found</span>
          ): (
            <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
            <div className="grid grid-cols-3 gap-4">
              {jobsArray.map((job, index) => (
                <div key={index}>
                  <Job1></Job1>
                </div>
              ))}
            </div>
          </div>
          )

        }
          
        </div>
      </div>
    </div>
  );
};

export default Jobs;
