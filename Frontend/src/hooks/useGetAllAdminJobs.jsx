import React, { useEffect } from "react";
import axios from "axios";
import { JOB_API_ENDPOINT } from "@/utils/data";
import { useDispatch } from "react-redux";
import { setAllAdminJobs } from "@/redux/jobSlice";
import { redirect } from "react-router-dom";

//To fetch all the jobd from an API
function useGetAllAdminJobs() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllAdminJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_ENDPOINT}/getadminjobs`, {
          withCredentials: true,
        });

        if (res.data.status) {
          dispatch(setAllAdminJobs(res.data.jobs)); //sent to the redux store
        }else{
            console.log("API was not successful:", res.data);
        }
      } catch (error) {
        console.log("Error fetching jobs",error);
      }
    };
    fetchAllAdminJobs();
  }, [dispatch]);
}

export default useGetAllAdminJobs;