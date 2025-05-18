import express from 'express';
import { applyJob , getAppliedJobs,getApplicants, updateStatus, getAllApplicants, uploadResume, getPendingApplications, getInterviewApplications, scheduleInterview, updateInterview} from "../controllers/application.controller.js";
import { protect } from '../middleware/isAuthenticated.js';
import { singleUpload } from '../middleware/multer.js';
const router = express.Router();

router.route("/all/applicants").get(protect, getAllApplicants);
router.route("/apply/:id").post(protect, applyJob);
router.route("/get").get(protect, getAppliedJobs);
router.route("/status/:id/update").post(protect, updateStatus);
router.route("/upload/resume").post(protect, singleUpload,uploadResume);
router.route("/status/pending").get(getPendingApplications)


router.route("/interviews").get(protect, getInterviewApplications);
router.route("/:id/schedule").post(protect, scheduleInterview);
router.route("/:id/interview").patch(protect, updateInterview);
router.route("/:id/applicants").get(protect, getApplicants);

export default router;
