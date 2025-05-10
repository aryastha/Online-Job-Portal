
// import {createSlice} from '@reduxjs/toolkit'


// const applicationSlice = createSlice({
//     name : "application",
//     initialState: {
//         applicants: null,
//     },

//     reducers:{
//         setAllApplicants: (status, action) =>{
//             status.applicants = action.payload;
//         }
//     }
// });

// export const {setAllApplicants} = applicationSlice.actions;
// export const applicationReducer = applicationSlice.reducer;

// export default applicationSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  applicants: null,
  pendingApplications: [], 
  interviews: [],
  loading: false,
  error: null
};

const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    setAllApplicants: (state, action) => {
      state.applicants = action.payload;
    },
    setPendingApplications: (state, action) => {
      state.pendingApplications = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setInterviews: (state, action) =>{
      state.interviews = action.payload;
    }
  }
});

// Export actions
export const { 
  setAllApplicants, 
  setPendingApplications,
  setLoading,
  setError ,
  setInterviews
} = applicationSlice.actions;

export default applicationSlice.reducer;