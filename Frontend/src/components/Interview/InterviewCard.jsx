import React from 'react';
import { useAuth } from '@/context/AuthContext';

const InterviewCard = ({ interview, onStatusChange, userRole = 'candidate' }) => {
  const { user } = useAuth();

  if (!interview) {
    return <div className="p-4 text-center text-gray-500">Interview details not available.</div>;
  }

  const isCandidate = userRole === 'candidate' && user?._id === interview.candidateId?._id; // Assuming candidateId is an object with _id
  const isRecruiter = userRole === 'recruiter';

  const handleAccept = () => {
    if (window.confirm("Are you sure you want to accept this interview?")) {
      onStatusChange(interview._id, 'confirmed');
    }
  };

  const handleReject = () => {
    if (window.confirm("Are you sure you want to reject this interview?")) {
      onStatusChange(interview._id, 'rejected_by_candidate');
    }
  };
  
  const handleCancelByRecruiter = () => {
    if (window.confirm("Are you sure you want to cancel this interview? This action cannot be undone.")) {
        // TODO: Consider adding a reason for cancellation
        onStatusChange(interview._id, 'cancelled_by_recruiter');
    }
  };


  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4 border border-gray-200">
      <h3 className="text-xl font-semibold text-blue-600 mb-2">{interview.jobId?.title || 'Job Title Not Available'}</h3>
      <p className="text-sm text-gray-500 mb-1">Company: {interview.companyId?.name || 'Company Not Available'}</p>
      <p className="text-gray-700 mb-1">
        Date & Time: <span className="font-medium">{new Date(interview.scheduledAt).toLocaleString()}</span>
      </p>
      <p className="text-gray-700 mb-1">
        Status: <span className={`font-medium px-2 py-1 rounded-full text-xs ${
          interview.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          interview.status === 'confirmed' ? 'bg-green-100 text-green-800' :
          interview.status === 'rejected_by_candidate' ? 'bg-red-100 text-red-800' :
          interview.status === 'cancelled_by_recruiter' ? 'bg-gray-100 text-gray-800' :
          interview.status === 'completed' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>{interview.status}</span>
      </p>
      
      {interview.candidateId && (
        <p className="text-gray-700 mb-1">
          Candidate: <span className="font-medium">{interview.candidateId?.name || interview.candidateId?.email || 'Candidate details not available'}</span>
        </p>
      )}
      
      {interview.recruiterId && (
         <p className="text-gray-700 mb-1">
           Recruiter: <span className="font-medium">{interview.recruiterId?.name || interview.recruiterId?.email || 'Recruiter details not available'}</span>
         </p>
      )}

      {interview.notes && (
        <p className="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded">Notes: {interview.notes}</p>
      )}

      {isCandidate && interview.status === 'pending' && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-3">
          <button 
            onClick={handleAccept}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 text-sm"
          >
            Accept
          </button>
          <button 
            onClick={handleReject}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-sm"
          >
            Reject
          </button>
        </div>
      )}

      {isRecruiter && (interview.status === 'pending' || interview.status === 'confirmed') && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-3">
          {/* Recruiters might want to mark as completed or cancel */}
          <button 
            onClick={() => onStatusChange(interview._id, 'completed')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm"
          >
            Mark as Completed
          </button>
           <button 
            onClick={handleCancelByRecruiter}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 text-sm"
          >
            Cancel Interview
          </button>
          {/* Add more recruiter actions if needed, e.g., Reschedule */}
        </div>
      )}
    </div>
  );
};

export default InterviewCard;
