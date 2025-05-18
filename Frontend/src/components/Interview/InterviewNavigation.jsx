import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const InterviewNavigation = () => {
    const location = useLocation();
    const { user } = useAuth();
    const isRecruiter = user?.role === 'recruiter';

    const isActive = (path) => {
        return location.pathname === path ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100';
    };

    return (
        <nav className="bg-white shadow-sm mb-6">
            <div className="container mx-auto px-4">
                <div className="flex space-x-4 py-3">
                    {/* Common links for all users */}
                    <Link
                        to="/interviews"
                        className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/interviews')}`}
                    >
                        All Interviews
                    </Link>
                    <Link
                        to="/interviews/calendar"
                        className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/interviews/calendar')}`}
                    >
                        Calendar View
                    </Link>

                    {/* Recruiter-specific links */}
                    {isRecruiter && (
                        <>
                            <Link
                                to="/recruiter/interviews"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/recruiter/interviews')}`}
                            >
                                Manage Interviews
                            </Link>
                            <Link
                                to="/recruiter/interviews/schedule"
                                className={`px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700`}
                            >
                                Schedule Interview
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default InterviewNavigation; 