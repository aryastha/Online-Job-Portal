import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchInterviews = createAsyncThunk(
  'interviews/fetchInterviews',
  async (userId) => {
    const response = await api.get(`/interviews/user/${userId}`);
    return response.data;
  }
);

export const updateInterviewStatus = createAsyncThunk(
  'interviews/updateStatus',
  async ({ interviewId, status }) => {
    await api.patch(`/interviews/${interviewId}/status`, { status });
    return { interviewId, status };
  }
);

const interviewSlice = createSlice({
  name: 'interviews',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterviews.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInterviews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchInterviews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateInterviewStatus.fulfilled, (state, action) => {
        const { interviewId, status } = action.payload;
        state.items = state.items.map(i => 
          i._id === interviewId ? { ...i, status } : i
        );
      });
  }
});

export default interviewSlice.reducer;