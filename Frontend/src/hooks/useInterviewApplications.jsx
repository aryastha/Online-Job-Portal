import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setInterviews } from '../redux/applicationSlice.js';

const useInterviewApplications = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    const fetchInterviewApplications = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const response = await axios.get('/api/applications/interviews', config);
        dispatch(setInterviews(response.data.applications));
      } catch (error) {
        console.error('Error fetching interview applications:', error);
      }
    };

    fetchInterviewApplications();
  }, [dispatch, user.token]);
};

export default useInterviewApplications;
