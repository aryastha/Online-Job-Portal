import express from 'express';
import { registerCompany, getAllCompanies, updateCompany, getCompanyById, deleteCompany } from '../controllers/company.controller.js';
import { protect, restrictTo } from '../middleware/isAuthenticated.js';
import { singleUpload } from '../middleware/multer.js';
const router = express.Router();

// Routes that require authentication
router.use(protect);

// Routes for all authenticated users
router.route("/get/:id").get(getCompanyById);

// Routes for recruiters and admins
router.route("/register").post(restrictTo('recruiter', 'admin'), registerCompany);
router.route("/get").get(getAllCompanies);
router.route("/all").get(getAllCompanies);
router.route("/update/:id").put(restrictTo('recruiter', 'admin'), singleUpload, updateCompany);
router.route("/delete/:id").delete(restrictTo('recruiter', 'admin'), deleteCompany);

export default router;