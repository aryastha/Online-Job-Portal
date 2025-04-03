// routes/resume.routes.js
import express from 'express';
import { singleUpload } from '../middleware/multer.js';
import { createResume } from '../controllers/resume.controller.js';
import authenticateToken from '../middleware/isAuthenticated.js'; // Updated import

const router = express.Router();

router.post('/', 
  authenticateToken, //only logged-user can create resumes
  singleUpload, 
  createResume      //calls the fucntion
);

export default router;