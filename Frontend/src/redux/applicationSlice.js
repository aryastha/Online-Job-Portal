import { createSlice } from "@reduxjs/toolkit"
const applicationSlice =  createSlice( {
  name: "application",
  initialState:{
    applications: [],
  },
  reducers:{
    setSingleApplication: (state, action) => {
        state.singleApplication = action.payload
    }
  }
});

export const { setSingleApplication } = applicationSlice.actions;
export default applicationSlice.reducer;
export {applicationSlice};
export const applicationSliceReducer = applicationSlice.reducer;

