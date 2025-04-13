import React, { useState } from "react";
import Navbar from "./Navbar.jsx";
import FilterCard from "./FilterCard.jsx";
import Job1 from "./Job1.jsx";
import { useSelector } from "react-redux";
import {motion} from 'framer-motion';
import { useEffect } from "react";

const Jobs = () => {

  const { allJobs , searchedQuery} = useSelector((store) => store.job); 
  const [filterJobs, setFilterJobs] = useState (allJobs);


  useEffect(()=>{
    if (!searchedQuery || searchedQuery === ""){
      setFilterJobs(allJobs);
      return;
    }

    const filteredJobs = allJobs.filter((job) =>{
      const query = searchedQuery.toLowerCase();
      return(
        job.title?.toLowerCase().includes(query) ||
        job.description?.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query) ||
        job.experience?.toLowerCase().includes(query) ||
        job.salary?.toLowerCase().includes(query)
      );
    });

    setFilterJobs(filteredJobs);

  },[allJobs, searchedQuery])
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
          {filterJobs.length <= 0 ? (
            <span className="text-gray-600">No jobs found</span>
          ) : (
            <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> {/* Responsive grid */}
                {filterJobs.map((job) => (
                  <motion.div 
                  key={job.id}
                  initial={{opacity: 0, x:100}}
                  animate={{opacity: 1, x: 0}}
                  exit= {{opacity: 0, x:-100}}
                  transition= {{duration: 0.4}}
                  >
                    <Job1  job={job}/>
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
