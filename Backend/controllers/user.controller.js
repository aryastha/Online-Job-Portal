import jwt from "jsonwebtoken";
// import pkg from 'jsonwebtoken';
// const {jwt} = pkg;

import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloud.js";
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

    //covert password into hashed
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
    });

    await newUser.save();

    console.log(newUser);
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

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;

    console.log(fullname, email, phoneNumber, bio, skills);

    const userId = req.id; //from middleware
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Validate the file
    if (!file) {
      return res.status(400).json({
        message: "No file uploaded",
        success: false,
      });
    }

    //Cloudinary upload
    const fileUri = getDataUri(file);
    const cloudinaryResponse = await cloudinary.uploader.upload(fileUri.content); // Uploads the Base64 string to Cloudinary.




    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    let skillsArray = [];
    if (skills) {
      skillsArray = skills.split(",");
    }

    //update database
    if (fullname) {
      user.fullname = fullname;
    }
    if (email) {
      user.email = email;
    }
    if (phoneNumber) {
      user.phoneNumber = phoneNumber;
    }
    if (bio) {
      user.profile.bio = bio;
    }
    if (skills) {
      user.profile.skills = skillsArray;
    }
    if(cloudinaryResponse){
      user.profile.resume = cloudinaryResponse.secure_url; //Saves the resume link in MongoDB instead of storing the file directly.
      user.profile.resumeOriginalname = file.originalname; //tores the original filename (e.g., "resume.pdf").
    }

    await user.save();

    const updatedUser = {
      _id: user.id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      profile: user.profile,  
    };

    return res.status(200).json({
      message: `Profile updated successfully ${fullname}`,
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error update profile failed",
      success: false,
    });
  }
};
