import express from 'express';
import {register, login , updateProfile, logout} from '../controllers/user.controller.js';
import authenticateToken from '../middleware/isAuthenticated.js';

const router = express.Router();

// Importing our controllers

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/profile/update").post(authenticateToken, updateProfile);
router.route("/logout").post(logout);

export default router;

