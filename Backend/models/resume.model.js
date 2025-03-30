import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  photoUrl: String,
  photoPublicId: String,
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