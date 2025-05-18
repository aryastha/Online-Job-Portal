import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MESSAGE_API_ENDPOINT } from '@/utils/data';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { Search, Archive, Trash2, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const ConversationList = ({ onSelectConversation, selectedConversationId }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useSelector((store) => store.auth);
  const { toast } = useToast();

  // Fetch conversations
  const fetchConversations = async (pageNum = 1, append = false) => {
    try {
      const response = await axios.get(
        `${MESSAGE_API_ENDPOINT}/conversations?page=${pageNum}&limit=10`,
        { withCredentials: true }
      );

      if (response.data.success) {
        const newConversations = response.data.conversations;
        setConversations(prev => 
          append ? [...prev, ...newConversations] : newConversations
        );
        setHasMore(newConversations.length === 10);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Archive conversation
  const handleArchive = async (conversationId, e) => {
    e.stopPropagation();
    try {
      const response = await axios.post(
        `${MESSAGE_API_ENDPOINT}/conversations/${conversationId}/archive`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        setConversations(prev => 
          prev.filter(conv => conv._id !== conversationId)
        );
        toast({
          title: "Success",
          description: "Conversation archived",
        });
      }
    } catch (error) {
      console.error('Error archiving conversation:', error);
      toast({
        title: "Error",
        description: "Failed to archive conversation",
        variant: "destructive",
      });
    }
  };

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conv => {
    const searchLower = searchQuery.toLowerCase();
    const participantNames = conv.participants
      .filter(p => p._id !== user._id)
      .map(p => p.fullname.toLowerCase());
    const jobTitle = conv.relatedJob?.title?.toLowerCase() || '';
    
    return (
      participantNames.some(name => name.includes(searchLower)) ||
      jobTitle.includes(searchLower) ||
      conv.lastMessage?.content?.toLowerCase().includes(searchLower)
    );
  });

  // Get other participant's name
  const getOtherParticipant = (conversation) => {
    return conversation.participants.find(p => p._id !== user._id);
  };

  // Get unread count for current user
  const getUnreadCount = (conversation) => {
    const userCount = conversation.unreadCounts.find(
      count => count.user === user._id
    );
    return userCount ? userCount.count : 0;
  };

  // Load more conversations
  const loadMore = () => {
    if (hasMore && !loading) {
      fetchConversations(page + 1, true);
    }
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="w-full h-full p-4 space-y-4">
        <Skeleton className="h-10 w-full" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border-r">
      {/* Search bar */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversation list */}
      <ScrollArea className="flex-1">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
            <MessageSquare className="h-12 w-12 mb-2" />
            <p>No conversations found</p>
            {searchQuery && <p className="text-sm">Try a different search term</p>}
          </div>
        ) : (
          <div className="divide-y">
            {filteredConversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation);
              const unreadCount = getUnreadCount(conversation);
              
              return (
                <div
                  key={conversation._id}
                  onClick={() => onSelectConversation(conversation)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversationId === conversation._id ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium truncate">
                          {otherParticipant?.fullname}
                        </h3>
                        {conversation.relatedJob && (
                          <Badge variant="secondary" className="text-xs">
                            {conversation.relatedJob.title}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.lastMessage?.content || 'No messages yet'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {conversation.lastMessage?.timestamp && (
                        <span className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), { addSuffix: true })}
                        </span>
                      )}
                      {unreadCount > 0 && (
                        <Badge variant="default" className="bg-blue-500">
                          {unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end mt-2 gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleArchive(conversation._id, e)}
                      className="h-8 w-8"
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Load more button */}
        {hasMore && (
          <div className="p-4 text-center">
            <Button
              variant="outline"
              onClick={loadMore}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ConversationList; 