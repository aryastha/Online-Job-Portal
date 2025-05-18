import express from "express";
import {
  register,
  login,
  updateProfile,
  logout,
  uploadResume,
  uploadProfilePhoto,
  getAllUsers,
  deleteUser,
  searchUsers,
} from "../controllers/user.controller.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { singleUpload } from "../middleware/multer.js";
import { getActivities } from '../controllers/activity.controller.js';
import { protect, restrictTo } from '../middleware/isAuthenticated.js';
import {
    getRecruiterProfile,
    updateRecruiterProfile,
    uploadRecruiterProfileImage
} from '../controllers/recruiter.controller.js';

const router = express.Router();

// Auth routes
router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").post(logout);

// User profile routes
router.route("/profile/update").post(protect, updateProfile);
router.route("/profile/upload-resume").post(protect, singleUpload, uploadResume);
router.route("/profile/upload-photo").post(protect, singleUpload, uploadProfilePhoto);

// Admin routes
router.route("/all-users").get(protect, restrictTo('Admin', 'admin'), getAllUsers);
router.route("/delete/:userId").delete(protect, restrictTo('Admin', 'admin'), deleteUser);
router.route("/search").get(protect, restrictTo('Admin', 'admin'), searchUsers);
router.get('/activities', protect, restrictTo('Admin', 'admin'), getActivities);

// Recruiter profile routes
router.get('/recruiter/profile', protect, restrictTo('Recruiter', 'recruiter'), getRecruiterProfile);
router.put('/recruiter/profile', protect, restrictTo('Recruiter', 'recruiter'), updateRecruiterProfile);
router.post('/recruiter/profile/image', 
    protect, 
    restrictTo('Recruiter', 'recruiter'),
    singleUpload,
    uploadRecruiterProfileImage
);

export default router;
