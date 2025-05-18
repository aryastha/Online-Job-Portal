import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import axios from 'axios';
import { USER_API_ENDPOINT, JOB_API_ENDPOINT, COMPANY_API_ENDPOINT } from '@/utils/data';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Vibrant color palette based on #E67E22 (orange) and #2C3E50 (navy)
const COLORS = [
  '#E67E22', // Primary orange
  '#2C3E50', // Primary navy
  '#3498DB', // Bright blue
  '#E74C3C', // Vibrant red
  '#2ECC71', // Fresh green

];


// Chart styling
const chartMargin = { top: 20, right: 10, left: 10, bottom: 20 };
const axisStyle = { 
  fontSize: 12, 
  fontFamily: 'sans-serif', 
  color: '#2C3E50',
};
const tooltipStyle = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #EAECEE',
  borderRadius: '6px',
  padding: '8px 12px',
  fontSize: '14px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const DashboardAnalytics = () => {
  const [userStats, setUserStats] = useState({
    roleDistribution: [],
    registrationsOverTime: [],
    activeUsers: 0
  });
  const [jobStats, setJobStats] = useState({
    jobsByCompany: [],
    postingsOverTime: [],
    jobTypeDistribution: [],
    locationDistribution: []
  });
  const [applicationStats, setApplicationStats] = useState({
    submissionsOverTime: [],
    statusDistribution: [],
    topJobs: []
  });
  const [companyStats, setCompanyStats] = useState({
    companiesByLocation: [],
    registrationsOverTime: [],
    jobsPerCompany: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch users data
      const usersResponse = await axios.get(`${USER_API_ENDPOINT}/all-users`, {
        withCredentials: true
      });
      
      if (usersResponse.data.success) {
        const users = usersResponse.data.users;
        
        // Process user role distribution
        const roleCount = users.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {});
        
        setUserStats(prev => ({
          ...prev,
          roleDistribution: Object.entries(roleCount).map(([role, count]) => ({
            name: role,
            value: count
          })),
          activeUsers: users.length
        }));
      }

      // Fetch jobs data
      const jobsResponse = await axios.get(`${JOB_API_ENDPOINT}/all`, {
        withCredentials: true
      });
      
      if (jobsResponse.data.success) {
        const jobs = jobsResponse.data.jobs;
        
        // Process job type distribution
        const jobTypeCount = jobs.reduce((acc, job) => {
          acc[job.jobType] = (acc[job.jobType] || 0) + 1;
          return acc;
        }, {});
        
        setJobStats(prev => ({
          ...prev,
          jobTypeDistribution: Object.entries(jobTypeCount).map(([type, count]) => ({
            name: type,
            value: count
          }))
        }));
      }

      // Fetch companies data
      const companiesResponse = await axios.get(`${COMPANY_API_ENDPOINT}/all`, {
        withCredentials: true
      });
      
      if (companiesResponse.data.success) {
        const companies = companiesResponse.data.companies;
        
        // Process company location distribution
        const locationCount = companies.reduce((acc, company) => {
          if (company.location) {
            acc[company.location] = (acc[company.location] || 0) + 1;
          }
          return acc;
        }, {});
        
        setCompanyStats(prev => ({
          ...prev,
          companiesByLocation: Object.entries(locationCount).map(([location, count]) => ({
            name: location,
            value: count
          }))
        }));
      }

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E67E22]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-[#EAECEE] p-1 rounded-lg">
          <TabsTrigger 
            value="users" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#2C3E50]"
          >
            Users
          </TabsTrigger>
          <TabsTrigger 
            value="jobs"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#2C3E50]"
          >
            Jobs
          </TabsTrigger>
          <TabsTrigger 
            value="companies"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#2C3E50]"
          >
            Companies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Card className="border border-[#EAECEE] shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-[#2C3E50]">User Role Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={chartMargin}>
                      <Pie
                        data={userStats.roleDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {userStats.roleDistribution.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                            stroke="#FFFFFF"
                            strokeWidth={1}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={tooltipStyle}
                        formatter={(value) => [`${value} users`, 'Count']}
                      />
                      <Legend 
                        layout="vertical" 
                        verticalAlign="middle" 
                        align="right"
                        wrapperStyle={{ 
                          paddingLeft: '20px',
                          fontSize: '13px',
                          color: '#2C3E50'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Card className="border border-[#EAECEE] shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-[#2C3E50]">Job Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={chartMargin}>
                      <Pie
                        data={jobStats.jobTypeDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {jobStats.jobTypeDistribution.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                            stroke="#FFFFFF"
                            strokeWidth={1}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={tooltipStyle}
                        formatter={(value) => [`${value} jobs`, 'Count']}
                      />
                      <Legend 
                        layout="vertical" 
                        verticalAlign="middle" 
                        align="right"
                        wrapperStyle={{ 
                          paddingLeft: '20px',
                          fontSize: '13px',
                          color: '#2C3E50'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="companies" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Card className="border border-[#EAECEE] shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-[#2C3E50]">Companies by Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={companyStats.companiesByLocation}
                      margin={chartMargin}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#EAECEE" />
                      <XAxis 
                        dataKey="name" 
                        tick={axisStyle}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={axisStyle}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip 
                        contentStyle={tooltipStyle}
                        cursor={{ fill: '#EAECEE', opacity: 0.3 }}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="#3498DB" 
                        name="Companies"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardAnalytics;