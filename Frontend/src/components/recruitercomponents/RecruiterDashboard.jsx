import React, { useState, useEffect } from 'react';
import Navbar from '../components_lite/Navbar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Briefcase,
  Building2,
  Calendar,
  FileText,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import axios from 'axios';
import { USER_API_ENDPOINT, JOB_API_ENDPOINT, RECRUITER_API_ENDPOINT } from '@/utils/data';
import { toast } from 'sonner';

const RecruiterDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    activeJobs: 0,
    upcomingInterviews: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      const statsResponse = await axios.get(`${RECRUITER_API_ENDPOINT}/stats`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (statsResponse.data.status === 'success') {
        setStats(statsResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to fetch dashboard statistics');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#2C3E50]">
                Welcome back, {user?.fullname}!
              </h1>
              <p className="text-gray-600 mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <Badge className="mt-3 md:mt-0 bg-[#E67E22] hover:bg-[#E67E22]/90 text-white">
              <Briefcase className="h-4 w-4 mr-2" />
              Recruiter Dashboard
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card className="border-[#2C3E50]/30 hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Jobs Posted
              </CardTitle>
              <div className="p-1.5 rounded-lg bg-[#2C3E50]/10 text-[#2C3E50]">
                <Briefcase className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#2C3E50]">
                {stats.totalJobs}
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E67E22]/30 hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Applications
              </CardTitle>
              <div className="p-1.5 rounded-lg bg-[#E67E22]/10 text-[#E67E22]">
                <Users className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#E67E22]">
                {stats.totalApplications}
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#2C3E50]/30 hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Applications
              </CardTitle>
              <div className="p-1.5 rounded-lg bg-[#2C3E50]/10 text-[#2C3E50]">
                <FileText className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#2C3E50]">
                {stats.pendingApplications}
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E67E22]/30 hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Jobs
              </CardTitle>
              <div className="p-1.5 rounded-lg bg-[#E67E22]/10 text-[#E67E22]">
                <Building2 className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#E67E22]">
                {stats.activeJobs}
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#2C3E50]/30 hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Upcoming Interviews
              </CardTitle>
              <div className="p-1.5 rounded-lg bg-[#2C3E50]/10 text-[#2C3E50]">
                <Calendar className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#2C3E50]">
                {stats.upcomingInterviews}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className="hover:shadow-md transition-all cursor-pointer"
            onClick={() => navigate('/recruiter/jobs')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#2C3E50]/5">
                  <Briefcase className="h-5 w-5 text-[#2C3E50]" />
                </div>
                <div>
                  <CardTitle className="text-[#2C3E50]">Manage Jobs</CardTitle>
                  <p className="text-sm text-gray-500">View and manage job postings</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card 
            className="hover:shadow-md transition-all cursor-pointer"
            onClick={() => navigate('/recruiter/applicants')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#E67E22]/5">
                  <Users className="h-5 w-5 text-[#E67E22]" />
                </div>
                <div>
                  <CardTitle className="text-[#E67E22]">View Applicants</CardTitle>
                  <p className="text-sm text-gray-500">Manage job applications</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;