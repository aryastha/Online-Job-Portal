import app from './app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5004;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/arya_jobs';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        
        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    // Close server & exit process
    process.exit(1);
}); 