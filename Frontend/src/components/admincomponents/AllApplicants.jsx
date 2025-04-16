import React, { useEffect, useState } from 'react';
import Navbar from '../components_lite/Navbar';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { APPLICATION_API_ENDPOINT } from '@/utils/data';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';
import axios from 'axios';
import { MoreHorizontal } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Download, Loader2 } from 'lucide-react';

const shortListingStatus = ["Accepted", "Rejected"];

const AllApplicants = () => {
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchAllApplicants = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${APPLICATION_API_ENDPOINT}/all/applicants`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        dispatch(setAllApplicants({ applications: res.data.applications }));
      } catch (error) {
        console.error('Full error details:', {
          message: error.message,
          response: error.response?.data,
          config: error.config
        });
        toast.error(error.response?.data?.message || 'Failed to fetch applicants');
      } finally {
        setLoading(false);
      }
    };
    fetchAllApplicants();
  }, [dispatch]);

  const statusHandler = async (status, id) => {
    try {
      const res = await axios.post(
        `${APPLICATION_API_ENDPOINT}/status/${id}/update`,
        { status },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        // Refresh the applicants list after status change
        const updatedRes = await axios.get(`${APPLICATION_API_ENDPOINT}/all/applicants`, {
          withCredentials: true,
        });
        dispatch(setAllApplicants({ applications: updatedRes.data.applications }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  // Filter applicants based on search term and status
  const filteredApplicants = applicants?.applications?.filter((app) => {
    const matchesSearch = 
      app.applicant?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicant?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicant?.phoneNumber?.includes(searchTerm);
    
    const matchesStatus = 
      statusFilter === 'all' || 
      app.status?.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const downloadCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Status', 'Applied Date', 'Resume'];
    const csvContent = [
      headers.join(','),
      ...filteredApplicants.map(app => [
        `"${app.applicant?.fullname || ''}"`,
        `"${app.applicant?.email || ''}"`,
        `"${app.applicant?.phoneNumber || ''}"`,
        `"${app.status || ''}"`,
        `"${new Date(app.createdAt).toLocaleDateString() || ''}"`,
        `"${app.applicant?.profile?.resume || 'NA'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'applicants.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">
            All Applicants ({filteredApplicants?.length || 0})
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Button onClick={downloadCSV} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <select
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : filteredApplicants?.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Resume</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplicants.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">
                      {item.applicant?.fullname || 'N/A'}
                    </TableCell>
                    <TableCell>{item.applicant?.email || 'N/A'}</TableCell>
                    <TableCell>{item.applicant?.phoneNumber || 'N/A'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.status === 'accepted' 
                          ? 'bg-green-100 text-green-800' 
                          : item.status === 'rejected' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.status || 'new'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {item.applicant?.profile?.resume ? (
                        <a
                          href={item.applicant.profile.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Download className="h-4 w-4" /> Download
                        </a>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-40 p-2">
                          {shortListingStatus.map((status) => (
                            <Button
                              key={status}
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => statusHandler(status.toLowerCase(), item._id)}
                            >
                              {status}
                            </Button>
                          ))}
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'No matching applicants found' 
                : 'No applicants available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllApplicants;