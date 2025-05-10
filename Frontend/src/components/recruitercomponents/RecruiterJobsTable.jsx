import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Edit2,
  MoreHorizontal,
  Globe,
  MapPin,
  Calendar,
  Briefcase,
  Eye,
  Trash2,
} from "lucide-react"; // Added Trash2 icon
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { setSearchJobByText } from "@/redux/jobSlice";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const RecruiterJobsTable = () => {
  const { companies, searchCompanyByText } = useSelector(
    (store) => store.company
  );
  const { allRecruiterJobs } = useSelector((store) => store.job);
  const { searchJobByText } = useSelector((store) => store.job || "");
  const navigate = useNavigate();
  const [filterJobs, setFilterJobs] = useState(allRecruiterJobs);

  useEffect(() => {
    const filteredJobs =
      allRecruiterJobs.length >= 0 &&
      allRecruiterJobs.filter((job) => {
        if (!searchJobByText) {
          return true;
        }
        return (
          job.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
          job?.company?.name
            ?.toLowerCase()
            .includes(searchJobByText.toLowerCase())
        );
      });
    setFilterJobs(filteredJobs);
  }, [allRecruiterJobs, searchJobByText]);

  // Delete job function (replace with your API call)
  const handleDeleteJob = async (jobId) => {
    try {
      // Add your delete API call here
      // await deleteJobAPI(jobId); 
      // Then update local state or refetch jobs
      setFilterJobs(filterJobs.filter(job => job._id !== jobId));
      console.log("Job deleted:", jobId);
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  if (!companies) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Table>
        <TableCaption>Your recent posted Jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filterJobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No Jobs Added
              </TableCell>
            </TableRow>
          ) : (
            filterJobs?.map((job) => (
              <TableRow key={job._id}> {/* Changed from job.id to job._id */}
                <TableCell>{job?.company?.name}</TableCell>
                <TableCell>{job?.title}</TableCell>
                <TableCell>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    {new Date(job.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </TableCell>
                <TableCell className="text-right cursor-pointer">
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal />
                    </PopoverTrigger>
                    <PopoverContent className="w-40"> {/* Increased width */}
                      <div className="space-y-2">
                        <div
                          onClick={() => navigate(`/recruiter/companies/${job._id}`)}
                          className="flex items-center gap-3 w-fit cursor-pointer hover:bg-gray-100 p-1 rounded"
                        >
                          <Edit2 className="w-4" />
                          <span>Edit</span>
                        </div>
                        
                        <div
                          onClick={() => navigate(`/recruiter/jobs/${job._id}/applicants`)}
                          className="flex items-center gap-3 w-fit cursor-pointer hover:bg-gray-100 p-1 rounded"
                        >
                          <Eye className="w-4" />
                          <span>Applicants</span>
                        </div>
                        
                        <hr />
                        
                        <div
                          onClick={() => handleDeleteJob(job._id)}
                          className="flex items-center gap-3 w-fit cursor-pointer hover:bg-gray-100 p-1 rounded text-red-600"
                        >
                          <Trash2 className="w-4" />
                          <span>Delete</span>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecruiterJobsTable;