import React, { useEffect } from "react";
import axios from "axios";
import { JOB_API_ENDPOINT } from "@/utils/data";
import { useDispatch } from "react-redux";
import { setAllJobs } from "@/redux/jobSlice";
import { redirect } from "react-router-dom";

//To fetch all the jobd from an API
function useGetAllJobs() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_ENDPOINT}/get`, {
          withCredentials: true,
        });
        console.log("Fetched jobs from API:", res.data); // Debugging

        if (res.data.status) {
          console.log("Before dispatch - jobs:", res.data.jobs); // Debug before dispatch
          dispatch(setAllJobs(res.data.jobs)); //sent to the redux store
          console.log("After dispatch"); // Debug after dispatch
        }else{
            console.log("API was not successful:", res.data);
        }
      } catch (error) {
        console.log("Error fetching jobs",error);
      }
    };
    fetchAllJobs();
  }, [dispatch]);
}

export default useGetAllJobs;
