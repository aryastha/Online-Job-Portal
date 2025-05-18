import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MESSAGE_API_ENDPOINT, USER_API_ENDPOINT } from '@/utils/data';
import { useSelector } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '../ui/scroll-area';

const NewMessageModal = ({ open, onOpenChange, onConversationCreated }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [creating, setCreating] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { toast } = useToast();

  // Fetch initial users
  const fetchInitialUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${USER_API_ENDPOINT}/all-users`,
        { withCredentials: true }
      );

      if (response.data.success) {
        // Filter out current user and users with different roles
        const filteredUsers = response.data.users.filter(
          u => u._id !== user._id && u.role !== user.role
        );
        setUsers(filteredUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Search users
  const searchUsers = async (query) => {
    if (!query.trim()) {
      fetchInitialUsers();
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${USER_API_ENDPOINT}/search?q=${encodeURIComponent(query)}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        // Filter out current user and users with different roles
        const filteredUsers = response.data.users.filter(
          u => u._id !== user._id && u.role !== user.role
        );
        setUsers(filteredUsers);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        title: "Error",
        description: "Failed to search users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create new conversation
  const createConversation = async () => {
    if (!selectedUser) return;

    setCreating(true);
    try {
      const response = await axios.post(
        `${MESSAGE_API_ENDPOINT}/conversations`,
        {
          participants: [user._id, selectedUser._id],
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Conversation created successfully",
        });
        onConversationCreated(response.data.conversation);
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error",
        description: "Failed to create conversation",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  // Fetch users when modal opens
  useEffect(() => {
    if (open) {
      fetchInitialUsers();
    }
  }, [open]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* User list */}
          <ScrollArea className="h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : users.length > 0 ? (
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => setSelectedUser(user)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedUser?._id === user._id
                        ? 'bg-gray-100'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {user.profile?.profilePhoto ? (
                          <img
                            src={user.profile.profilePhoto}
                            alt={user.fullname}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-medium text-gray-600">
                            {user.fullname.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{user.fullname}</h3>
                        <p className="text-sm text-gray-500">{user.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="text-center text-gray-500 py-8">
                No users found
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No users available to message
              </div>
            )}
          </ScrollArea>

          {/* Create button */}
          <Button
            onClick={createConversation}
            disabled={!selectedUser || creating}
            className="w-full"
          >
            {creating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Start Conversation'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewMessageModal; 