import {createSlice} from '@reduxjs/toolkit'

const jobSlice = createSlice({

    name: "job",
    initialState:{
        allJobs:[],
    },

    reducers: {
        //actions
        setAllJobs: (state,action) =>{
            console.log("Setting jobs in Redux:", action.payload);  // Debugging
            state.allJobs = action.payload;

        }
    },

});

export const {setAllJobs} = jobSlice.actions;
export default jobSlice.reducer; 