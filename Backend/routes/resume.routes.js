// routes/resume.routes.js
import express from 'express';
import { singleUpload } from '../middleware/multer.js';
import { createResume } from '../controllers/resume.controller.js';
import { protect } from '../middleware/isAuthenticated.js';

const router = express.Router();

router.post('/', 
  protect, //only logged-user can create resumes
  singleUpload, 
  createResume      //calls the fucntion
);

export default router;