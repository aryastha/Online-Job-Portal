import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({

  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',   //links each resume to the user
    required: true 
  },

  fullName: { type: String, required: true },

  email: { type: String, required: true },
  photoUrl: String,     //Cloudinary photo url
  photoPublicId: String,   //Cloudinary photo public
  skills: [String],
  summary: String,
  workExperiences: [{
    company: String,
    position: String,
    startDate: String,
    endDate: String,
    description: String,
    current: Boolean
  }],
  educations: [{
    institution: String,
    degree: String,
    fieldOfStudy: String,
    startDate: String,
    endDate: String,
    achievements: String
  }],
  createdAt: { 
    type: Date, 
    default: Date.now,
    expires: 30 * 24 * 60 * 60 // Auto-delete after 30 days
  }
});

export const Resume = mongoose.model('Resume', resumeSchema);