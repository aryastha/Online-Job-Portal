import {createSlice} from '@reduxjs/toolkit'

const jobSlice = createSlice({

    name: "job",
    initialState:{
        allJobs:[],
        allAdminJobs:[],
        singleJob: null, //To hold the job until the user clciks on a job
        searchJobByText: "",
    },

    reducers: {
        //actions
        setAllJobs: (state,action) =>{
            state.allJobs = action.payload;
        },
        setAllAdminJobs: (state, action)=>{
            state.allAdminJobs = action.payload;
        },
        setSingleJob: (state, action)=>{
            state.singleJob = action.payload;
        },
        setSearchJobByText: (state, action)=>{
            state.searchJobByText = action.payload;
        }


    },

});

export const {setAllJobs, setSingleJob, setAllAdminJobs, setSearchJobByText} = jobSlice.actions;
export default jobSlice.reducer; 