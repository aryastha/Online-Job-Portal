import { User } from '../models/user.model.js';
import Interview from '../models/interview.model.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import nodemailer from 'nodemailer';

// Configure nodemailer with environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send interview notification email
export const sendInterviewNotification = async (req, res) => {
  try {
    const { interviewId } = req.body;

    if (!interviewId) {
      return res.status(400).json({
        status: 'error',
        message: 'Interview ID is required'
      });
    }

    const interview = await Interview.findById(interviewId)
      .populate('jobId', 'title')
      .populate('candidateId', 'fullname email')
      .populate('recruiterId', 'fullname email')
      .populate('companyId', 'name');

    if (!interview) {
      return res.status(404).json({
        status: 'error',
        message: 'Interview not found'
      });
    }

    // Email to candidate
    const candidateEmail = {
      from: process.env.EMAIL_USER,
      to: interview.candidateId.email,
      subject: `Interview Scheduled - ${interview.jobId.title} at ${interview.companyId.name}`,
      html: `
        <h2>Interview Scheduled</h2>
        <p>Dear ${interview.candidateId.fullname},</p>
        <p>An interview has been scheduled for the position of <strong>${interview.jobId.title}</strong> at ${interview.companyId.name}.</p>
        <p><strong>Details:</strong></p>
        <ul>
          <li>Date & Time: ${new Date(interview.scheduledAt).toLocaleString()}</li>
          <li>Duration: ${interview.duration} minutes</li>
          <li>Location: ${interview.location}</li>
          ${interview.meetingLink ? `<li>Meeting Link: <a href="${interview.meetingLink}">${interview.meetingLink}</a></li>` : ''}
        </ul>
        ${interview.notes ? `<p><strong>Additional Notes:</strong> ${interview.notes}</p>` : ''}
        <p>Please confirm your attendance by accepting the interview in your dashboard.</p>
        <p>Best regards,<br>${interview.recruiterId.fullname}</p>
      `
    };

    // Email to recruiter
    const recruiterEmail = {
      from: process.env.EMAIL_USER,
      to: interview.recruiterId.email,
      subject: `Interview Confirmation - ${interview.jobId.title} with ${interview.candidateId.fullname}`,
      html: `
        <h2>Interview Scheduled</h2>
        <p>Dear ${interview.recruiterId.fullname},</p>
        <p>You have successfully scheduled an interview for the position of <strong>${interview.jobId.title}</strong>.</p>
        <p><strong>Details:</strong></p>
        <ul>
          <li>Candidate: ${interview.candidateId.fullname}</li>
          <li>Date & Time: ${new Date(interview.scheduledAt).toLocaleString()}</li>
          <li>Duration: ${interview.duration} minutes</li>
          <li>Location: ${interview.location}</li>
          ${interview.meetingLink ? `<li>Meeting Link: <a href="${interview.meetingLink}">${interview.meetingLink}</a></li>` : ''}
        </ul>
        ${interview.notes ? `<p><strong>Notes:</strong> ${interview.notes}</p>` : ''}
      `
    };

    // Send emails
    await Promise.all([
      transporter.sendMail(candidateEmail),
      transporter.sendMail(recruiterEmail)
    ]);

    res.status(200).json({
      status: 'success',
      message: 'Interview notifications sent successfully'
    });
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to send notifications'
    });
  }
}; 