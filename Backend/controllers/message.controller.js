import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js";
import { User } from "../models/user.model.js";

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, content, messageType = "regular", attachments = [] } = req.body;
    const senderId = req.user._id;

    // Validate conversation exists and user is a participant
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: senderId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found or access denied",
      });
    }

    // Create the message
    const message = await Message.create({
      conversationId,
      sender: senderId,
      content,
      messageType,
      attachments,
    });

    // Update conversation's last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: {
        content,
        sender: senderId,
        timestamp: new Date(),
      },
      // Increment unread count for all participants except sender
      $inc: {
        "unreadCounts.$[elem].count": 1,
      },
    }, {
      arrayFilters: [{ "elem.user": { $ne: senderId } }],
    });

    // Populate sender details
    await message.populate("sender", "fullname email profile.profilePhoto");

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return res.status(500).json({
      success: false,
      message: "Error sending message",
      error: error.message,
    });
  }
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    // Verify user is part of the conversation
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

    // Mark all unread messages as read
    await Message.updateMany(
      {
        conversationId,
        sender: { $ne: userId },
        "status.isRead": false,
      },
      {
        $set: {
          "status.isRead": true,
          "status.readAt": new Date(),
        },
      }
    );

    // Reset unread count for this user
    await Conversation.updateOne(
      { _id: conversationId, "unreadCounts.user": userId },
      { $set: { "unreadCounts.$.count": 0 } }
    );

    return res.status(200).json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    console.error("Error in markMessagesAsRead:", error);
    return res.status(500).json({
      success: false,
      message: "Error marking messages as read",
      error: error.message,
    });
  }
};

// Get messages for a conversation
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;
    const { page = 1, limit = 20 } = req.query;

    // Verify user is part of the conversation
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

    // Get messages with pagination
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("sender", "fullname email profile.profilePhoto");

    const total = await Message.countDocuments({ conversationId });

    return res.status(200).json({
      success: true,
      messages: messages.reverse(), // Return in chronological order
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
    });
  } catch (error) {
    console.error("Error in getMessages:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching messages",
      error: error.message,
    });
  }
};

// Delete a message (soft delete)
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findOne({
      _id: messageId,
      sender: userId, // Only sender can delete
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found or access denied",
      });
    }

    // Soft delete by updating content
    message.content = "This message was deleted";
    message.status.isDeleted = true;
    await message.save();

    // Update conversation's last message if this was the last message
    const conversation = await Conversation.findById(message.conversationId);
    if (conversation.lastMessage.sender.toString() === messageId) {
      const lastMessage = await Message.findOne({ conversationId: message.conversationId })
        .sort({ createdAt: -1 })
        .select("content sender createdAt");

      if (lastMessage) {
        conversation.lastMessage = {
          content: lastMessage.content,
          sender: lastMessage.sender,
          timestamp: lastMessage.createdAt,
        };
        await conversation.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteMessage:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting message",
      error: error.message,
    });
  }
}; 