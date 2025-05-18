import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Interview must be associated with a job']
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Interview must have a candidate']
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Interview must have a recruiter']
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Interview must be associated with a company']
  },
  scheduledAt: {
    type: Date,
    required: [true, 'Interview must have a scheduled date and time']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'rejected_by_candidate', 'cancelled_by_recruiter', 'completed'],
      message: 'Status must be either: pending, confirmed, rejected_by_candidate, cancelled_by_recruiter, or completed'
    },
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
interviewSchema.index({ candidateId: 1, scheduledAt: 1 });
interviewSchema.index({ recruiterId: 1, scheduledAt: 1 });
interviewSchema.index({ companyId: 1, scheduledAt: 1 });
interviewSchema.index({ status: 1 });

// Prevent scheduling multiple interviews at the same time for the same candidate
interviewSchema.pre('save', async function(next) {
  if (!this.isModified('scheduledAt')) return next();

  const buffer = 30 * 60 * 1000; // 30 minutes buffer
  const startTime = new Date(this.scheduledAt.getTime() - buffer);
  const endTime = new Date(this.scheduledAt.getTime() + buffer);

  const existingInterview = await this.constructor.findOne({
    _id: { $ne: this._id },
    candidateId: this.candidateId,
    scheduledAt: { 
      $gte: startTime,
      $lte: endTime
    },
    status: { $nin: ['rejected_by_candidate', 'cancelled_by_recruiter'] }
  });

  if (existingInterview) {
    const err = new Error('Candidate already has an interview scheduled within 30 minutes of this time');
    next(err);
  }

  next();
});

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;
