import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { createActivity } from "./activity.controller.js";
//recruiter job posting
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

    // Get user details for activity log
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
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

    // Create activity log for job posting
    await createActivity(
      'job_posted',
      user.fullname,
      `New job posted: ${title} at ${job.company.name}`,
      { jobId: job._id, companyId }
    );

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

// Get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const userRole = req.user?.role?.toLowerCase();
    console.log('User Role in getAllJobs:', userRole);

    // For admin, return all jobs with full details
    if (userRole === 'admin') {
      const jobs = await Job.find({})
        .populate('company', 'name logo')
        .populate('created_by', 'fullname email')
        .populate('applications')
        .sort({ createdAt: -1 });

      return res.json({
        jobs,
        success: true,
      });
    }

    // For public access or employee access, return all active jobs
    if (!req.user || userRole === 'employee') {
      const jobs = await Job.find({})
        .populate('company', 'name logo')
        .populate('created_by', 'fullname email')
        .sort({ createdAt: -1 }); // Sort by newest first

      return res.json({
        jobs,
        success: true,
      });
    }

    // For recruiters, return only their jobs
    if (userRole === 'recruiter') {
      const jobs = await Job.find({ created_by: req.id })
        .populate('company', 'name logo')
        .populate('created_by', 'fullname email')
        .sort({ createdAt: -1 });

      return res.json({
        jobs,
        success: true,
      });
    }

    // Default response for unknown roles
    return res.status(403).json({
      message: "Unauthorized role",
      success: false
    });

  } catch (error) {
    console.error('Error in getAllJobs:', error);
    res.status(500).json({
      message: "Server Error: Cannot get all jobs",
      error: error.message,
      success: false,
    });
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

//recruiter job created
export const getRecruiterJobs = async (req, res) => {
  try {
    const recruiterId = req.id;
    const jobs = await Job.find({ created_by: recruiterId }).populate({
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
        status: false,
      });
    }

    // Check if already bookmarked
    const isBookmarked = job.bookmarkedBy.includes(userId);

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      isBookmarked
      ? {$pull: {bookmarkedBy: userId}}
      : {$addToSet: {bookmarkedBy: userId}},
      {new: true}
    )

    return res.status(200).json({
      message: isBookmarked ? "Bookmark removed" : "Job bookmarked",
      status: true,
      isBookmarked: !isBookmarked,
      bookmarkedBy: updatedJob.bookmarkedBy
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
      status: false,
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
        status: false,
      });
    }

    return res.status(200).json({
      jobs,
      status: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
      status: false,
    });
  }
};

export const saveJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        status: false,
      });
    }

    const user = await User.findById(userId);

    // Check if already saved
    const isSaved = job.savedBy.includes(userId);

    if (isSaved) {
      // Remove save
      await Job.findByIdAndUpdate(
        jobId,
        { $pull: { savedBy: userId } },
        { new: true }
      );
      await User.findByIdAndUpdate(
        userId,
        { $pull: { bookmarks: jobId } },
        { new: true }
      );
    } else {
      // Add save
      await Job.findByIdAndUpdate(
        jobId,
        { $addToSet: { savedBy: userId } },
        { new: true }
      );
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { bookmarks: jobId } },
        { new: true }
      );
    }

    return res.status(200).json({
      message: isSaved ? "Removed from saved jobs" : "Job saved for later",
      status: true,
      isSaved: !isSaved,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
      status: false,
    });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId).populate({
      path: "bookmarks",
      populate: {
        path: "company",
        select: "name", // Only get company name
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    return res.status(200).json({
      savedJobs: user.bookmarks,
      status: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};

export const toggleSaveJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const jobId = req.params.jobId;
    const { saved } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (saved) {
      // Add to savedBy if not already present
      if (!job.savedBy.includes(userId)) {
        job.savedBy.push(userId);
      }
    } else {
      // Remove from savedBy
      job.savedBy = job.savedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    await job.save();

    res.json({
      success: true,
      isSaved: saved,
      savedCount: job.savedBy.length,
    });
  } catch (error) {
    console.error("Error saving job:", error);
    res.status(500).json({ message: error.message });
  }
};

export const checkJobSavedStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const isSaved = job.savedBy.includes(userId);
    res.json({ isSaved });
  } catch (error) {
    console.error("Error checking saved status:", error);
    res.status(500).json({ message: error.message });
  }
};


//admin



//delete the job
export const deleteJob = async(req,res) =>{
  try{
    const jobId = req.params.id;
    const userRole = req.user?.role;

    //Find the job first to check ownership
    const job = await Job.findById(jobId);

    if (!job){
      return res.status(404).json({
        message: "Job not Found",
        success: false,
      })
    }

    //only admin or the job creator can delete the job
    if (userRole !== 'Admin' && job.created_by.toString() !== req.id){
      return res.status(403).json({
        message: "Not authorized to delete this job",
        success: false,
      })
    }
    //delete job 
    await Job.findByIdAndDelete(jobId);
    return res.status(200).json({
      message: "Job deleted successfully",
      success: true,
    })
  }catch(error){
    res.status(500).json({
      message: "Server Error: Cannot delete job",
      success: false,
    })
  }
}
