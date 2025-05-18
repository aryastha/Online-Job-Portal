import express from 'express';
import {
  postJob,
  getAllJobs,
  getJobById,
  getRecruiterJobs,
  bookmarkJob,
  getBookmarkedJobs,
  saveJob,
  getSavedJobs,
  checkJobSavedStatus,
  toggleSaveJob,
  deleteJob
} from '../controllers/job.controller.js';
import { protect } from '../middleware/isAuthenticated.js';

const router = express.Router();

// Public routes
router.route("/all").get(getAllJobs);
router.route("/search").get(getAllJobs);

// Protected routes
router.route('/post').post(protect, postJob);
router.route('/get').get(protect, getAllJobs);
router.route('/getrecruiterjobs').get(protect, getRecruiterJobs);
router.route('/get/:id').get(protect, getJobById);
router.route('/delete/:id').delete(protect, deleteJob);

// Employee routes
router.route('/:id/bookmark').post(protect, bookmarkJob);
router.route('/bookmarked').get(protect, getBookmarkedJobs);
router.route('/:id/save').post(protect, saveJob);
router.route('/saved/jobs').get(protect, getSavedJobs);
router.route('/:jobId/save').post(protect, toggleSaveJob);
router.route('/saved/status/:id').get(protect, checkJobSavedStatus);

export default router;