import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js';
import jobRoutes from './routes/job.routes.js';
import companyRoutes from './routes/company.routes.js';
import recruiterRoutes from './routes/recruiter.routes.js';
import applicationRoutes from './routes/application.routes.js';
import notificationRoutes from './routes/notification.routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notifications', notificationRoutes); 

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

export default app; 