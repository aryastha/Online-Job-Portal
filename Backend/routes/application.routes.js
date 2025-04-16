import express from 'express';
import { applyJob , getAppliedJobs,getApplicants, updateStatus, getAllApplicants } from "../controllers/application.controller.js";
import authenticateToken from '../middleware/isAuthenticated.js';
const router = express.Router();

router.route("/all/applicants").get(authenticateToken, getAllApplicants);
router.route("/apply/:id").get(authenticateToken, applyJob);
router.route("/get").get(authenticateToken, getAppliedJobs);
router.route("/status/:id/update").post(authenticateToken, updateStatus);

router.route("/:id/applicants").get(authenticateToken, getApplicants);

export default router;
