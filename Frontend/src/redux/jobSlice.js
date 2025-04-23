import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    allJobs: [],
    allAdminJobs: [],
    singleJob: null,
    searchJobByText: "",
    allAppliedJobs: [],
    searchedQuery: "",
    filters: {
      // New filters state to store multiple filter criteria
      searchText: "",
      locations: [],
      technology: [],
      experience: [0, 10],
      salary: [0, 200000000],
      jobTypes: [],
      technologies: [],
      postedWithin: null,
      positions: [],
    },
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
    // setFilters: (state, action) => {
    //   console.log("Dispatching filters:", action.payload);
    //   state.filters = {
    //     ...state.filters,
    //     ...action.payload,
    //   };
    // },
    updateFilter: (state, action) => {
      const { filterType, value } = action.payload;
      state.filters[filterType] = value;
    },
    // New reducer to clear all filters
    resetFilters: (state) => {
      state.filters = {
        searchText: "",
        locations: [],
        experience: [0, 10],
        salary: [0, 200000],
        jobTypes: [],
        technologies: [],
        postedWithin: null,
        positions: [],
      };
    },

    updateBookmarkStatus: (state, action) => {
      const job = state.allJobs.find((j) => j._id === action.payload.jobId);
      if (job) {
        job.isBookmarked = action.payload.bookmarked;
      }
    },

    // In your jobSlice.js
    updateSavedStatus: (state, action) => {
      const { jobId, saved, userId } = action.payload;

      // Update in allJobs array
      const jobInAllJobs = state.allJobs.find((j) => j._id === jobId);
      if (jobInAllJobs) {
        if (saved) {
          if (!jobInAllJobs.savedBy?.includes(userId)) {
            jobInAllJobs.savedBy = [...(jobInAllJobs.savedBy || []), userId];
          }
        } else {
          jobInAllJobs.savedBy =
            jobInAllJobs.savedBy?.filter((id) => id !== userId) || [];
        }
      }

      // Also update in singleJob if it's the current viewed job
      if (state.singleJob?._id === jobId) {
        if (saved) {
          if (!state.singleJob.savedBy?.includes(userId)) {
            state.singleJob.savedBy = [
              ...(state.singleJob.savedBy || []),
              userId,
            ];
          }
        } else {
          state.singleJob.savedBy =
            state.singleJob.savedBy?.filter((id) => id !== userId) || [];
        }
      }
    },
  },
});

export const {
  setAllJobs,
  setSingleJob,
  setAllAdminJobs,
  setSearchJobByText,
  setAllAppliedJobs,
  setSearchedQuery,
  setFilters, // Export the new actions
  clearFilters,
  updateBookmarkStatus,
  updateSavedStatus,
  updateFilter,
  resetFilters
} = jobSlice.actions;

export default jobSlice.reducer;
