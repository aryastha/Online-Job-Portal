
import {createSlice} from '@reduxjs/toolkit'


const applicationSlice = createSlice({
    name : "application",
    initialState: {
        applicants: null,
    },

    reducers:{
        setAllApplicants: (status, action) =>{
            status.applicants = action.payload;
        }
    }
});

export const {setAllApplicants} = applicationSlice.actions;
export const applicationReducer = applicationSlice.reducer;

export default applicationSlice.reducer;

