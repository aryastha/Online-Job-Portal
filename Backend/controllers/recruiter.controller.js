import { User } from '../models/user.model.js';
import { Job } from '../models/job.model.js';
import { Application } from '../models/application.model.js';
import Interview  from '../models/interview.model.js';
import { catchAsync } from '../utils/catchAsync.js';
import getDataUri from "../utils/datauri.js";
import cloudinary from '../utils/cloud.js';
import { createActivity } from './activity.controller.js';
import fs from 'fs';

// Get recruiter profile
export const getRecruiterProfile = catchAsync(async (req, res) => {
    const recruiterId = req.user._id;
    
    const recruiter = await User.findById(recruiterId)
        .select('fullname email phone bio location skills experience education profileImage socialLinks')
        .lean();

    if (!recruiter) {
        return res.status(404).json({
            status: 'error',
            message: 'Recruiter not found'
        });
    }

    res.status(200).json({
        status: 'success',
        data: recruiter
    });
});

// Update recruiter profile
export const updateRecruiterProfile = catchAsync(async (req, res) => {
    const { fullname, email, phoneNumber, bio, companyName, position } = req.body;
    const recruiterId = req.user._id;

    const updatedProfile = await User.findByIdAndUpdate(
        recruiterId,
        {
            fullname,
            email,
            phoneNumber,
            'profile.bio': bio,
            'profile.company': companyName,
            'profile.position': position
        },
        {
            new: true,
            runValidators: true
        }
    ).select('-password');

    if (!updatedProfile) {
        return res.status(404).json({
            status: 'error',
            message: 'Profile not found'
        });
    }

    res.status(200).json({
        status: 'success',
        data: updatedProfile
    });
});

// Upload profile image
export const uploadRecruiterProfileImage = async (req, res) => {
    try {
        const recruiterId = req.user._id;
        const recruiter = await User.findById(recruiterId);

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
            folder: "recruiter_profile_photos",
            resource_type: "image",
        });

        // Update user profile with new image
        recruiter.profileImage = {
            public_id: result.public_id,
            url: result.secure_url
        };
        await recruiter.save();

        // Create activity log
        await createActivity(
            'profile_photo_updated',
            recruiter.fullname,
            `Recruiter profile photo updated: ${result.secure_url}`,
            { userId: recruiter._id }
        );

        res.status(200).json({
            status: 'success',
            message: "Profile photo updated successfully",
            data: recruiter
        });
    } catch (error) {
        console.error("Profile photo upload error:", error);
        res.status(500).json({
            status: 'error',
            message: error.message || "Profile photo upload failed"
        });
    }
};

// Upload recruiter photo
export const uploadRecruiterPhoto = catchAsync(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            status: 'error',
            message: 'Please upload a file'
        });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'recruiter_photos'
    });

    // Delete the file from local storage
    fs.unlinkSync(req.file.path);

    // Update user profile with new photo
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            'profile.profilePhoto': result.secure_url
        },
        { new: true }
    ).select('-password');

    res.status(200).json({
        status: 'success',
        data: updatedUser
    });
});

// Get recruiter applications
export const getRecruiterApplications = catchAsync(async (req, res) => {
    const recruiterId = req.user._id;

    // Get all jobs posted by the recruiter
    const jobs = await Job.find({ created_by: recruiterId });
    const jobIds = jobs.map(job => job._id);

    // Get all applications for these jobs with populated references
    const applications = await Application.find({
        job: { $in: jobIds }
    }).populate([
        {
            path: 'job',
            select: 'title company'
        },
        {
            path: 'applicant',
            select: 'fullname email profile'
        }
    ]);

    // Calculate application statistics
    const applicationsByStatus = {
        pending: applications.filter(app => app.status === 'pending').length,
        accepted: applications.filter(app => app.status === 'accepted').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
        interviewing: applications.filter(app => app.status === 'interviewing').length
    };

    // Get applications over time (last 7 days)
    const last7Days = [...Array(7)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
    }).reverse();

    const applicationsOverTime = last7Days.map(date => ({
        date,
        count: applications.filter(app => 
            app.createdAt.toISOString().split('T')[0] === date
        ).length
    }));

    res.status(200).json({
        status: 'success',
        data: {
            applications,
            totalApplications: applications.length,
            applicationsByStatus,
            applicationsOverTime
        }
    });
});

// Get recruiter interview stats
export const getRecruiterInterviewStats = catchAsync(async (req, res) => {
    const recruiterId = req.user._id;

    const interviews = await Interview.find({ recruiterId });

    const stats = {
        totalInterviews: interviews.length,
        upcomingInterviews: interviews.filter(i => 
            i.status === 'confirmed' && new Date(i.scheduledAt) > new Date()
        ).length,
        completedInterviews: interviews.filter(i => i.status === 'completed').length
    };

    res.status(200).json({
        status: 'success',
        stats
    });
});

// Get recruiter analytics
export const getRecruiterAnalytics = catchAsync(async (req, res) => {
    const recruiterId = req.user._id;

    // Get all jobs by the recruiter
    const jobs = await Job.find({ created_by: recruiterId });
    const jobIds = jobs.map(job => job._id);

    // Get all applications for these jobs
    const applications = await Application.find({
        job: { $in: jobIds }
    });

    // Applications by status
    const applicationsByStatus = [
        { name: 'Pending', value: applications.filter(app => app.status === 'pending').length },
        { name: 'Accepted', value: applications.filter(app => app.status === 'accepted').length },
        { name: 'Rejected', value: applications.filter(app => app.status === 'rejected').length }
    ];

    // Applications over time (last 7 days)
    const last7Days = [...Array(7)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
    }).reverse();

    const applicationsOverTime = last7Days.map(date => ({
        date,
        applications: applications.filter(app => 
            app.createdAt.toISOString().split('T')[0] === date
        ).length
    }));

    // Jobs by type
    const jobsByType = {};
    jobs.forEach(job => {
        jobsByType[job.jobType] = (jobsByType[job.jobType] || 0) + 1;
    });

    const jobsByTypeArray = Object.entries(jobsByType).map(([name, value]) => ({
        name,
        value
    }));

    // Interview status distribution
    const interviews = await Interview.find({ recruiterId });
    const interviewsByStatus = [
        { name: 'Pending', value: interviews.filter(i => i.status === 'pending').length },
        { name: 'Confirmed', value: interviews.filter(i => i.status === 'confirmed').length },
        { name: 'Completed', value: interviews.filter(i => i.status === 'completed').length },
        { name: 'Cancelled', value: interviews.filter(i => 
            i.status === 'rejected_by_candidate' || i.status === 'cancelled_by_recruiter'
        ).length }
    ];

    res.status(200).json({
        status: 'success',
        data: {
            applicationsByStatus,
            applicationsOverTime,
            jobsByType: jobsByTypeArray,
            interviewsByStatus
        }
    });
});

export const getRecruiterStats = catchAsync(async (req, res) => {
    const recruiterId = req.user._id;

    // Get all jobs posted by the recruiter
    const jobs = await Job.find({ created_by: recruiterId });
    const jobIds = jobs.map(job => job._id);

    // Get all applications for these jobs
    const applications = await Application.find({
        job: { $in: jobIds }
    }).populate('job');

    // Get interviews
    const interviews = await Interview.find({
        recruiterId: recruiterId
    });

    const stats = {
        totalJobs: jobs.length,
        activeJobs: jobs.filter(job => !job.isClosed).length,
        totalApplications: applications.length,
        pendingApplications: applications.filter(app => app.status === 'pending').length,
        upcomingInterviews: interviews.filter(i => 
            i.status === 'scheduled' && new Date(i.scheduledAt) > new Date()
        ).length
    };

    res.status(200).json({
        status: 'success',
        data: stats
    });
}); 