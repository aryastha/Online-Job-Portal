import mongoose from "mongoose";
const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    interview:{
      scheduledAt:{
        type:Date,
      },
      location:{
        type:String,
      },
        notes:{
          type:String
      },
      interviewer:{
        type:String
      },
      feedback:{
        type: String
      },
      interviewStatus: {
        type: String,
        enum: ["scheduled", "completed", "cancelled"],
        default: "scheduled",
      },
    }
  },
  {
    timestamps: true,
  }
);

export const Application = mongoose.model("Application", applicationSchema);