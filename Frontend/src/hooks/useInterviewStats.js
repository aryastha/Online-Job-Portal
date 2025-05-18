import { useState, useEffect } from 'react';
import axios from 'axios';

const useInterviewStats = () => {
  const [interviewStats, setInterviewStats] = useState({
    totalInterviews: 0,
    upcomingInterviews: [],
    interviewsByStatus: {
      pending: 0,
      confirmed: 0,
      rejected_by_candidate: 0,
      cancelled_by_recruiter: 0,
      completed: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInterviewStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5004/api/interviews/stats', {
        withCredentials: true
      });
      
      if (response.data.status === 'success') {
        setInterviewStats({
          totalInterviews: response.data.data.totalInterviews,
          upcomingInterviews: response.data.data.upcomingInterviews,
          interviewsByStatus: response.data.data.interviewsByStatus
        });
      }
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch interview statistics');
      console.error('Error fetching interview stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviewStats();
  }, []);

  return { interviewStats, loading, error, refetch: fetchInterviewStats };
};

export default useInterviewStats; 