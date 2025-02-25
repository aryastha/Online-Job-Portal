import {configureStore} from '@reduxjs/toolkit';
import { authSliceReducer } from './authSlice';

const store = configureStore({
    reducer:{
        auth: authSliceReducer, //for auth reducer
    }
})

export default store;                                 