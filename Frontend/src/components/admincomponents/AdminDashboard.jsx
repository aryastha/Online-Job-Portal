import React, { useState, useEffect } from 'react';
import Navbar from '../components_lite/Navbar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Briefcase,
  UserPlus,
  UserMinus,
  Settings,
  BarChart2,
  Shield,
  Building2,
  Activity,
  Lock,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import axios from 'axios';
import { USER_API_ENDPOINT, COMPANY_API_ENDPOINT, JOB_API_ENDPOINT } from '@/utils/data';
import { toast } from 'sonner';
import ActivityLog from './ActivityLog';
import DashboardAnalytics from './DashboardAnalytics';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecruiters: 0,
    totalEmployees: 0,
    totalCompanies: 0,
    totalJobs: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      const usersResponse = await axios.get(`${USER_API_ENDPOINT}/all-users`, {
        withCredentials: true,
      });
      if (usersResponse.data.success) {
        const users = usersResponse.data.users;
        setStats(prev => ({
          ...prev,
          totalUsers: users.length,
          totalRecruiters: users.filter(u => u.role === 'Recruiter').length,
          totalEmployees: users.filter(u => u.role === 'Employee').length,
        }));
      }

      const companiesResponse = await axios.get(`${COMPANY_API_ENDPOINT}/all`, {
        withCredentials: true,
      });
      if (companiesResponse.data.success) {
        setStats(prev => ({
          ...prev,
          totalCompanies: companiesResponse.data.companies.length,
        }));
      }

      const jobsResponse = await axios.get(`${JOB_API_ENDPOINT}/all`, {
        withCredentials: true,
      });
      if (jobsResponse.data.success) {
        setStats(prev => ({
          ...prev,
          totalJobs: jobsResponse.data.jobs.length,
        }));
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
              <Shield className="h-4 w-4 mr-2" />
              Admin Dashboard
            </Badge>
          </div>
        </div>

        {/* Stats Cards - Now at the top */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card className="border-[#2C3E50]/30 hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Users
              </CardTitle>
              <div className="p-1.5 rounded-lg bg-[#2C3E50]/10 text-[#2C3E50]">
                <Users className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#2C3E50]">
                {stats.totalUsers}
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E67E22]/30 hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Recruiters
              </CardTitle>
              <div className="p-1.5 rounded-lg bg-[#E67E22]/10 text-[#E67E22]">
                <UserPlus className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#E67E22]">
                {stats.totalRecruiters}
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#2C3E50]/30 hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Employees
              </CardTitle>
              <div className="p-1.5 rounded-lg bg-[#2C3E50]/10 text-[#2C3E50]">
                <UserMinus className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#2C3E50]">
                {stats.totalEmployees}
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E67E22]/30 hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Companies
              </CardTitle>
              <div className="p-1.5 rounded-lg bg-[#E67E22]/10 text-[#E67E22]">
                <Building2 className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#E67E22]">
                {stats.totalCompanies}
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#2C3E50]/30 hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Jobs
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
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts and Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Analytics Section */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-[#2C3E50]">Platform Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <DashboardAnalytics />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card 
                className="hover:shadow-md transition-all"
                onClick={() => navigate('/admin/users')}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-[#2C3E50]/5">
                      <Users className="h-6 w-6 text-[#2C3E50]" />
                    </div>
                    <div>
                      <CardTitle className="text-[#2C3E50]">Manage Users</CardTitle>
                      <p className="text-sm text-gray-500">View and manage all users</p>
                    </div>
                  </div>
                </CardHeader>
                <CardFooter className="pt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-[#2C3E50] text-[#2C3E50] hover:bg-[#2C3E50]/10"
                  >
                    View Users
                  </Button>
                </CardFooter>
              </Card>

              <Card 
                className="hover:shadow-md transition-all"
                onClick={() => navigate('/admin/companies')}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-[#E67E22]/5">
                      <Building2 className="h-6 w-6 text-[#E67E22]" />
                    </div>
                    <div>
                      <CardTitle className="text-[#E67E22]">Manage Companies</CardTitle>
                      <p className="text-sm text-gray-500">View and manage all companies</p>
                    </div>
                  </div>
                </CardHeader>
                <CardFooter className="pt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-[#E67E22] text-[#E67E22] hover:bg-[#E67E22]/10"
                  >
                    View Companies
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Right Column - Activity Log */}
          <div className="space-y-6">
            {/* Activity Log */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-[#2C3E50]">Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityLog />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;