import { APPLICATION_API_ENDPOINT } from "@/utils/data";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAllAppliedJobs } from "@/redux/jobSlice";

const useGetAllAppliedJobs = () =>{

    const dispatch= useDispatch();

    useEffect(()=>{
        const fetchAllAppliedJobs = async() =>{
            try{
                const res = await axios(`${APPLICATION_API_ENDPOINT}/get`,
                    {withCredentials: true,}
                )
                console.log("API all applied jobs Response:", res.data);

                if(res.data.success){
                    console.log(res.data)
                    dispatch(setAllAppliedJobs(res.data.application));

                }
            }catch(error){
                console.error(error);
            }
        };
        fetchAllAppliedJobs();
    },[dispatch]);
    return null;

}

export default useGetAllAppliedJobs;