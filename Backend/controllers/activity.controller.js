import Activity from '../models/activity.model.js';

// Get recent activities
export const getActivities = async (req, res) => {
  try {
    console.log('Fetching activities for user:', req.user);
    
    const activities = await Activity.find()
      .sort({ time: -1 })
      .limit(50)
      .lean();

    console.log('Found activities:', activities.length);

    // Format the activities for the frontend
    const formattedActivities = activities.map(activity => ({
      ...activity,
      time: formatTimeAgo(activity.time)
    }));

    console.log('Sending formatted activities:', formattedActivities.length);

    res.json({
      success: true,
      activities: formattedActivities
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activities'
    });
  }
};

// Create a new activity
export const createActivity = async (type, user, description, metadata = {}) => {
  try {
    console.log('Creating new activity:', { type, user, description, metadata });
    
    const activity = new Activity({
      type,
      user,
      description,
      metadata
    });
    
    const savedActivity = await activity.save();
    console.log('Activity created successfully:', savedActivity._id);
    return savedActivity;
  } catch (error) {
    console.error('Error creating activity:', error);
    return null;
  }
};

// Helper function to format time ago
function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `${interval} years ago`;
  if (interval === 1) return '1 year ago';
  
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval} months ago`;
  if (interval === 1) return '1 month ago';
  
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval} days ago`;
  if (interval === 1) return '1 day ago';
  
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval} hours ago`;
  if (interval === 1) return '1 hour ago';
  
  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval} minutes ago`;
  if (interval === 1) return "1 minute ago";
  
  return 'just now';
} 