import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MESSAGE_API_ENDPOINT } from '@/utils/data';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { Send, Paperclip, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

const MessageThread = ({ conversation, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useSelector((store) => store.auth);
  const { toast } = useToast();
  const messagesEndRef = useRef(null);
  const scrollAreaRef = useRef(null);

  // Fetch messages
  const fetchMessages = async (pageNum = 1, append = false) => {
    try {
      const response = await axios.get(
        `${MESSAGE_API_ENDPOINT}/conversations/${conversation._id}/messages?page=${pageNum}&limit=20`,
        { withCredentials: true }
      );

      if (response.data.success) {
        const newMessages = response.data.messages;
        setMessages(prev => 
          append ? [...prev, ...newMessages] : newMessages
        );
        setHasMore(newMessages.length === 20);
        setPage(pageNum);

        // Mark messages as read
        if (!append) {
          markMessagesAsRead();
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async () => {
    try {
      await axios.post(
        `${MESSAGE_API_ENDPOINT}/conversations/${conversation._id}/messages/read`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Send new message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const response = await axios.post(
        `${MESSAGE_API_ENDPOINT}/messages`,
        {
          conversationId: conversation._id,
          content: newMessage.trim(),
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Add sender information and ensure timestamp is valid
        const newMessageWithSender = {
          ...response.data.message,
          sender: {
            _id: user._id,
            fullname: user.fullname,
            profile: user.profile
          },
          timestamp: new Date().toISOString() // Ensure timestamp is valid
        };
        setMessages(prev => [newMessageWithSender, ...prev]);
        setNewMessage('');
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  // Format timestamp safely
  const formatTimestamp = (timestamp) => {
    try {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return '';
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return '';
    }
  };

  // Load more messages
  const loadMore = () => {
    if (hasMore && !loading) {
      fetchMessages(page + 1, true);
    }
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle scroll to load more
  const handleScroll = (e) => {
    const { scrollTop } = e.target;
    if (scrollTop === 0 && hasMore && !loading) {
      loadMore();
    }
  };

  useEffect(() => {
    if (conversation) {
      fetchMessages();
    }
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading && messages.length === 0) {
    return (
      <div className="flex-1 p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <ScrollArea 
        ref={scrollAreaRef}
        className="flex-1 p-4"
        onScroll={handleScroll}
      >
        {hasMore && (
          <div className="text-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={loadMore}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Load More'
              )}
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((message) => {
            const isOwnMessage = message.sender._id === user._id;
            
            return (
              <div
                key={message._id}
                className={`flex gap-3 ${
                  isOwnMessage ? 'flex-row-reverse' : ''
                }`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={message.sender.profile?.profilePhoto} />
                  <AvatarFallback>
                    {message.sender.fullname.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`flex flex-col max-w-[70%] ${
                    isOwnMessage ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">
                      {message.sender.fullname}
                    </span>
                    {message.timestamp && (
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(message.timestamp)}
                      </span>
                    )}
                  </div>
                  <div
                    className={`rounded-lg p-3 ${
                      isOwnMessage
                        ? 'bg-[#E67E22] text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message input */}
      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            disabled={true} // File attachment coming soon
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="min-h-[40px] max-h-[120px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 bg-[#E67E22] hover:bg-[#d9731d]"
            disabled={!newMessage.trim() || sending}
          >
            {sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MessageThread; 