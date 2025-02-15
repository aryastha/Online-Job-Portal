import express from 'express';
import { registerCompany,getAllCompanies,updateCompany,getCompanyById } from '../controllers/company.controller.js';
import authenticateToken from '../middleware/isAuthenticated.js';

const router = express.Router();

router.route("/register").post(authenticateToken, registerCompany);
router.route("/get").get(authenticateToken,getAllCompanies);
router.route("/get/:id").get(authenticateToken,getCompanyById);
router.route("/update/:id").put(authenticateToken,updateCompany);

export default router;