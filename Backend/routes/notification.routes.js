import express from 'express';
import { sendInterviewNotification } from '../controllers/notification.controller.js';
import { protect } from '../middleware/isAuthenticated.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Send interview notification
router.post('/interview', sendInterviewNotification);

export default router; 