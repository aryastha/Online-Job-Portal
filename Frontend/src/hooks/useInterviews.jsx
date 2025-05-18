import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const API_URL = 'http://localhost:5004/api';

const useInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchInterviews = async () => {
      if (!user?._id) return;
      try {
        const response = await axios.get(
          user.role === 'recruiter'
            ? `${API_URL}/interviews/recruiter/${user._id}`
            : `${API_URL}/interviews/candidate/${user._id}`,
          { withCredentials: true }
        );
        setInterviews(response.data.interviews || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [user]);

  const updateStatus = async (interviewId, status) => {
    try {
      await axios.put(`${API_URL}/interviews/${interviewId}/status`, 
        { status },
        { withCredentials: true }
      );
      setInterviews(interviews.map(i => 
        i._id === interviewId ? { ...i, status } : i
      ));
    } catch (error) {
      console.error(error);
    }
  };

  return { interviews, loading, updateStatus };
};

export default useInterviews;