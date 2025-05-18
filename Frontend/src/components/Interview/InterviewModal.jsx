import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal"; 
import { useAuth } from "@/context/AuthContext"; // To get recruiter details

const InterviewModal = ({ isOpen, onClose, application, onSchedule, companyId }) => {
  const { user } = useAuth(); // Recruiter user
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Reset form when modal is opened/closed or application changes
    if (isOpen) {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        // Default to next hour if possible
        now.setHours(now.getHours() + 1);
        const nextHour = now.toTimeString().substring(0,5);

        setDate(today);
        setTime(nextHour);
        setNotes("");
        setError("");
    } else {
        // Clear form when closing if not successful
        setDate("");
        setTime("");
        setNotes("");
        setError("");
    }
  }, [isOpen, application]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!date || !time) {
        setError("Date and Time are required.");
        return;
    }
    if (!application || !application.candidateId || !application.jobId) {
        setError("Applicant and Job information are missing.");
        // This should ideally not happen if modal is invoked correctly
        console.error("Application details missing in InterviewModal");
        return;
    }

    const scheduledAt = new Date(`${date}T${time}`);
    if (scheduledAt < new Date()) {
        setError("Cannot schedule an interview in the past.");
        return;
    }

    onSchedule({
      candidateId: application.candidateId, 
      jobId: application.jobId,
      recruiterId: user?._id, // Logged-in recruiter from useAuth
      companyId: companyId || user?.companyId, // Pass companyId or get from recruiter's profile
      scheduledAt: scheduledAt.toISOString(),
      notes: notes || `Interview for ${application.jobTitle || 'the job'} with ${application.candidateName || 'the candidate'}`,
      status: 'pending' // Initial status
    });
    // onClose will likely be called by the parent after onSchedule promise resolves
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 bg-white rounded-lg shadow-xl max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Schedule Interview</h2>
        {application && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                <p className="text-sm text-gray-700"><strong>Applicant:</strong> {application.candidateName || application.candidateId}</p>
                <p className="text-sm text-gray-700"><strong>Job:</strong> {application.jobTitle || application.jobId}</p>
            </div>
        )}
        {error && <p className="mb-3 p-2 bg-red-100 text-red-700 rounded-md text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="interview-date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              id="interview-date"
              type="date"
              value={date}
              min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="interview-time" className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <input
              id="interview-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="interview-notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              id="interview-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              className="w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Video call link, topics to cover"
            />
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose} // Ensure onClose is always available
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              Schedule Interview
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default InterviewModal;
