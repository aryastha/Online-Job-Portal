import React from 'react';
import JobCards from './JobCards';
import useGetAllJobs from '../hooks/useGetAllJobs';
import { useSelector } from 'react-redux';

// const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

const LatestJobs = () => {

  const allJobs = useSelector((state)=>state.job?.allJobs || []);
  console.log("All Jobs in LatestJobs:", allJobs);

  return (
    <div className="max-w-7xl mx-auto my-14 px-4 sm:px-6 lg:px-8">
      {/* Heading and Subtitle */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-[#2C3E50]">
          Recommended Latest Jobs
        </h2>
        <p className="mt-3 text-lg text-gray-600">
          Explore the latest job opportunities tailored just for you.
        </p>
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Handles the job data */}
        {allJobs.length === 0?(
          <span className="text-medium font-bold"> No Jobs Available</span>
        ):(
          allJobs
            .slice(0, 6)  //to select only the first 6 jobs
            .map((job) => 
              job?._id ?(
              <JobCards key={job?._id} job={job}> </JobCards>
            ):(
              <span key = {Math.random()}> Invalid Job Data</span>
            )
            )
        )}
        
      </div>
    </div>
  );
};

export default LatestJobs;