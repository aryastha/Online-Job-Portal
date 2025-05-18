import React, { useState } from 'react';
import ConversationList from './ConversationList';
import MessageThread from './MessageThread';
import NewMessageModal from './NewMessageModal';
import { useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom'; // Add this import
import { ArrowLeft } from 'lucide-react'; // Add this import for the back icon

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { toast } = useToast();
  const navigate = useNavigate(); // Initialize the navigate hook

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleNewMessage = () => {
    setIsNewMessageModalOpen(true);
  };

  const handleConversationCreated = (conversation) => {
    setSelectedConversation(conversation);
  };

  // Function to handle back navigation
  const handleBack = () => {
    navigate(user?.role?.toLowerCase() === 'recruiter' ? '/recruiter/dashboard' : '/');
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white rounded-lg shadow">
      {/* Left sidebar - Conversation list */}
      <div className="w-1/3 min-w-[300px] max-w-[400px] border-r">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="h-8 w-8 mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold">Messages</h2>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNewMessage}
              className="h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <ConversationList
            onSelectConversation={handleSelectConversation}
            selectedConversationId={selectedConversation?._id}
          />
        </div>
      </div>

      {/* Right side - Message thread */}
      <div className="flex-1">
        {selectedConversation ? (
          <div className="h-full flex flex-col">
            {/* Message thread header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedConversation(null)}
                  className="h-8 w-8 mr-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h3 className="font-medium">
                    {selectedConversation.participants
                      .find(p => p._id !== user._id)
                      ?.fullname}
                  </h3>
                  {selectedConversation.relatedJob && (
                    <p className="text-sm text-gray-500">
                      {selectedConversation.relatedJob.title}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedConversation(null)}
              >
                Close
              </Button>
            </div>

            {/* Message thread */}
            <MessageThread
              conversation={selectedConversation}
              onClose={() => setSelectedConversation(null)}
            />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 p-4">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
              <p className="text-sm">
                Select a conversation from the list or start a new one
              </p>
            </div>
          </div>
        )}
      </div>

      {/* New Message Modal */}
      <NewMessageModal
        open={isNewMessageModalOpen}
        onOpenChange={setIsNewMessageModalOpen}
        onConversationCreated={handleConversationCreated}
      />
    </div>
  );
};

export default Messages;