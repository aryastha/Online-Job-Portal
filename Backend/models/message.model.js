import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    // The conversation this message belongs to
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    
    // Who sent the message
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // The actual message content
    content: {
      type: String,
      required: true,
    },
    
    // Type of message (regular message or interview related)
    messageType: {
      type: String,
      enum: ["regular", "interview_request", "interview_response", "interview_update"],
      default: "regular",
    },
    
    // If this message is related to an interview
    relatedInterview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
    },
    
    // If this message is related to a job application
    relatedApplication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },
    
    // Message status
    status: {
      isRead: {
        type: Boolean,
        default: false,
      },
      readAt: {
        type: Date,
      },
    },
    
    // For file attachments (like resumes, documents)
    attachments: [{
      fileName: String,
      fileUrl: String,
      fileType: String,
    }],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Index for faster queries
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ relatedInterview: 1 });
messageSchema.index({ relatedApplication: 1 });

export const Message = mongoose.model("Message", messageSchema); 