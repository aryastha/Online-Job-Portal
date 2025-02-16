import express from 'express';
import { applyJob , getAppliedJobs,getApplicants, updateStatus } from "../controllers/application.controller.js";
import authenticateToken from '../middleware/isAuthenticated.js';
const router = express.Router();

router.route('/apply/:id').post(authenticateToken,applyJob);
router.route('/get').get(authenticateToken, getAppliedJobs);
router.route('/:id/applicants').get(authenticateToken, getApplicants);
router.route('/status/:id/update').post(authenticateToken,updateStatus);

export default router;
