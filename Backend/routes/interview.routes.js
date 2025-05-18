import express from 'express';
import {
  createInterview,
  getUserInterviews,
  getRecruiterInterviews,
  updateStatus,
  getInterviewById,
  getCalendarView,
  deleteInterview,
  getRecruiterInterviewStats
} from '../controllers/interview.controller.js';
import { protect, restrictTo } from '../middleware/isAuthenticated.js';

const router = express.Router();

// Protected routes - require authentication
router.use(protect);

// Get interview statistics for recruiter dashboard
router.get('/stats', restrictTo('Recruiter', 'recruiter'), getRecruiterInterviewStats);

// Create interview (recruiter only)
router.post('/schedule', restrictTo('Recruiter', 'recruiter'), createInterview);

// Get interviews based on role
router.get('/candidate/:userId', getUserInterviews);
router.get('/recruiter/:recruiterId', restrictTo('Recruiter', 'recruiter'), getRecruiterInterviews);

// Get calendar view
router.get('/calendar', getCalendarView);

// Get specific interview
router.get('/:id', getInterviewById);

// Update interview status
router.put('/:id/status', updateStatus);

// Delete interview (recruiter only)
router.delete('/:id', restrictTo('Recruiter', 'recruiter'), deleteInterview);

export default router;
  