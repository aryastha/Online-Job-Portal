import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloud.js";
import { createActivity } from "./activity.controller.js";

//Register a new company
export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(401).json({
        message: "Company name is required",
        success: false,
      });
    }
    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(401).json({
        message: "Company already exists",
        success: false,
      });
    }
    company = await Company.create({
      name: companyName,
      userId: req.id,
    });

    // Create activity log for company registration
    await createActivity(
      'company_added',
      req.user.fullname,
      `New company registered: ${companyName}`,
      { companyId: company._id }
    );

    return res.status(201).json({
      message: "Company registered successfully.",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error: Failed to register company",
      success: false,
    });
  }
};

//Get all the companies
export const getAllCompanies = async (req, res) => {
  try {
    const userId = req.id;
    const userRole = req.user?.role?.toLowerCase(); // Convert role to lowercase for case-insensitive comparison
    
    console.log('User ID:', userId);
    console.log('User Role:', userRole);

    // If user is admin, return all companies
    if (userRole === 'admin') {
      const companies = await Company.find({})
        .populate('userId', 'fullname email')
        .sort({ createdAt: -1 });
      return res.json({
        companies,
        success: true,
      });
    }

    // For regular users (recruiters), return only their companies
    const companies = await Company.find({ userId })
      .populate('userId', 'fullname email')
      .sort({ createdAt: -1 });

    if (!companies || companies.length === 0) {
      return res.status(404).json({
        message: "No companies found",
        success: false,
      });
    }
    return res.json({
      companies,
      success: true,
    });
  } catch (error) {
    console.error('Error in getAllCompanies:', error);
    res.status(500).json({
      message: "Server Error: Cannot get all companies",
      error: error.message,
      success: false,
    });
  }
};

//Get a single company by ID
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "This is the company.",
      success: true,
      company,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error Cannot get CompanyById",
      success: false,
    });
  }
};

//update a company

export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;

    // cloudinary
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    const logo = cloudResponse.secure_url;

    console.log(name, description, website, location);

    const updateData = { name, description, website, location , logo};
    
    const companyId = req.params.id;

    const company = await Company.findByIdAndUpdate(
      companyId, //id of the document to update
      updateData, //new data to update
      { new: true, runValidators: true }
    );

    // Validate the file
    if (!file) {
      return res.status(400).json({
        message: "No file uploaded",
        success: false,
      });
    }

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    



    //update database company
    return res.status(200).json({
      message: "Company Updated successfully",
      success: true,
      company,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error cannot update Company",
      success: false,
    });
  }
};

//Delete a company
export const deleteCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const userRole = req.user?.role;

    // Find the company first to check ownership
    const company = await Company.findById(companyId);
    
    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    // Only allow admin or the company owner to delete
    if (userRole !== 'Admin' && company.userId.toString() !== req.id) {
      return res.status(403).json({
        message: "Not authorized to delete this company",
        success: false,
      });
    }

    // Delete the company
    await Company.findByIdAndDelete(companyId);

    return res.status(200).json({
      message: "Company deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error: Cannot delete company",
      success: false,
    });
  }
};
