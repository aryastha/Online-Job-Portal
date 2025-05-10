// src/hooks/usePendingApplications.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setPendingApplications,
  setLoading,
  setError,
} from "@/redux/applicationSlice";
import { APPLICATION_API_ENDPOINT } from "@/utils/data";

const usePendingApplications = () => {
  const dispatch = useDispatch();
  const { pendingApplications, loading, error } = useSelector(
    (state) => state.application
  );

  useEffect(() => {
    const controller = new AbortController();
    const fetchPendingApplications = async () => {
      dispatch(setLoading(true));
      try {
        const response = await axios.get(`${APPLICATION_API_ENDPOINT}/status/pending`,
        {
             withCredentials: true,
             signal: controller.signal
        });
        dispatch(setPendingApplications(response.data.data));
        dispatch(setError(null));
      } catch (err) {
        dispatch(setError("Failed to fetch pending applications"));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchPendingApplications();
    return () => controller.abort();
  }, [dispatch]);

  return { pendingApplications, loading, error };
};

export default usePendingApplications;
