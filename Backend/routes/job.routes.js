import express from 'express';
import {postJob, getAllJobs, getJobById,getAdminJobs,bookmarkJob,getBookmarkedJobs, saveJob} from '../controllers/job.controller.js';
import authenticateToken from '../middleware/isAuthenticated.js';

const router = express.Router();

router.route('/post').post(authenticateToken,postJob);
router.route('/get').get( authenticateToken,getAllJobs);
router.route('/getadminjobs').get(authenticateToken, getAdminJobs);
router.route('/get/:id').get(authenticateToken, getJobById);

router.route('/:id/bookmark').post(authenticateToken, bookmarkJob);
router.route('/bookmarked').get(authenticateToken, getBookmarkedJobs);
router.route('/:id/save').post(authenticateToken, saveJob);



export default router;