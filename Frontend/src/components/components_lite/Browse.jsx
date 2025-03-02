import React from "react";
import Navbar from "./Navbar";
import Job1 from "./Job1.jsx";

const searchJobs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const Browse = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10">
        <h1 className="font-bold text-xl my-10"> Search Results {searchJobs.length} </h1>
        <div className='grid grid-cols-3 gap-5'>
          {searchJobs.map((job, index) => (
            <div key={index}>
              <div>
                <Job1/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Browse;
