import express from "express";
import {
  register,
  login,
  updateProfile,
  logout,
  uploadResume,
  uploadProfilePhoto,
} from "../controllers/user.controller.js";
import authenticateToken from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

// Importing our controllers

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/profile/update").post(authenticateToken, updateProfile);

router
  .route("/profile/upload-resume")
  .post(authenticateToken, singleUpload, uploadResume);
router
  .route("/profile/upload-photo")
  .post(authenticateToken, singleUpload, uploadProfilePhoto);

router.route("/logout").post(logout);

export default router;
