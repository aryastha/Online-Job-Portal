import React, { useState, useEffect, useMemo } from "react";
import Navbar from "./Navbar.jsx";
import FilterCard from "./FilterCard.jsx";
import Job1 from "./Job1.jsx";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { setSearchedQuery, resetFilters } from "@/redux/jobSlice";

const Jobs = () => {
  const { allJobs, filters } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  // Apply filters to jobs
  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      // Search text filter
if (filters.searchText) {
  const searchLower = filters.searchText.toLowerCase();
  const titleMatch = job.title?.toLowerCase().includes(searchLower);
  const descMatch = job.description?.toLowerCase().includes(searchLower);
  const companyMatch = job.company?.name.toLowerCase().includes(searchLower);
  const skillsMatch = (job.skills || [])
    .some(skill => skill.toLowerCase().includes(searchLower));

  if (!titleMatch && !descMatch && !companyMatch && !skillsMatch) {
    return false;
  }
}


      // Location filter
      if ((filters.locations || []).length > 0) {
        if (!filters.locations.includes(job?.location)) {
          return false;
        }
      }

      // Experience filter
      if (
        job.experienceLevel < (filters.experience?.[0] ?? 0) ||
        job.experienceLevel > (filters.experience?.[1] ?? 10)
      ) {
        return false;
      }
      // Salary filter
      if (
        job.salary < (filters.salary?.[0] ?? 0) ||
        job.salary > (filters.salary?.[1] ?? 200000)
      ) {
        return false;
      }

      // Job type filter
      if ((filters.jobTypes || []).length > 0) {
        if (!filters.jobTypes.includes(job.jobType)) {
          return false;
        }
      }

      // Technologies filter
    if ((filters.technologies || []).length > 0) {
      const textFields = `${job.title} ${job.description} ${(job.requirements || []).join(" ")}`.toLowerCase();
      const matchedTech = filters.technologies.some(tech => {
        const techLower = tech.toLowerCase();
        return textFields.includes(techLower);
      });
      if (!matchedTech) {
        return false;
      }
    }

      // Posted within filter
      if (filters.postedWithin) {
        const postedDate = new Date(job.createdAt);
        const daysAgo = (Date.now() - postedDate) / (1000 * 60 * 60 * 24);
        if (daysAgo > filters.postedWithin) {
          return false;
        }
      }

      // Positions filter
      if ((filters.positions || []).length > 0) {
        const textFields = `${job.title} ${job.description} ${(job.requirements || []).join(" ")}`.toLowerCase();
        const matchedPosition = filters.positions.some(position => {
          const positionLower = position.toLowerCase();
          return textFields.includes(positionLower);
        });
        if (!matchedPosition) {
          return false;
        }
      }

      return true;
    });
  }, [allJobs, filters]);

  const hasActiveFilters = Object.values(filters).some((filter) => {
    if (Array.isArray(filter)) {
      return filter.length > 0;
    } else if (typeof filter === "object" && filter !== null) {
      // Handle range filters
      return (
        filter[0] !== 0 ||
        filter[1] !== (filter === filters.experienceRange ? 10 : 200000)
      );
    }
    return !!filter;
  });

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
                onClick={() => dispatch(resetFilters())}
                className="px-4 py-2 bg-[#2C3E50] text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>

          {filteredJobs.length <= 0 ? (
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
                  onClick={() => dispatch(resetFilters())}
                  className="px-4 py-2 bg-[#2C3E50] text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="h-[calc(100vh-7.5rem)] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <motion.div
                    key={job._id}
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
