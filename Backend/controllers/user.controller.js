import jwt from "jsonwebtoken";
// import pkg from 'jsonwebtoken';
// const {jwt} = pkg;

import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloud.js";
import { createActivity } from '../controllers/activity.controller.js';
dotenv.config();

export const register = async (req, res) => {
  try {
    const { fullname, email, password, phoneNumber, role } = req.body;
    console.log(fullname, email, password, phoneNumber, role);

    if (!fullname || !email || !password || !phoneNumber || !role) {
      return res.status(404).json({
        message: "Missing required fields",
        sucess: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(404).json({
        message: "User already exists",
        success: false,
      });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: "Profile image is required",
        success: false,
      });
    }

    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    //covert password into hashed
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
      profile: {
        profilePhoto: cloudResponse.secure_url,
      },
    });

    await newUser.save();

    console.log(newUser);

    await createActivity(
      'user_registered',
      newUser.fullname,
      `New user registered: ${newUser.email}`,
      { userId: newUser._id }
    );

    return res.status(200).json({
      message: `User is registered successfully ${fullname}`,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error register failed",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log(email, password, role);

    if (!email || !password || !role) {
      return res.status(404).json({
        message: "Missing required fields",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({
        message: "Incorrect password",
        success: false,
      });
    }

    if (user.role !== role) {
      return res.status(404).json({
        message: " Your role dont match to login",
        sucess: false,
      });
    }

    //generate token
    const tokenData = {
      userId: user.id,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    user = {
      _id: user.id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true, //prevent from client side access
        sameSite: "Strict",
      })
      .json({
        message: `Welcome back ${user.fullname}!`,
        user,
        success: true,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error login failed",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error logout failed",
      success: false,
    });
  }
};

// export const updateProfile = async (req, res) => {
//   try {
//     const { fullname, email, phoneNumber, bio, skills } = req.body;
//     const userId = req.id;
//     const user = await User.findById(userId);

//     if (!user) {
//       return res
//         .status(404)
//         .json({ message: "User not found", success: false });
//     }

//     // Process profile photo
//     if (req.file && req.file.fieldname === 'profilePhoto') {
//       const fileUri = getDataUri(req.file);
//       const result = await cloudinary.uploader.upload(fileUri.content, {
//         folder: 'profile_photos'
//       });
//       user.profile.profilePhoto = result.secure_url;
//     }

//     // Process resume
//     if (files?.file) {
//       const resume = files.file[0];
//       const fileUri = getDataUri(resume);
//       const result = await cloudinary.uploader.upload(fileUri.content, {
//         folder: "resumes",
//       });
//       user.profile.resume = result.secure_url;
//       user.profile.resumeOriginalname = resume.originalname;
//     }

//     // Update other fields
//     if (fullname) user.fullname = fullname;
//     if (email) user.email = email;
//     if (phoneNumber) user.phoneNumber = phoneNumber;
//     if (bio) user.profile.bio = bio;
//     if (skills) user.profile.skills = skills.split(",").map((s) => s.trim());

//     await user.save();

//     //return the updated user
//     const updatedUser = {
//       _id: user._id,
//       fullname: user.fullname,
//       email: user.email,
//       phoneNumber: user.phoneNumber,
//       role: user.role,
//       profile: {
//         bio: user.profile.bio,
//         skills: user.profile.skills,
//         resume: user.profile.resume,
//         resumeOriginalname: user.profile.resumeOriginalname,
//         profilePhoto: user.profile.profilePhoto,
//         company: user.profile.company
//       }
//     };

//     return res.status(200).json({
//       message: "Profile updated successfully",
//       user: updatedUser,
//       success: true,
//     });
//   } catch (error) {
//     console.error("Profile update error:", error);
//     return res.status(500).json({
//       message: error.message || "Profile update failed",
//       success: false,
//     });
//   }
// };

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const userId = req.id;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Process profile photo if provided in the request
    if (req.file && req.file.fieldname === "profilePhoto") {
      const fileUri = getDataUri(req.file);
      const result = await cloudinary.uploader.upload(fileUri.content, {
        folder: "profile_photos",
      });
      user.profile.profilePhoto = result.secure_url;
    }

    // Update other fields
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skills.split(",").map((s) => s.trim());

    await user.save();

    const updatedUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: {
        bio: user.profile.bio,
        skills: user.profile.skills,
        resume: user.profile.resume,
        resumeOriginalname: user.profile.resumeOriginalname,
        profilePhoto: user.profile.profilePhoto,
        company: user.profile.company,
      },
    };

    await createActivity(
      'profile_updated',
      user.fullname,
      `Profile updated: ${user.email}`,
      { userId: user._id }
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({
      message: error.message || "Profile update failed",
      success: false,
    });
  }
};

//upload resume
export const uploadResume = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
        success: false,
      });
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        message: "Only PDF or Word documents are allowed",
        success: false,
      });
    }

    const fileUri = getDataUri(req.file);
    const result = await cloudinary.uploader.upload(fileUri.content, {
      folder: "resumes",
      resource_type: 'raw'
    });

    // Initialize profile object if it doesn't exist
    if (!user.profile) {
      user.profile = {};
    }

    user.profile.resume = result.secure_url;
    user.profile.resumeOriginalname = req.file.originalname;
    await user.save();

    await createActivity(
      'resume_uploaded',
      user.fullname,
      `New resume uploaded: ${req.file.originalname}`,
      { userId: user._id }
    );

    return res.status(200).json({
      message: "Resume uploaded successfully",
      resumeUrl: result.secure_url,
      success: true,
    });
  } catch (error) {
    console.error("Resume upload error:", error);
    return res.status(500).json({
      message: error.message || "Resume upload failed",
      success: false,
    });
  }
};

//upload profile
export const uploadProfilePhoto = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
        success: false,
      });
    }

    // Validate file type
    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({
        message: "Only image files are allowed",
        success: false,
      });
    }

    const fileUri = getDataUri(req.file);
    const result = await cloudinary.uploader.upload(fileUri.content, {
      folder: "profile_photos",
      resource_type: "image",
    });

    // Initialize profile object if it doesn't exist
    if (!user.profile) {
      user.profile = {};
    }

    user.profile.profilePhoto = result.secure_url;
    await user.save();

    await createActivity(
      'profile_photo_updated',
      user.fullname,
      `Profile photo updated: ${result.secure_url}`,
      { userId: user._id }
    );

    return res.status(200).json({
      message: "Profile photo updated successfully",
      profilePhoto: result.secure_url,
      success: true,
    });
  } catch (error) {
    console.error("Profile photo upload error:", error);
    return res.status(500).json({
      message: error.message || "Profile photo upload failed",
      success: false,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await createActivity(
      'user_deleted',
      user.fullname,
      `User deleted: ${user.email}`,
      { userId: user._id }
    );

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const searchRegex = new RegExp(q, 'i');
    const users = await User.find({
      $or: [
        { fullname: searchRegex },
        { email: searchRegex },
      ],
    }).select('fullname email role profile.profilePhoto');

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('Error searching users:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search users',
    });
  }
};
