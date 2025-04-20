import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
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

export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId).populate({
      path: "bookmarks",
      populate: {
        path: "company",
        select: "name" // Only get company name
      }
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

// In your jobController.js
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
      job.savedBy = job.savedBy.filter(id => id.toString() !== userId.toString());
    }

    await job.save();
    
    res.json({ 
      success: true,
      isSaved: saved,
      savedCount: job.savedBy.length
    });

  } catch (error) {
    console.error("Error saving job:", error);
    res.status(500).json({ message: error.message });
  }
}; 


export const checkJobSavedStatus = async(req,res)=>{
  try{
    const userId = req.user._id;
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);

    if(!job){
      return res.status(404).json({message: "Job not found"});
    }

    const isSaved = job.savedBy.includes(userId);
    res.json({isSaved});


  }catch(error){
    console.error("Error checking saved status:", error);
    res.status(500).json({message: error.message});
  }
}

// export const getSavedJobs = async (req, res) => {
//   try {
//     const userId = req.id;

//     const user = await User.findById(userId).populate("bookmarks");

//     if (!user) {
//       return res.status(404).json({ message: "User not found", status: false });
//     }

//     return res.status(200).json({
//       savedJobs: user.bookmarks,
//       status: true,
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server Error", status: false });
//   }
// };


// export const saveJob = async(req, res) =>{
//   try{
//     const user = await User.findById(req.user.id);

//     if(!user.bookmarks.includes(req.params.jobId)){
//       user.savedJobs.push(req.params.jobId);
//       await user.save();
//       return res.json({success: true, message: "Job saved successfully"});
//     }

//     return res.status(400).json({
//       success:false,
//       message: "Something went wrong"
//     });

//   }catch(err){
//     res.status(500).json({
//       success: false,
//       message: "Error saving job"
//     })
//   }
// }

// const unsaveJob = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);

//     user.savedJobs = user.savedJobs.filter(
//       (jobId) => jobId.toString() !== req.params.jobId
//     );
//     await user.save();

//     res.json({ success: true, message: "Job removed from saved list" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Something went wrong" });
//   }
// };

