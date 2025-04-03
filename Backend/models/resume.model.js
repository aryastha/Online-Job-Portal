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
  experience: String,
  education: String,
  summary: String,
  createdAt: { 
    type: Date, 
    default: Date.now,
    expires: 30 * 24 * 60 * 60 // Auto-delete after 30 days
  }
});

export const Resume = mongoose.model('Resume', resumeSchema);