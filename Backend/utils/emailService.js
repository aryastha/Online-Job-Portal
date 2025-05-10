// utils/emailService.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendInterviewEmail = async (application) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: application.applicant.email,
      subject: `Interview Scheduled for ${application.job.title}`,
      html: `
        <div>
          <h2>Interview Scheduled</h2>
          <p>Hello ${application.applicant.fullname},</p>
          <p>Your interview for the position of <strong>${application.job.title}</strong> 
          at <strong>${application.job.company.name}</strong> has been scheduled.</p>
          
          <h3>Interview Details:</h3>
          <ul>
            <li><strong>Date & Time:</strong> ${new Date(application.interview.scheduledAt).toLocaleString()}</li>
            <li><strong>Location:</strong> ${application.interview.location}</li>
            <li><strong>Interviewer:</strong> ${application.interview.interviewer}</li>
          </ul>
          
          ${application.interview.notes ? `<p><strong>Additional Notes:</strong> ${application.interview.notes}</p>` : ''}
          
          <p>Best regards,<br>The Hiring Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending interview email:', error);
    throw error;
  }
};