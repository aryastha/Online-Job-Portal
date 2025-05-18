import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    // Participants in the conversation
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }],
    
    // The job this conversation is about (if any)
    relatedJob: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
    
    // The application this conversation is about (if any)
    relatedApplication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },
    
    // Last message in the conversation (for preview)
    lastMessage: {
      content: String,
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      timestamp: Date,
    },
    
    // Conversation status
    status: {
      isActive: {
        type: Boolean,
        default: true,
      },
      archivedBy: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        archivedAt: Date,
      }],
    },
    
    // Unread message counts for each participant
    unreadCounts: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      count: {
        type: Number,
        default: 0,
      },
    }],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
conversationSchema.index({ participants: 1 });
conversationSchema.index({ relatedJob: 1 });
conversationSchema.index({ relatedApplication: 1 });
conversationSchema.index({ "lastMessage.timestamp": -1 });

export const Conversation = mongoose.model("Conversation", conversationSchema); 