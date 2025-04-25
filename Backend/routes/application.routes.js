import express from 'express';
import { applyJob , getAppliedJobs,getApplicants, updateStatus, getAllApplicants, uploadResume, getPendingApplications } from "../controllers/application.controller.js";
import authenticateToken from '../middleware/isAuthenticated.js';
import { singleUpload } from '../middleware/multer.js';
const router = express.Router();

router.route("/all/applicants").get(authenticateToken, getAllApplicants);
router.route("/apply/:id").post(authenticateToken, applyJob);
router.route("/get").get(authenticateToken, getAppliedJobs);
router.route("/status/:id/update").post(authenticateToken, updateStatus);
router.route("/upload/resume").post(authenticateToken, singleUpload,uploadResume);
router.route("/status/pending").get(getPendingApplications)

router.route("/:id/applicants").get(authenticateToken, getApplicants);

export default router;
