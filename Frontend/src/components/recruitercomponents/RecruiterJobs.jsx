


import React, { useEffect, useState } from 'react';
import Navbar from '../components_lite/Navbar';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import RecruiterJobsTable from './RecruiterJobsTable'; 
import { useNavigate } from 'react-router-dom';
import useGetAllComapnies from '@/hooks/useGetAllComapnies';
import { useDispatch } from 'react-redux';
import useGetAllRecruiterJobs from '@/hooks/useGetAllRecruiterJobs';
import { setSearchJobByText } from '@/redux/jobSlice';

const RecruiterJobs = () => {

    useGetAllRecruiterJobs();
    const navigate = useNavigate();

    useGetAllComapnies();

    const [input,setInput] =useState();
    const dispatch= useDispatch();


    useEffect(()=>{
      dispatch(setSearchJobByText(input));
    },[input])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
            <p className="mt-1 text-sm text-gray-500">
              Add New Posts
            </p>
          </div>
          <Button className="mt-4 md:mt-0 bg-[#E67E22]"
          onClick= {()=>navigate("/recruiter/jobs/create")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        </div>

        {/* Search and Filter Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="w-full sm:w-96">
              <Input 
                placeholder="Search jobs & name..." 
                className="w-full"
                onChange={(e)=>setInput(e.target.value)}
              />
            </div>
            {/* <div className="flex gap-2">
              <Button variant="outline">Filter</Button>
              <Button variant="outline">Export</Button>
            </div> */}
          </div>
        {/* </div> */}

        {/* Company Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <RecruiterJobsTable />
        </div>
      </div>
    </div>
  );
};


export default RecruiterJobs
