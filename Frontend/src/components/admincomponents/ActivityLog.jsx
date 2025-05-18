import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Activity, UserPlus, Briefcase, Building2, FileText, UserMinus } from 'lucide-react';
import axios from 'axios';
import { USER_API_ENDPOINT } from '@/utils/data';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivities();
    // Set up polling every 30 seconds
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get(`${USER_API_ENDPOINT}/activities`, {
        withCredentials: true,
      });
      
      
      if (response.data.success) {
        setActivities(response.data.activities);
      } else {
        toast.error('Failed to fetch activities');
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      toast.error('Error fetching activities');
    } finally {
      setLoading(false);
    }
  };

  const handleActivityClick = (activity) => {
    // Only navigate for specific activity types
    if (!['user_registered', 'job_posted', 'company_added', 'application_submitted'].includes(activity.type)) {
      return;
    }

    switch (activity.type) {
      case 'user_registered':
        navigate(`/admin/users?userId=${activity.metadata?.userId}`);
        break;
      case 'company_added':
        navigate(`/admin/companies?companyId=${activity.metadata?.companyId}`);
        break;
      case 'job_posted':
        navigate(`/admin/jobs?jobId=${activity.metadata?.jobId}`);
        break;
      case 'application_submitted':
        navigate(`/admin/applications?applicationId=${activity.metadata?.applicationId}`);
        break;
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_registered':
        return <UserPlus className="h-4 w-4 text-blue-500" />;
      case 'job_posted':
        return <Briefcase className="h-4 w-4 text-green-500" />;
      case 'company_added':
        return <Building2 className="h-4 w-4 text-purple-500" />;
      case 'application_submitted':
        return <FileText className="h-4 w-4 text-orange-500" />;
      case 'user_deleted':
        return <UserMinus className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'user_registered':
        return 'bg-blue-50 text-blue-700';
      case 'job_posted':
        return 'bg-green-50 text-green-700';
      case 'company_added':
        return 'bg-purple-50 text-purple-700';
      case 'application_submitted':
        return 'bg-orange-50 text-orange-700';
      case 'user_deleted':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const isClickable = (type) => {
    return ['user_registered', 'job_posted', 'company_added', 'application_submitted'].includes(type);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Recent Activity
          {loading && <span className="text-sm text-gray-500">(Loading...)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              <p>No recent activities</p>
              {!loading && (
                <button 
                  onClick={fetchActivities}
                  className="text-sm text-blue-500 hover:text-blue-700 mt-2"
                >
                  Refresh
                </button>
              )}
            </div>
          ) : (
            activities.map((activity, index) => {
              const clickable = isClickable(activity.type);
              return (
                <div
                  key={activity._id || index}
                  onClick={() => clickable && handleActivityClick(activity)}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                    clickable ? 'hover:bg-gray-50 cursor-pointer' : ''
                  }`}
                >
                  <div className="mt-1">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{activity.user}</span>
                      <Badge variant="outline" className={getActivityColor(activity.type)}>
                        {activity.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityLog;