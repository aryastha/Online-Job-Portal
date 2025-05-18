import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { JOB_API_ENDPOINT } from '@/utils/data';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2, Eye } from 'lucide-react';

const AdminJob = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${JOB_API_ENDPOINT}/all`, {
        withCredentials: true,
      });
      
      if (response.data.success) {
        console.log('Jobs fetched:', response.data.jobs);
        setJobs(response.data.jobs);
      } else {
        console.error('Failed to fetch jobs:', response.data);
        setError('Failed to fetch jobs');
        toast.error('Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Error fetching jobs');
      toast.error('Error fetching jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (job) => {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;

    try {
      const response = await axios.delete(
        `${JOB_API_ENDPOINT}/delete/${jobToDelete._id}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Job deleted successfully');
        setJobs(jobs.filter(job => job._id !== jobToDelete._id));
      } else {
        toast.error(response.data.message || 'Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Error deleting job');
    } finally {
      setDeleteDialogOpen(false);
      setJobToDelete(null);
    }
  };

  const handleViewJob = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  const normalizeJobType = (type) => {
    if (!type) return '';
    // Convert to lowercase and remove special characters
    return type.toLowerCase().replace(/[-\s]/g, '');
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Normalize both the job type and the filter value for comparison
    const normalizedJobType = normalizeJobType(job.jobType);
    const normalizedFilterType = normalizeJobType(jobTypeFilter);
    
    const matchesType = jobTypeFilter === 'all' || normalizedJobType === normalizedFilterType;
    
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Jobs</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="fulltime">Full Time</SelectItem>
            <SelectItem value="parttime">Part Time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Jobs Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Posted By</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No jobs found
                </TableCell>
              </TableRow>
            ) : (
              filteredJobs.map((job) => (
                <TableRow key={job._id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.company?.name || 'N/A'}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {job.jobType}
                    </Badge>
                  </TableCell>
                  <TableCell>{job.experienceLevel}</TableCell>
                  <TableCell>${job.salary.toLocaleString()}</TableCell>
                  <TableCell>{job.userId?.fullname || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewJob(job._id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(job)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job
              "{jobToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminJob; 