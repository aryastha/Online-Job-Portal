// import React from 'react'
// import JobCards from './JobCards'
// const randomJobs = [1,2,3,4,5,6,7,8,9,10,11,12,13,14]

// const LatestJobs = () => {
//   return (
//     <div className="max-w-7xl mx-auto my-7">
//       <h2>
//       <div className="text-3xl font-bold text-[#2C3E50]">
//         Recommended Latest Jobs
//       </div>
//       </h2>
//       {/* Job cards */}
//       <div className="grid grid-cols-3 gap-7 my-6">
//       {randomJobs.slice(0,6).map((job, index)=>(
//          <JobCards key={index}/>
//       ))}
//       </div>
      


//     </div>
//   )
// }

// export default LatestJobs

import React from 'react';
import JobCards from './JobCards';

const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

const LatestJobs = () => {
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
        {randomJobs.slice(0, 6).map((job, index) => (
          <JobCards key={index} />
        ))}
      </div>
    </div>
  );
};

export default LatestJobs;