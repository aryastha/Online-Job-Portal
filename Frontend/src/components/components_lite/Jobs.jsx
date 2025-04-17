import React, { useState } from "react";
import Navbar from "./Navbar.jsx";
import FilterCard from "./FilterCard.jsx";
import Job1 from "./Job1.jsx";
import { useSelector } from "react-redux";
import { motion } from 'framer-motion';
import { useEffect } from "react";

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);

  useEffect(() => {
    if (!searchedQuery || searchedQuery === "") {
      setFilterJobs(allJobs);
      return;
    }

    const filteredJobs = allJobs.filter((job) => {
      const query = searchedQuery.toLowerCase();
      return (
        job.title?.toLowerCase().includes(query) ||
        job.description?.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query) ||
        job.experience?.toLowerCase().includes(query) ||
        job.salary?.toLowerCase().includes(query)
      );
    });

    setFilterJobs(filteredJobs);
  }, [allJobs, searchedQuery]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Main content container */}
      <div className="flex flex-1 max-w-7xl w-full mx-auto px-4 py-6 gap-6">
        {/* Filter section - fixed width */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-6 h-[calc(100vh-7.5rem)] overflow-y-auto">
            <FilterCard />
          </div>
        </div>

        {/* Jobs list section */}
        <div className="flex-1">
          {filterJobs.length <= 0 ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-gray-600 text-lg">No jobs found matching your criteria</span>
            </div>
          ) : (
            <div className="h-[calc(100vh-7.5rem)] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filterJobs.map((job) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"  // Ensure consistent height
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