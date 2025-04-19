import { Job } from "../models/job.model.js";
//Admin job posting
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;
    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
    });
    res.status(201).json({
      message: "Job posted successfully.",
      job,
      status: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};

//Users
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });

    if (!jobs) {
      return res.status(404).json({ message: "No jobs found", status: false });
    }
    return res.status(200).json({ jobs, status: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};

//Users
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
    });
    if (!job) {
      return res.status(404).json({ message: "Job not found", status: false });
    }
    return res.status(200).json({ job, status: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};

//Admin job created
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId }).populate({
      path: "company",
      sort: { createdAt: -1 },
    });
    if (!jobs) {
      return res.status(404).json({ message: "No jobs found", status: false });
    }
    return res.status(200).json({ jobs, status: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};


// Bookmark a job
export const bookmarkJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ 
        message: "Job not found", 
        status: false 
      });
    }

    // Check if already bookmarked
    const isBookmarked = job.bookmarkedBy.includes(userId);
    
    if (isBookmarked) {
      // Remove bookmark
      await Job.findByIdAndUpdate(
        jobId,
        { $pull: { bookmarkedBy: userId } },
        { new: true }
      );
    } else {
      // Add bookmark
      await Job.findByIdAndUpdate(
        jobId,
        { $addToSet: { bookmarkedBy: userId } },
        { new: true }
      );
    }

    return res.status(200).json({
      message: isBookmarked ? "Bookmark removed" : "Job bookmarked",
      status: true,
      isBookmarked: !isBookmarked
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      message: "Server Error", 
      status: false 
    });
  }
};

// Get user's bookmarked jobs
export const getBookmarkedJobs = async (req, res) => {
  try {
    const userId = req.id;

    const jobs = await Job.find({ bookmarkedBy: userId })
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ 
        message: "No bookmarked jobs found", 
        status: false 
      });
    }

    return res.status(200).json({ 
      jobs, 
      status: true 
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      message: "Server Error", 
      status: false 
    });
  }
};

// In job.controller.js
export const saveJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ 
        message: "Job not found", 
        status: false 
      });
    }

    // Check if already saved
    const isSaved = job.savedBy.includes(userId);
    
    if (isSaved) {
      // Remove save
      await Job.findByIdAndUpdate(
        jobId,
        { $pull: { savedBy: userId } },
        { new: true }
      );
    } else {
      // Add save
      await Job.findByIdAndUpdate(
        jobId,
        { $addToSet: { savedBy: userId } },
        { new: true }
      );
    }

    return res.status(200).json({
      message: isSaved ? "Removed from saved jobs" : "Job saved for later",
      status: true,
      isSaved: !isSaved
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      message: "Server Error", 
      status: false 
    });
  }
};


