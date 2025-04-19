import { createSlice } from '@reduxjs/toolkit';

const jobSlice = createSlice({
  name: "job",
  initialState: {
    allJobs: [],
    allAdminJobs: [],
    singleJob: null,
    searchJobByText: "",
    allAppliedJobs: [],
    searchedQuery: "",
    filters: {  // New filters state to store multiple filter criteria
      location: "",
      technology: "",
      experience: "",
      salary: ""
    }
  },
  reducers: {
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },
    setAllAdminJobs: (state, action) => {
      state.allAdminJobs = action.payload;
    },
    setSingleJob: (state, action) => {
      state.singleJob = action.payload;
    },
    setSearchJobByText: (state, action) => {
      state.searchJobByText = action.payload;
    },
    setAllAppliedJobs: (state, action) => {
      state.allAppliedJobs = action.payload;
    },
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },
    // New reducer for setting filters
    setFilters: (state, action) => {
      console.log("Dispatching filters:", action.payload);
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },
    // New reducer to clear all filters
    clearFilters: (state) => {
      state.filters = {
        location: "",
        technology: "",
        experience: "",
        salary: ""
      };
    }
  }
});

export const {
  setAllJobs,
  setSingleJob,
  setAllAdminJobs,
  setSearchJobByText,
  setAllAppliedJobs,
  setSearchedQuery,
  setFilters,  // Export the new actions
  clearFilters
} = jobSlice.actions;

export default jobSlice.reducer;