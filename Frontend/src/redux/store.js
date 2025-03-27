import { configureStore , combineReducers} from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import jobSlice from "./jobSlice";
import jobReducer from './jobSlice'
import { companySlice } from "./companySlice";

// import { createRoot } from "react-dom/client";
// import {
//   persistStore,
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from "redux-persist";
// import storage from "redux-persist/lib/storage";

// const persistConfig = {
//   key: "root",
//   version: 1,
//   storage,
  // whitelist: ['auth']
// };

// const rootReducer = combineReducers({
//     auth: authReducer, //for auth reducer
//     // job: jobSlice,
//     job:jobReducer,

// })
// const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  // reducer: persistedReducer,
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: {
  //       ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  //     },
  //   }),
  reducer:{
    auth: authReducer, //for auth reducer
    job: jobSlice,
    jobs:jobReducer,
    company: companySlice,
  }

});
// export const persistor = persistStore(store);

export default store;
