import React, {useEffect} from "react";
import axios from "axios";
import { JOB_API_ENDPOINT } from '@/utils/data';
import { useDispatch } from "react-redux";
import { setAllJobs } from "@/redux/jobSlice";

//To fetch all the jobd from an API
function useGetAllJobs() {

    const dispatch =  useDispatch();

    useEffect(()=>{

        const fetchAllJobs = async() => {
            try{
                const res = await axios.get(`${JOB_API_ENDPOINT}/get`,{
                    withCredentials:true,
                    })
                    console.log("Fetched jobs:", res.data);  // Debugging

                if (res.data.success){
                    dispatch(setAllJobs(res.data.jobs)); //sent to the redux store
                }
            }catch (error){
                console.log(error)
            }
        };
        fetchAllJobs();
    },[dispatch]);                       

}

export default useGetAllJobs
