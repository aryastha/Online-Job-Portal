import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'user_registered',
      'job_posted',
      'company_added',
      'application_submitted',
      'user_deleted',
      'job_deleted',
      'company_updated',
      'user_updated',
      'profile_updated',
      'resume_uploaded',
      'profile_photo_updated'
    ]
  },
  user: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index for faster queries
activitySchema.index({ time: -1 });
activitySchema.index({ type: 1 });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity; 