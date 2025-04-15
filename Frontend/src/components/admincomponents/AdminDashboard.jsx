import React from 'react';
import Navbar from '../components_lite/Navbar';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs';
import useGetAllCompanies from '@/hooks/useGetAllComapnies';
import { Briefcase, Building, Users, FileText, Plus, ArrowRight } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useSelector((store) => store.auth);
    const { companies } = useSelector((store) => store.company);
    const { allAdminJobs } = useSelector((store) => store.job);
    
    // Call the hooks
    useGetAllAdminJobs();
    useGetAllCompanies();

    // Calculate stats
    const totalJobs = allAdminJobs?.length || 0;
    const totalCompanies = companies?.length || 0;
    const totalApplications = allAdminJobs?.reduce((acc, job) => acc + (job.applications?.length || 0), 0) || 0;
    const newApplications = allAdminJobs?.reduce((acc, job) => acc + (job.applications?.filter(app => app.status === 'new')?.length || 0), 0) || 0;

    // Stats cards data
    const stats = [
        {
            title: "Total Jobs",
            value: totalJobs,
            icon: <Briefcase className="w-5 h-5" />,
            color: "bg-blue-100 text-blue-600",
            path: "/admin/jobs"
        },
        {
            title: "Total Companies",
            value: totalCompanies,
            icon: <Building className="w-5 h-5" />,
            color: "bg-purple-100 text-purple-600",
            path: "/admin/companies"
        },
        {
            title: "Total Applications",
            value: totalApplications,
            icon: <Users className="w-5 h-5" />,
            color: "bg-green-100 text-green-600",
            // path: "/admin/jobs"
        },
        {
            title: "New Applications",
            value: newApplications,
            icon: <FileText className="w-5 h-5" />,
            color: "bg-orange-100 text-orange-600",
            path: "/admin/jobs"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="p-4 md:p-6">
                {/* Welcome Banner */}
                <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">Welcome, {user?.name || 'Admin'}</h1>
                    <p className="text-gray-600 mt-1">Here's your recruitment dashboard overview</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {stats.map((stat, index) => (
                        <div 
                            key={index} 
                            className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => navigate(stat.path)}
                        >
                            <div className="flex items-center justify-between">
                                <div className={`rounded-full p-2 ${stat.color}`}>
                                    {stat.icon}
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">{stat.title}</p>
                                    <h3 className="text-xl font-bold">{stat.value}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Jobs and Companies */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Recent Jobs */}
                    <div className="bg-white rounded-lg shadow p-4 md:p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg md:text-xl font-semibold">Recent Job Postings</h2>
                            <button 
                                onClick={() => navigate('/admin/jobs')}
                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                            >
                                View all <ArrowRight className="ml-1 w-4 h-4" />
                            </button>
                        </div>
                        
                        {allAdminJobs?.length > 0 ? (
                            <div className="space-y-3">
                                {allAdminJobs.slice(0, 5).map(job => (
                                    <div 
                                        key={job._id} 
                                        className="border-b pb-3 last:border-b-0 hover:bg-gray-50 p-2 rounded cursor-pointer"
                                        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                    >
                                        <h3 className="font-medium text-sm md:text-base">{job.title}</h3>
                                        <div className="flex justify-between text-xs md:text-sm text-gray-500 mt-1">
                                            <span>{job.position} • {job.jobType}</span>
                                            <span>{job.applications?.length || 0} applicants</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-gray-500">No jobs posted yet</p>
                                <button
                                    onClick={() => navigate('/admin/jobs/create')}
                                    className="mt-3 text-blue-600 hover:text-blue-800 text-sm flex items-center justify-center"
                                >
                                    <Plus className="w-4 h-4 mr-1" /> Post a new job
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Companies List */}
                    <div className="bg-white rounded-lg shadow p-4 md:p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg md:text-xl font-semibold">Your Companies</h2>
                            <button 
                                onClick={() => navigate('/admin/companies')}
                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                            >
                                View all <ArrowRight className="ml-1 w-4 h-4" />
                            </button>
                        </div>
                        
                        {companies?.length > 0 ? (
                            <div className="space-y-3">
                                {companies.slice(0, 5).map(company => (
                                    <div 
                                        key={company._id} 
                                        className="border-b pb-3 last:border-b-0 hover:bg-gray-50 p-2 rounded cursor-pointer"
                                        onClick={() => navigate(`/admin/companies/${company._id}`)}
                                    >
                                        <h3 className="font-medium text-sm md:text-base">{company.name}</h3>
                                        <div className="flex justify-between text-xs md:text-sm text-gray-500 mt-1">
                                            <span>{company.industry}</span>
                                            <span>{company.jobs?.length || 0} jobs</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-gray-500">No companies added yet</p>
                                <button
                                    onClick={() => navigate('/admin/companies/create')}
                                    className="mt-3 text-blue-600 hover:text-blue-800 text-sm flex items-center justify-center"
                                >
                                    <Plus className="w-4 h-4 mr-1" /> Add a company
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow p-4 md:p-6">
                    <h2 className="text-lg md:text-xl font-semibold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                            onClick={() => navigate('/admin/jobs/create')}
                            className="flex items-center justify-center p-3 border rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base"
                        >
                            <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                            Post New Job
                        </button>
                        <button
                            onClick={() => navigate('/admin/companies/create')}
                            className="flex items-center justify-center p-3 border rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base"
                        >
                            <Building className="w-5 h-5 mr-2 text-purple-600" />
                            Add Company
                        </button>
                        <button
                            onClick={() => navigate('/admin/jobs')}
                            className="flex items-center justify-center p-3 border rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base"
                        >
                            <Users className="w-5 h-5 mr-2 text-green-600" />
                            Manage Jobs
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;