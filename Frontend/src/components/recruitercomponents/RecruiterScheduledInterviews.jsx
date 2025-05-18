import React, { useState, useEffect, useCallback } from 'react';
import InterviewCard from '../Interview/InterviewCard';
import InterviewNavigation from '../Interview/InterviewNavigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:8000/api/v1';

const RecruiterScheduledInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchRecruiterInterviews = useCallback(async () => {
    if (!user?._id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/interviews/recruiter/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setInterviews(response.data.interviews || response.data);
    } catch (err) {
      console.error("Error fetching recruiter interviews:", err);
      setError(err.response?.data?.message || "Failed to fetch interviews.");
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchRecruiterInterviews();
  }, [fetchRecruiterInterviews]);

  const handleStatusChange = async (interviewId, newStatus) => {
    try {
      await axios.put(`${API_URL}/interviews/${interviewId}/status`, 
        { status: newStatus }, 
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setInterviews(prevInterviews => 
        prevInterviews.map(interview => 
          interview._id === interviewId ? { ...interview, status: newStatus } : interview
        )
      );
      alert(`Interview status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating interview status:", err);
      alert(err.response?.data?.message || "Failed to update status.");
    }
  };

  return (
    <div>
      <InterviewNavigation />
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Scheduled Interviews</h2>
          <Link 
            to="/recruiter/interviews/schedule" 
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Schedule New Interview
          </Link>
        </div>

        {loading && (
          <div className="text-center p-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading scheduled interviews...</p>
          </div>
        )}

        {error && (
          <div className="text-center p-10 text-red-500">
            <p>Error: {error}</p>
            <button 
              onClick={fetchRecruiterInterviews}
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
                    userRole="recruiter"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center p-10 bg-white shadow-md rounded-lg">
                <p className="text-gray-600 text-lg">No interviews currently scheduled.</p>
                <p className="text-gray-500 mt-2">Click the button above to schedule a new interview.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RecruiterScheduledInterviews; 