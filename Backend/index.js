import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './routes/user.routes.js';
import companyRoute from './routes/company.routes.js';
import jobRoute from './routes/job.routes.js';
import applicationRoute from './routes/application.routes.js';
import resumeRoutes from './routes/resume.routes.js';


dotenv.config({});

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

const corsOption ={
    origin: ["http://localhost:5173"],
    credentials: true,
};
app.use(cors(corsOption));

//API
app.use("/api/user", userRoute);
app.use("/api/company", companyRoute);
app.use("/api/job", jobRoute);
app.use("/api/application", applicationRoute);
app.use('/api/resumes', resumeRoutes);


const PORT = process.env.PORT || 5003;
app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is running on ${PORT}`);
})