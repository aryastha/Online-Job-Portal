import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const useScheduleInterview = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useSelector((store) => store.auth);

  const scheduleInterview = async (applicationId, interviewData) => {
    setIsLoading(true);
    setError(null);

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };

      const response = await axios.post(
        `/api/applications/${applicationId}/schedule`,
        interviewData,
        config
      );

      setIsLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setIsLoading(false);
      throw err;
    }
  };

  return { scheduleInterview, isLoading, error };
};

export default useScheduleInterview;
