import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import InterviewNavigation from './InterviewNavigation';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';

const API_URL = 'http://localhost:5004/api';

const ScheduleInterviewForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    jobId: '',
    candidateId: '',
    scheduledAt: '',
    duration: 60, // default duration in minutes
    location: 'Online',
    meetingLink: '',
    notes: '',
    additionalInfo: ''
  });

  // Fetch jobs for the recruiter
  useEffect(() => {
    const fetchJobs = async () => {
      if (!user?._id) return;
      try {
        const response = await axios.get(`${API_URL}/job/getrecruiterjobs`, {
          withCredentials: true
        });
        console.log('Jobs response:', response.data);
        if (response.data.status) {
          const jobsWithDetails = response.data.jobs.map(job => ({
            _id: job._id,
            title: job.title,
            company: job.company
          }));
          setJobs(jobsWithDetails);
        } else {
          toast.error('Failed to fetch jobs');
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch jobs');
      }
    };
    fetchJobs();
  }, [user?._id]);

  // Fetch applicants when a job is selected
  useEffect(() => {
    const fetchApplicants = async () => {
      if (!formData.jobId) return;
      try {
        const response = await axios.get(`${API_URL}/application/${formData.jobId}/applicants`, {
          withCredentials: true
        });
        console.log('Applicants response:', response.data);
        if (response.data.success) {
          // Map the applications to the format we need
          const applicantsData = response.data.applications.map(app => ({
            _id: app._id,
            applicant: {
              _id: app.applicant._id,
              fullname: app.applicant.fullname,
              email: app.applicant.email
            }
          }));
          setApplicants(applicantsData);
        } else {
          setApplicants([]);
        }
      } catch (error) {
        console.error('Error fetching applicants:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch applicants');
        setApplicants([]);
      }
    };
    if (formData.jobId) {
      fetchApplicants();
    }
  }, [formData.jobId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleJobSelect = (e) => {
    const jobId = e.target.value;
    console.log('Selected job:', jobId);
    setFormData(prev => ({
      ...prev,
      jobId,
      candidateId: '' // Reset candidate when job changes
    }));
    setSelectedJob(jobs.find(job => job._id === jobId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.jobId || !formData.candidateId || !formData.scheduledAt) {
      toast.error('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      console.log('Current user role:', user?.role);
      console.log('Submitting interview data:', formData);

      const response = await axios.post(`${API_URL}/interviews/schedule`, {
        jobId: formData.jobId,
        candidateId: formData.candidateId,
        scheduledAt: new Date(formData.scheduledAt).toISOString(),
        duration: parseInt(formData.duration),
        location: formData.location,
        meetingLink: formData.meetingLink,
        notes: formData.notes
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Interview response:', response.data);

      if (response.data.status === 'success') {
        toast.success('Interview scheduled successfully!');
        // Send email notification to candidate
        try {
          await axios.post(`${API_URL}/notifications/interview`, {
            interviewId: response.data.interview._id
          }, {
            withCredentials: true
          });
        } catch (notifyError) {
          console.error('Error sending notification:', notifyError);
          // Don't block the flow if notification fails
        }
        navigate('/recruiter/interviews');
      } else {
        toast.error(response.data.message || 'Failed to schedule interview');
      }
    } catch (error) {
      console.error('Error scheduling interview:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || 
                         (typeof error.response?.data === 'string' ? error.response.data : 'Failed to schedule interview');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Calculate minimum date-time (now + 1 hour)
  const minDateTime = format(new Date(Date.now() + 3600000), "yyyy-MM-dd'T'HH:mm");

  return (
    <div>
      <InterviewNavigation />
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Schedule New Interview</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Job Position *
                </label>
                <select
                  name="jobId"
                  value={formData.jobId}
                  onChange={handleJobSelect}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a job position</option>
                  {jobs.map(job => (
                    <option key={job._id} value={job._id}>
                      {job.title} {job.company?.name ? `- ${job.company.name}` : ''}
                    </option>
                  ))}
                </select>
                {jobs.length === 0 && (
                  <p className="mt-1 text-sm text-gray-500">No jobs available</p>
                )}
              </div>

              {/* Candidate Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Candidate *
                </label>
                <select
                  name="candidateId"
                  value={formData.candidateId}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={!formData.jobId}
                >
                  <option value="">Select a candidate</option>
                  {applicants.map(app => (
                    <option key={app._id} value={app.applicant._id}>
                      {app.applicant.fullname} {app.applicant.email ? `- ${app.applicant.email}` : ''}
                    </option>
                  ))}
                </select>
                {formData.jobId && applicants.length === 0 && (
                  <p className="mt-1 text-sm text-gray-500">No applicants available for this job</p>
                )}
                {!formData.jobId && (
                  <p className="mt-1 text-sm text-gray-500">Please select a job first</p>
                )}
              </div>
            </div>

            {/* Date, Time and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date and Time *
                </label>
                <input
                  type="datetime-local"
                  name="scheduledAt"
                  value={formData.scheduledAt}
                  onChange={handleInputChange}
                  min={minDateTime}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Online">Online</option>
                  <option value="In-person">In-person</option>
                  <option value="Phone">Phone</option>
                </select>
              </div>
            </div>

            {/* Meeting Link */}
            {formData.location === 'Online' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Link
                </label>
                <input
                  type="url"
                  name="meetingLink"
                  value={formData.meetingLink}
                  onChange={handleInputChange}
                  placeholder="https://meet.google.com/..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interview Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Add any specific instructions or topics to be covered..."
                rows="3"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                placeholder="Any additional information for the candidate..."
                rows="2"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/recruiter/interviews')}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Scheduling...' : 'Schedule Interview'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterviewForm;