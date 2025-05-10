import express from 'express';
import {postJob, getAllJobs, getJobById,getRecruiterJobs,bookmarkJob,getBookmarkedJobs, saveJob,getSavedJobs, checkJobSavedStatus, toggleSaveJob} from '../controllers/job.controller.js';
import authenticateToken from '../middleware/isAuthenticated.js';

const router = express.Router();

router.route('/post').post(authenticateToken,postJob);
router.route('/get').get( authenticateToken,getAllJobs);
router.route('/getrecruiterjobs').get(authenticateToken, getRecruiterJobs);
router.route('/get/:id').get(authenticateToken, getJobById);

router.route('/:id/bookmark').post(authenticateToken, bookmarkJob);
router.route('/bookmarked').get(authenticateToken, getBookmarkedJobs);
router.route('/:id/save').post(authenticateToken, saveJob);
router.route('/saved/jobs').get(authenticateToken, getSavedJobs);
router.route(':/jobId/save').post(authenticateToken, toggleSaveJob)
router.route('/saved/status/:id').get(authenticateToken, checkJobSavedStatus );





export default router;