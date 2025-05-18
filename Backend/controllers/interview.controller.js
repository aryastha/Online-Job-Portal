import Interview from '../models/interview.model.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { Job } from "../models/job.model.js";

// Create a new interview
export const createInterview = async (req, res) => {
    try {
        const { jobId, candidateId, scheduledAt, duration, location, meetingLink, notes } = req.body;
        
        if (!jobId || !candidateId || !scheduledAt) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide all required fields'
            });
        }

        // Get the job to get the company ID
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                status: 'error',
                message: 'Job not found'
            });
        }

        const interview = await Interview.create({
            jobId,
            candidateId,
            recruiterId: req.user._id,
            companyId: job.company, // Get companyId from the job
            scheduledAt,
            duration: duration || 60,
            location: location || 'Online',
            meetingLink,
            notes,
            status: 'pending'
        });

        // Populate necessary fields for response
        const populatedInterview = await Interview.findById(interview._id)
            .populate('jobId', 'title company')
            .populate('companyId', 'name')
            .populate('candidateId', 'fullname email')
            .populate('recruiterId', 'fullname email');

        res.status(201).json({
            status: 'success',
            interview: populatedInterview
        });
    } catch (error) {
        console.error('Create interview error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to create interview'
        });
    }
};

// Get interviews for a candidate
export const getUserInterviews = catchAsync(async (req, res) => {
    const interviews = await Interview.find({ candidateId: req.params.userId })
        .populate('jobId', 'title company')
        .populate('companyId', 'name')
        .populate('recruiterId', 'name email')
        .populate('candidateId', 'name email')
        .sort({ scheduledAt: 1 });

    res.status(200).json({
        status: 'success',
        interviews
    });
});

// Get interviews for a recruiter
export const getRecruiterInterviews = catchAsync(async (req, res) => {
    const interviews = await Interview.find({ recruiterId: req.params.recruiterId })
        .populate('jobId', 'title company')
        .populate('companyId', 'name')
        .populate('recruiterId', 'name email')
        .populate('candidateId', 'name email')
        .sort({ scheduledAt: 1 });

    res.status(200).json({
        status: 'success',
        interviews
    });
});

// Get calendar view of interviews
export const getCalendarView = catchAsync(async (req, res) => {
    const userId = req.user._id;
    const userRole = req.user.role;

    let query = {};
    if (userRole === 'recruiter') {
        query = { recruiterId: userId };
    } else {
        query = { candidateId: userId };
    }

    const interviews = await Interview.find(query)
        .populate('jobId', 'title')
        .populate('companyId', 'name')
        .populate('candidateId', 'name')
        .populate('recruiterId', 'name')
        .sort({ scheduledAt: 1 });

    res.status(200).json({
        status: 'success',
        interviews
    });
});

// Get specific interview by ID
export const getInterviewById = catchAsync(async (req, res) => {
    const interview = await Interview.findById(req.params.id)
        .populate('jobId', 'title company')
        .populate('companyId', 'name')
        .populate('recruiterId', 'name email')
        .populate('candidateId', 'name email');

    if (!interview) {
        throw new AppError('No interview found with that ID', 404);
    }

    // Check if user has permission to view this interview
    const userId = req.user._id.toString();
    const isAuthorized = 
        interview.candidateId._id.toString() === userId ||
        interview.recruiterId._id.toString() === userId;

    if (!isAuthorized) {
        throw new AppError('You do not have permission to view this interview', 403);
    }

    res.status(200).json({
        status: 'success',
        interview
    });
});

// Update interview status
export const updateStatus = catchAsync(async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'rejected_by_candidate', 'cancelled_by_recruiter', 'completed'];
    
    if (!validStatuses.includes(status)) {
        throw new AppError('Invalid status', 400);
    }

    const interview = await Interview.findById(req.params.id);
    
    if (!interview) {
        throw new AppError('No interview found with that ID', 404);
    }

    // Check authorization
    const userId = req.user._id.toString();
    const isRecruiter = req.user.role === 'recruiter';
    const isCandidate = interview.candidateId.toString() === userId;

    // Validate status change permissions
    if (isRecruiter) {
        if (!['cancelled_by_recruiter', 'completed'].includes(status)) {
            throw new AppError('Recruiters can only cancel or complete interviews', 403);
        }
    } else if (isCandidate) {
        if (!['confirmed', 'rejected_by_candidate'].includes(status)) {
            throw new AppError('Candidates can only confirm or reject interviews', 403);
        }
    } else {
        throw new AppError('You do not have permission to update this interview', 403);
    }

    interview.status = status;
    await interview.save();

    res.status(200).json({
        status: 'success',
        interview
    });
});

// Delete interview (Recruiter only)
export const deleteInterview = catchAsync(async (req, res) => {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
        throw new AppError('No interview found with that ID', 404);
    }

    // Only allow deletion if interview is pending and by the recruiter who created it
    if (interview.status !== 'pending') {
        throw new AppError('Only pending interviews can be deleted', 400);
    }

    if (interview.recruiterId.toString() !== req.user._id.toString()) {
        throw new AppError('You can only delete interviews you have scheduled', 403);
    }

    await interview.deleteOne();

    res.status(204).json({
        status: 'success',
        data: null
    });
});

// Get interview statistics for recruiter dashboard
export const getRecruiterInterviewStats = async (req, res) => {
    try {
        const recruiterId = req.user._id;
        
        // Get total interviews count
        const totalInterviews = await Interview.countDocuments({ 
            recruiterId,
        });

        // Get upcoming interviews (pending or confirmed, and scheduled in the future)
        const upcomingInterviews = await Interview.find({
            recruiterId,
            status: { $in: ['pending', 'confirmed'] },
            scheduledAt: { $gt: new Date() }
        })
        .populate('jobId', 'title')
        .populate('candidateId', 'fullname email')
        .populate('companyId', 'name')
        .sort({ scheduledAt: 1 })
        .limit(5); // Limit to 5 upcoming interviews

        // Get interviews by status
        const interviewsByStatus = await Interview.aggregate([
            { $match: { recruiterId: recruiterId } },
            { $group: {
                _id: '$status',
                count: { $sum: 1 }
            }}
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                totalInterviews,
                upcomingInterviews,
                interviewsByStatus: Object.fromEntries(
                    interviewsByStatus.map(item => [item._id, item.count])
                )
            }
        });
    } catch (error) {
        console.error('Get interview stats error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to get interview statistics'
        });
    }
};