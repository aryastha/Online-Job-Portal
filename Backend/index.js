import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './routes/user.routes.js';


dotenv.config({});

const app = express();



//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

const corsOption ={
    origin: ["https://localhost:5121"],
    credentials: true,
};
app.use(cors(corsOption));

////API
// app.use('./login', userRoute);
// app.use('./profile/update', userRoute.updateProfile);

app.use("/api/user", userRoute);





const PORT = process.env.PORT || 5001;
app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is running on ${PORT}`);
})