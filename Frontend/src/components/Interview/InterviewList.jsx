import React, { useState, useEffect, useCallback } from 'react';
import InterviewCard from './InterviewCard';
import InterviewNavigation from './InterviewNavigation';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom'; // Add this import

const API_URL = 'http://localhost:5004/api';

const InterviewList = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate(); // Add this hook

  const fetchInterviews = useCallback(async () => {
    if (!user?._id) {
      setLoading(false);
      setError("Please log in to view interviews");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint = user.role.toLowerCase() === 'recruiter' 
        ? `${API_URL}/interviews/recruiter/${user._id}`
        : `${API_URL}/interviews/candidate/${user._id}`;

      const response = await axios.get(endpoint, {
        withCredentials: true
      });

      if (response.data.status === 'success') {
        setInterviews(response.data.interviews || []);
      } else {
        setError('Failed to fetch interviews');
      }
    } catch (err) {
      console.error("Error fetching interviews:", err);
      setError(err.response?.data?.message || "Failed to fetch interviews. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const handleStatusChange = async (interviewId, newStatus) => {
    try {
      const response = await axios.put(
        `${API_URL}/interviews/${interviewId}/status`,
        { status: newStatus },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );

      if (response.data.status === 'success') {
        toast.success(`Interview status updated to ${newStatus}`);
        // Update the interview list locally
        setInterviews(prevInterviews =>
          prevInterviews.map(interview =>
            interview._id === interviewId ? { ...interview, status: newStatus } : interview
          )
        );
      }
    } catch (err) {
      console.error("Error updating interview status:", err);
      toast.error(err.response?.data?.message || "Failed to update status. Please try again.");
    }
  };

  return (
    <div>
      <InterviewNavigation />
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-6 md:mb-8"> {/* Updated this div */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            {user?.role?.toLowerCase() === 'recruiter' ? 'Manage Interviews' : 'Your Upcoming Interviews'}
          </h2>
          <button
            onClick={() => navigate(user?.role?.toLowerCase() === 'recruiter' ? '/recruiter/dashboard' : '/')}
            className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {loading && (
          <div className="text-center p-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading interviews...</p>
          </div>
        )}

        {error && (
          <div className="text-center p-10 text-red-500">
            <p>Error: {error}</p>
            <button
              onClick={fetchInterviews}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {interviews.length > 0 ? (
              <div className="space-y-6">
                {interviews.map(interview => (
                  <InterviewCard
                    key={interview._id}
                    interview={interview}
                    onStatusChange={handleStatusChange}
                    userRole={user?.role?.toLowerCase()}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center p-10 bg-white shadow-md rounded-lg">
                <p className="text-gray-600 text-lg">No interviews scheduled at the moment.</p>
                <p className="text-gray-500 mt-2">
                  {user?.role?.toLowerCase() === 'recruiter'
                    ? 'Schedule new interviews by clicking the "Schedule Interview" button above.'
                    : 'Check back later for upcoming interviews.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InterviewList;