import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import cloudinary from "../utils/cloud.js";

//apply job
export const applyJob = async (req, res) => {
  try {
    console.log("Request body:", req.body); 

    const userId = req.id;
    const jobId = req.params.id;
    const { resumeUrl } = req.body;

    // Validate inputs
    if (!resumeUrl) {
      console.log("Missing resumeUrl in:", req.body); 
      return res.status(400).json({ 
        success: false,
        message: "Resume URL is required" 
      });
    }

    if (!jobId) {
      return res
        .status(400)
        .json({ message: "Invalid job id", success: false });
    }
    console.log(jobId);
    // check if the user already has applied for this job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }
    //check if the job exists or not
    const job = await Job.findById(jobId);

    console.log(job);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }
    // create a new application

    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
      status: "pending",
      resume: resumeUrl
    });

    if (!job.applications) {
      job.applications = []; 
    }

    job.applications.push(newApplication._id);
    await job.save();

    //return the job data with populated applications
    const updatedJob = await Job.findById(jobId)
    .populate({
      path: "applications",
      match: {applicant: userId},
      select: "status"
    });

    return res
      .status(201)
      .json({ message: "Application submitted", success: true , job: updatedJob});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

//get applied jobs for users
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: { path: "company", options: { sort: { createdAt: -1 } } },
      });
    if (!application) {
      return res
        .status(404)
        .json({ message: "No applications found", success: false });
    }

    return res.status(200).json({ application, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

//get the applicants
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: { path: "applicant", options: { sort: { createdAt: -1 } } },
    });
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

//get all applicants
export const getAllApplicants = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("applicant")
      .populate({
        path: "job",
        populate: { path: "company" },
      });

    res.status(200).json({ applications });
  } catch (error) {
    console.error("Error in getAllApplicants:", error);
    res
      .status(500)
      .json({ message: "Error fetching applicants", error: error.message });
  }
};

//update the status
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    if (!status) {
      return res.status(400).json({
        message: "status is required",
        success: false,
      });
    }

    // find the application by applicantion id
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    // update the status
    application.status = status.toLowerCase();
    await application.save();

    return res
      .status(200)
      .json({ message: "Application status updated", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};


//handles application upload for job
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: "No file uploaded" 
      });
    }

    // Convert buffer to base64 for Cloudinary
    const fileBase64 = req.file.buffer.toString('base64');
    const fileUri = `data:${req.file.mimetype};base64,${fileBase64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileUri, {
      resource_type: 'auto',
      folder: 'resumes'
    });

    return res.status(200).json({
      success: true,
      url: result.secure_url,
      message: "Resume uploaded successfully"
    });

  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ 
      success: false,
      message: error.message || "Internal server error" 
    });
  }
};


// Only fetches pending applications
export const getPendingApplications = async (req, res) => {
  try {
    const pendingApplications = await Application.find({ status: "pending" })
      .populate("job", "title company") // populate job title and company
      .populate({
        path: "job",
        populate: {
          path: "company",
          select: "name",
        },
      })
      .populate("applicant", "name email") // populate applicant details
      .sort({ createdAt: -1 }); 

    res.status(200).json({ success: true, data: pendingApplications });
  } catch (error) {
    console.error("Error fetching pending applications:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// Schedule an interview
export const scheduleInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { scheduledAt, location, notes, interviewer } = req.body;

    const application = await Application.findById(id)
      .populate('applicant', 'email fullname')
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name' }
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Update application with interview details
    application.status = "interview";
    application.interview = {
      scheduledAt,
      location: location || "Online",
      notes,
      interviewer,
      status: "scheduled",
    };

    await application.save();

    // Here you would typically send an email notification
    // For example: await sendInterviewEmail(application);

    return res.status(200).json({
      success: true,
      message: "Interview scheduled successfully",
      application,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to schedule interview",
      error: error.message,
    });
  }
};

// Get applications with interview status
export const getInterviewApplications = async (req, res) => {
  try {
    const applications = await Application.find({ "interview.status": "scheduled" })
      .populate("applicant", "fullname email")
      .populate({
        path: "job",
        select: "title",
        populate: { path: "company", select: "name" },
      })
      .sort({ "interview.scheduledAt": 1 }); // Sort by interview date

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch interview applications",
    });
  }
};

// Update interview details
export const updateInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const application = await Application.findByIdAndUpdate(
      id,
      { $set: { interview: updateData } },
      { new: true }
    )
      .populate("applicant", "fullname email")
      .populate({
        path: "job",
        select: "title",
        populate: { path: "company", select: "name" },
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Interview updated successfully",
      application,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update interview",
    });
  }
};