import express from 'express';
import { protect } from '../middleware/isAuthenticated.js';
import { isRecruiter } from '../middleware/isRecruiter.js';
import {
  getRecruiterApplications,
  getRecruiterInterviewStats,
  getRecruiterAnalytics,
  updateRecruiterProfile,
  uploadRecruiterPhoto,
  getRecruiterStats
} from '../controllers/recruiter.controller.js';
import { getRecruiterJobs } from '../controllers/job.controller.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Profile routes
router.put('/profile', protect, isRecruiter, updateRecruiterProfile);
router.post('/upload-photo', protect, isRecruiter, upload.single('file'), uploadRecruiterPhoto);

// Dashboard routes
router.get('/jobs', protect, isRecruiter, getRecruiterJobs);
router.get('/applications', protect, isRecruiter, getRecruiterApplications);
router.get('/stats', protect, isRecruiter, getRecruiterStats);
router.get('/interviews/stats', protect, isRecruiter, getRecruiterInterviewStats);
router.get('/analytics', protect, isRecruiter, getRecruiterAnalytics);

export default router; 