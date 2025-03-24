import {createSlice} from '@reduxjs/toolkit'

const jobSlice = createSlice({

    name: "job",
    initialState:{
        allJobs:[],
        singleJob: null, //To hold the job until the user clciks on a job
    },

    reducers: {
        //actions
        setAllJobs: (state,action) =>{
            state.allJobs = action.payload;
        },

        setSingleJob: (state, action)=>{
            state.singleJob = action.payload;
        }


    },

});

export const {setAllJobs, setSingleJob} = jobSlice.actions;
export default jobSlice.reducer; 