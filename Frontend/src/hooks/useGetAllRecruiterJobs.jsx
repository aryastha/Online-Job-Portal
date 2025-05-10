import React, { useEffect } from "react";
import axios from "axios";
import { JOB_API_ENDPOINT } from "@/utils/data";
import { useDispatch } from "react-redux";
import { setAllRecruiterJobs } from "@/redux/jobSlice";
import { redirect } from "react-router-dom";

//To fetch all the jobd from an API
function useGetAllRecruiterJobs() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllRecruiterJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_ENDPOINT}/getrecruiterjobs`, {
          withCredentials: true,
        });

        if (res.data.status) {
          dispatch(setAllRecruiterJobs(res.data.jobs)); //sent to the redux store
        }else{
            console.log("API was not successful:", res.data);
        }
      } catch (error) {
        console.log("Error fetching jobs",error);
      }
    };
    fetchAllRecruiterJobs();
  }, [dispatch]);
}

export default useGetAllRecruiterJobs;