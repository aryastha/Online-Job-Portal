import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";

// Create a new conversation
export const createConversation = async (req, res) => {
  try {
    const { participants, relatedJob, relatedApplication } = req.body;
    const userId = req.user._id; // From auth middleware

    // Validate participants
    if (!participants || !Array.isArray(participants) || participants.length < 2) {
      return res.status(400).json({
        success: false,
        message: "At least two participants are required",
      });
    }

    // Check if participants exist
    const usersExist = await User.find({ _id: { $in: participants } });
    if (usersExist.length !== participants.length) {
      return res.status(400).json({
        success: false,
        message: "One or more participants do not exist",
      });
    }

    // Check if conversation already exists between these participants
    const existingConversation = await Conversation.findOne({
      participants: { $all: participants },
      relatedJob: relatedJob || null,
      relatedApplication: relatedApplication || null,
    });

    if (existingConversation) {
      return res.status(200).json({
        success: true,
        message: "Conversation already exists",
        conversation: existingConversation,
      });
    }

    // Create new conversation
    const conversation = await Conversation.create({
      participants,
      relatedJob,
      relatedApplication,
      unreadCounts: participants.map(userId => ({
        user: userId,
        count: 0,
      })),
    });

    // Populate basic details
    await conversation.populate([
      { path: "participants", select: "fullname email profile.profilePhoto" },
      { path: "relatedJob", select: "title company" },
      { path: "relatedApplication", select: "status" },
    ]);

    return res.status(201).json({
      success: true,
      message: "Conversation created successfully",
      conversation,
    });
  } catch (error) {
    console.error("Error in createConversation:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating conversation",
      error: error.message,
    });
  }
};

// Get all conversations for a user
export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const conversations = await Conversation.find({
      participants: userId,
      "status.isActive": true,
      "status.archivedBy.user": { $ne: userId },
    })
      .sort({ "lastMessage.timestamp": -1, updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate([
        { path: "participants", select: "fullname email profile.profilePhoto" },
        { path: "relatedJob", select: "title company" },
        { path: "relatedApplication", select: "status" },
        { path: "lastMessage.sender", select: "fullname" },
      ]);

    const total = await Conversation.countDocuments({
      participants: userId,
      "status.isActive": true,
      "status.archivedBy.user": { $ne: userId },
    });

    return res.status(200).json({
      success: true,
      conversations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error in getUserConversations:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching conversations",
      error: error.message,
    });
  }
};

// Get a single conversation with its messages
export const getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;
    const { page = 1, limit = 20 } = req.query;

    // Check if user is part of the conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found or access denied",
      });
    }

    // Get messages for this conversation
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("sender", "fullname email profile.profilePhoto");

    // Update unread count for this user
    await Conversation.updateOne(
      { _id: conversationId, "unreadCounts.user": userId },
      { $set: { "unreadCounts.$.count": 0 } }
    );

    // Populate conversation details
    await conversation.populate([
      { path: "participants", select: "fullname email profile.profilePhoto" },
      { path: "relatedJob", select: "title company" },
      { path: "relatedApplication", select: "status" },
    ]);

    return res.status(200).json({
      success: true,
      conversation,
      messages: messages.reverse(), // Return in chronological order
      totalPages: Math.ceil(messages.length / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error in getConversation:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching conversation",
      error: error.message,
    });
  }
};

// Archive a conversation
export const archiveConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findOneAndUpdate(
      {
        _id: conversationId,
        participants: userId,
      },
      {
        $push: {
          "status.archivedBy": {
            user: userId,
            archivedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found or access denied",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Conversation archived successfully",
      conversation,
    });
  } catch (error) {
    console.error("Error in archiveConversation:", error);
    return res.status(500).json({
      success: false,
      message: "Error archiving conversation",
      error: error.message,
    });
  }
};

// Get unread message count for a user
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId,
      "status.isActive": true,
      "status.archivedBy.user": { $ne: userId },
    }).select("unreadCounts");

    const totalUnread = conversations.reduce((total, conv) => {
      const userCount = conv.unreadCounts.find(
        (count) => count.user.toString() === userId.toString()
      );
      return total + (userCount ? userCount.count : 0);
    }, 0);

    return res.status(200).json({
      success: true,
      totalUnread,
    });
  } catch (error) {
    console.error("Error in getUnreadCount:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching unread count",
      error: error.message,
    });
  }
}; 