import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import InterviewNavigation from './InterviewNavigation';
import axios from 'axios';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import enUS from 'date-fns/locale/en-US';
import { useNavigate } from 'react-router-dom';


const API_URL = 'http://localhost:5004/api';

const locales = {
  'en-US': enUS
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

const InterviewCalendar = () => {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchInterviews = async () => {
      if (!user?._id) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(`${API_URL}/interviews/calendar`, {
          withCredentials: true
        });

        const formattedInterviews = response.data.interviews.map(interview => ({
          id: interview._id,
          title: `${interview.jobId?.title || 'Interview'} - ${interview.candidateId?.fullname || 'Candidate'}`,
          start: new Date(interview.scheduledAt),
          end: new Date(new Date(interview.scheduledAt).getTime() + (interview.duration || 60) * 60000),
          interview: interview
        }));

        setInterviews(formattedInterviews);
      } catch (error) {
        console.error('Error fetching interviews:', error);
        toast.error('Failed to load interviews');
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [user]);

  const handleSelectEvent = (event) => {
    setSelectedInterview(event.interview);
  };

  // Modal to display interview details
  const InterviewDetailsModal = ({ interview, onClose }) => {
    if (!interview) return null;

    return (
      
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-lg w-full">
          <h3 className="text-xl font-semibold mb-4">{interview.jobId?.title || 'Interview'}</h3>
          
          <div className="space-y-3">
            <p><strong>Candidate:</strong> {interview.candidateId?.fullname || 'Not specified'}</p>
            <p><strong>Date & Time:</strong> {format(new Date(interview.scheduledAt), 'PPpp')}</p>
            <p><strong>Duration:</strong> {interview.duration || 60} minutes</p>
            <p><strong>Status:</strong> <span className="capitalize">{interview.status}</span></p>
            <p><strong>Location:</strong> {interview.location || 'Online'}</p>
            {interview.meetingLink && (
              <p><strong>Meeting Link:</strong> <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{interview.meetingLink}</a></p>
            )}
            {interview.notes && (
              <p><strong>Notes:</strong> {interview.notes}</p>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <InterviewNavigation />
      <div className="container mx-auto p-6">
        {/* //back button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Interview Calendar</h2>
          <button
            onClick={() => navigate(user?.role?.toLowerCase() === 'recruiter' ? '/recruiter/dashboard' : '/')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Interview Calendar</h2>
          
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="h-[600px]">
              <Calendar
                localizer={localizer}
                events={interviews}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                onSelectEvent={handleSelectEvent}
                eventPropGetter={(event) => ({
                  className: 'cursor-pointer',
                  style: {
                    backgroundColor: event.interview.status === 'confirmed' ? '#4CAF50' :
                                   event.interview.status === 'pending' ? '#2196F3' :
                                   event.interview.status === 'cancelled_by_recruiter' ? '#9E9E9E' :
                                   event.interview.status === 'rejected_by_candidate' ? '#F44336' :
                                   '#FF9800'
                  }
                })}
              />
            </div>
          )}
        </div>
      </div>

      {selectedInterview && (
        <InterviewDetailsModal
          interview={selectedInterview}
          onClose={() => setSelectedInterview(null)}
        />
      )}
    </div>
  );
};

export default InterviewCalendar; 