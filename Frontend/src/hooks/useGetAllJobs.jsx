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

        if (res.data.status) {
          dispatch(setAllJobs(res.data.jobs)); //sent to the redux store
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

// import { useEffect } from "react";
// import axios from "axios";
// import { JOB_API_ENDPOINT } from "@/utils/data";
// import { useDispatch, useSelector } from "react-redux";
// import { setAllJobs } from "@/redux/jobSlice";
// import { useNavigate } from "react-router-dom";

// function useGetAllJobs() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { token } = useSelector((state) => state.auth); // Get token from auth state

//   useEffect(() => {
//     const fetchAllJobs = async () => {
//       try {
//         const res = await axios.get(`${JOB_API_ENDPOINT}/get`, {
//           headers: {
//             Authorization: `Bearer ${token}`, // Include JWT token
//           },
//           withCredentials: true,
//         });

//         if (res.data.status) {
//           dispatch(setAllJobs(res.data.jobs));
//         } else {
//           console.log("API was not successful:", res.data);
//         }
//       } catch (error) {
//         console.log("Error fetching jobs", error);
//         if (error.response?.status === 401) {
//           // Redirect to login if unauthorized
//           navigate("/login");
//         }
//       }
//     };

//     if (token) {
//       fetchAllJobs();
//     } else {
//       navigate("/login");
//     }
//   }, [dispatch, token, navigate]);
// }

// export default useGetAllJobs;
