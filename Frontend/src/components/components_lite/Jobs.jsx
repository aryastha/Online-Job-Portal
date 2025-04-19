import React, { useState, useEffect } from "react";
import Navbar from "./Navbar.jsx";
import FilterCard from "./FilterCard.jsx";
import Job1 from "./Job1.jsx";
import { useSelector, useDispatch } from "react-redux";
import { motion } from 'framer-motion';
import { setSearchedQuery, clearFilters } from "@/redux/jobSlice";

const Jobs = () => {
  const { allJobs, searchedQuery, filters } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);
  const dispatch = useDispatch();

  // Debugging - log filters and filtered jobs
  useEffect(() => {
    console.log("Current filters:", filters);
    console.log("Filtered jobs count:", filterJobs.length);
  }, [filters, filterJobs]);
  // Map experience level numbers to human-readable format
  const experienceLevelMap = {
    0: "Intern",
    1: "Entry Level",
    2: "Mid Level",
    3: "Senior Level",
    4: "Executive"
  };

  useEffect(() => {
    if (!allJobs.length) return;

    const filteredJobs = allJobs.filter(job => {
      // Text search (unchanged)
      const matchesSearch = !searchedQuery || 
        [job.title, job.description, job.position, job.location].some(
          field => field?.toLowerCase().includes(searchedQuery.toLowerCase())
        );
      
      // Filter criteria with proper type checking
      const matchesFilters = Object.entries(filters).every(([filterType, selectedValue]) => {
        // Skip if no filter value is selected
        if (!selectedValue) return true;
        
        // Convert selectedValue to array if it isn't already
        const selectedValues = Array.isArray(selectedValue) 
          ? selectedValue 
          : [selectedValue];
        
        switch(filterType) {
          case 'location':
            return selectedValues.some(value => 
              (job.location || '').toLowerCase().includes(value.toLowerCase())
            );
            
          case 'technology':
            const techFieldsToCheck = [
              ...(job.requirements || []),
              job.position
            ].filter(Boolean);
            
            return selectedValues.some(value => {
              const val = value.toLowerCase();
              return techFieldsToCheck.some(tech => 
                tech.toLowerCase().includes(val)
              );
            });
            
          case 'experience':
            const experienceText = experienceLevelMap[job.experienceLevel]?.toLowerCase() || '';
            return selectedValues.some(value => 
              experienceText.includes(value.toLowerCase())
            );
            
          case 'salary':
            return selectedValues.some(value => checkSalaryRange(job.salary, value));
            
          default:
            return true;
        }
      });
    
      return matchesSearch && matchesFilters;
    });

    setFilterJobs(filteredJobs);
  }, [allJobs, searchedQuery, filters]);

  const checkSalaryRange = (jobSalary, filterRange) => {
    if (!jobSalary) return false;
    
    const jobSalaryNum = parseInt(jobSalary.replace(/[^0-9]/g, ''));
    const [min, max] = filterRange.split(/-|\+/).map(s => {
      const num = parseInt(s.replace(/[^0-9]/g, ''));
      return isNaN(num) ? (s.includes('+') ? Infinity : 0) : num;
    });

    if (filterRange.includes('+')) {
      return jobSalaryNum >= min;
    }
    return jobSalaryNum >= min && (max ? jobSalaryNum <= max : true);
  };

  const hasActiveFilters = searchedQuery || Object.values(filters).some(Boolean);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex flex-1 max-w-7xl w-full mx-auto px-4 py-6 gap-6">
        {/* Filter section */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-6 h-[calc(100vh-7.5rem)] overflow-y-auto">
            <FilterCard />
          </div>
        </div>

        {/* Jobs list section */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Available Jobs</h2>
            {hasActiveFilters && (
              <button 
                onClick={() => {
                  dispatch(setSearchedQuery(""));
                  dispatch(clearFilters());
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>

          {filterJobs.length <= 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-16 w-16 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <span className="text-gray-600 text-lg text-center">
                {hasActiveFilters 
                  ? "No jobs match your current filters" 
                  : "No jobs available at the moment"}
              </span>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    dispatch(setSearchedQuery(""));
                    dispatch(clearFilters());
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="h-[calc(100vh-7.5rem)] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filterJobs.map((job) => (
                  <motion.div
                    key={job._id}  // Changed from job.id to job._id for MongoDB
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <Job1 job={job} />
                  </motion.div>
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
// import React, { useState, useEffect } from "react";
// import Navbar from "./Navbar.jsx";
// import FilterCard from "./FilterCard.jsx";
// import Job1 from "./Job1.jsx";
// import { useSelector } from "react-redux";
// import { motion } from "framer-motion";

// const Jobs = () => {
//   const { allJobs, searchedQuery } = useSelector((store) => store.job);
//   const [filterJobs, setFilterJobs] = useState(allJobs);

//   // useEffect(() => {
//   //   if (!searchedQuery || Object.keys(searchedQuery).length === 0) {
//   //     setFilterJobs(allJobs);
//   //     return;
//   //   }

  

//   //   // Normalize filter keys
//   //   const filterKeys = {
//   //     Location: "location",
//   //     Technology: "technology",
//   //     Experience: "experience",
//   //     Salary: "salary",
//   //   };

//   //   const filtered = allJobs.filter((job) => {
//   //     return Object.entries(searchedQuery).some(([filterKey, value]) => {
//   //       const jobKey = filterKeys[filterKey]; // mapped to lowercase keys in job
//   //       const jobValue = (job[jobKey] || "").toString().toLowerCase();
//   //       return jobValue.includes(value.toLowerCase());
//   //     });
//   //   });

//   //   setFilterJobs(filtered);
//   // }, [allJobs, searchedQuery]);

//   // Add this to your existing Jobs component
// useEffect(() => {
//   if (!filters || Object.keys(filters).length === 0) {
//     setFilterJobs(allJobs);
//     return;
//   }

//   const filteredJobs = allJobs.filter((job) => {
//     return Object.entries(filters).every(([key, value]) => {
//       if (!value) return true; // Skip if filter value is empty
      
//       const jobValue = job[key]?.toString().toLowerCase();
//       const filterValue = value.toString().toLowerCase();
      
//       // Special handling for salary ranges
//       if (key === 'salary') {
//         return checkSalaryRange(job.salary, filterValue);
//       }
      
//       return jobValue?.includes(filterValue);
//     });
//   });

//   setFilterJobs(filteredJobs);
// }, [allJobs, filters]);

// // Helper function for salary range comparison
// const checkSalaryRange = (jobSalary, filterRange) => {
//   if (!jobSalary) return false;
  
//   const jobSalaryNum = parseInt(jobSalary.replace(/[^0-9]/g, ''));
//   const [min, max] = filterRange.split('-').map(s => {
//     const num = parseInt(s.replace(/[^0-9]/g, ''));
//     return isNaN(num) ? (s.includes('+') ? Infinity : 0) : num;
//   });

//   if (filterRange.includes('+')) {
//     return jobSalaryNum >= min;
//   }
//   return jobSalaryNum >= min && jobSalaryNum <= max;
// };

//   return (
//     <div className="h-screen flex flex-col bg-gray-50">
//       <Navbar />
//       <div className="flex flex-1 max-w-7xl w-full mx-auto px-4 py-6 gap-6">
//         {/* Filter Section */}
//         <div className="hidden md:block w-64 flex-shrink-0">
//           <div className="sticky top-6 h-[calc(100vh-7.5rem)] overflow-y-auto">
//             <FilterCard />
//           </div>
//         </div>

//         {/* Jobs List Section */}
//         <div className="flex-1">
//           {filterJobs.length === 0 ? (
//             <div className="flex items-center justify-center h-full">
//               <span className="text-gray-600 text-lg">No jobs found matching your criteria</span>
//             </div>
//           ) : (
//             <div className="h-[calc(100vh-7.5rem)] overflow-y-auto pr-2">
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//                 {filterJobs.map((job) => (
//                   <motion.div
//                     key={job._id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                     transition={{ duration: 0.3 }}
//                     className="h-full"
//                   >
//                     <Job1 job={job} />
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Jobs;

