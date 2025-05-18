import express from "express";
import {
  createConversation,
  getUserConversations,
  getConversation,
  archiveConversation,
  getUnreadCount,
} from "../controllers/conversation.controller.js";
import {
  sendMessage,
  markMessagesAsRead,
  getMessages,
  deleteMessage,
} from "../controllers/message.controller.js";
import authenticateToken from "../middleware/isAuthenticated.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Conversation routes
router.post("/conversations", createConversation);
router.get("/conversations", getUserConversations);
router.get("/conversations/:conversationId", getConversation);
router.post("/conversations/:conversationId/archive", archiveConversation);
router.get("/conversations/unread/count", getUnreadCount);

// Message routes
router.post("/messages", sendMessage);
router.get("/conversations/:conversationId/messages", getMessages);
router.post("/conversations/:conversationId/messages/read", markMessagesAsRead);
router.delete("/messages/:messageId", deleteMessage);

export default router; 