import React, { useState } from "react";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Briefcase, MapPin, DollarSign, Users, Bookmark } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { updateBookmarkStatus, updateSavedStatus } from "@/redux/jobSlice";
import { JOB_API_ENDPOINT } from "@/utils/data";
import { useEffect } from "react";

const Job1 = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((store) => store.auth.user);

  const [isBookmarked, setIsBookmarked] = useState(() => {
    // Check server data first
    if (user && job?.bookmarkedBy?.includes(user._id)) return true;
    // Fallback to localStorage
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}');
    return savedBookmarks[job._id] || false;

  });
  const [isSaved, setIsSaved] = useState(false);

  const [isLoading, setIsLoading] = useState({
    bookmark: false,
    save: false,
  });

  const daysAgo = (mongodbTime) => {
    if (!mongodbTime) return null;
    const createdAt = new Date(mongodbTime);
    if (isNaN(createdAt.getTime())) return null;

    const currentTime = new Date();
    const timeDiff = currentTime.getTime() - createdAt.getTime();
    return Math.floor(timeDiff / (1000 * 3600 * 24));
  };

  const handleBookmark = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to bookmark jobs");
      navigate("/login");
      return;
    }
  
    setIsLoading((prev) => ({ ...prev, bookmark: true }));
  
    try {
      const newBookmarkStatus = !isBookmarked;
      
      const response = await axios.post(
        `${JOB_API_ENDPOINT}/${job._id}/bookmark`,
        { bookmarked: newBookmarkStatus },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
  
      if (response.data.status) {
        setIsBookmarked(newBookmarkStatus);
        dispatch(updateBookmarkStatus({ jobId: job._id, bookmarked: newBookmarkStatus }));
        
        const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || {};
        if (newBookmarkStatus) {
          savedBookmarks[job._id] = true;
        } else {
          delete savedBookmarks[job._id];
        }
        localStorage.setItem('bookmarks', JSON.stringify(savedBookmarks));
  
        toast.success(newBookmarkStatus ? "Job bookmarked!" : "Bookmark removed");
      } else {
        throw new Error(response.data.message || "Failed to update bookmark");
      }
    } catch (error) {
      console.error("Bookmark error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to update bookmark");
    } finally {
      setIsLoading((prev) => ({ ...prev, bookmark: false }));
    }
  };

  
  useEffect(() => {
    if (user && job?.savedBy) {
      //check bookmarked status
      setIsBookmarked(job?.bookmarkedBy?.includes(user._id) || false);
      //check save status

      setIsSaved(job.savedBy.includes(user._id));
    }
  }, [user, job?.savedBy]);

  const handleSaveForLater = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to save jobs");
      navigate("/login");
      return;
    }

    setIsLoading((prev) => ({ ...prev, save: true }));

    try {
      const newSavedStatus = !isSaved;
      await axios.post(
        `${JOB_API_ENDPOINT}/${job._id}/save`,
        { saved: newSavedStatus },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // Update local and global state
      setIsSaved(newSavedStatus);
      dispatch(
        updateSavedStatus({
          jobId: job._id,
          saved: newSavedStatus,
          userId: user._id,
        })
      );

      //update localStorage to persist across sessions
      // const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "{}");
      // if (newSavedStatus) {
      //   savedJobs[job._id] = true;
      // } else {
      //   delete savedJobs[job._id];
      // }

      // localStorage.setItem("savedJobs", JSON.stringify(savedJobs));

      toast.success(
        newSavedStatus ? "Job saved for later!" : "Removed from saved jobs"
      );
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.response?.data?.message || "Failed to save job");
    } finally {
      setIsLoading((prev) => ({ ...prev, save: false }));
    }
  };

  return (
    <div className="mb-6">
      <div className="p-6 shadow-sm border border-gray-100 bg-white rounded-lg cursor-pointer hover:shadow-md transition-all duration-200 w-[320px] h-[480px] flex flex-col justify-between">
        {/* Company Info */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-500 text-sm font-light">
              {daysAgo(job?.updatedAt) === 0
                ? "Today"
                : `${daysAgo(job?.updatedAt)} days ago`}
            </p>
            <Button
              variant="ghost"
              className={`rounded-full p-2 hover:bg-gray-50 ${
                isBookmarked ? "text-[#E67E22]" : "text-gray-600"
              }`}
              size="icon"
              onClick={handleBookmark}
              disabled={isLoading.bookmark}
            >
              <Bookmark
                size={18}
                className={isBookmarked ? "fill-current" : ""}
              />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12 border-2 border-gray-100">
              <AvatarImage src={job?.company?.logo} />
            </Avatar>

            <div>
              <h1 className="font-bold text-xl text-gray-800 line-clamp-1">
                {job?.company?.name}
              </h1>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin size={16} className="text-gray-500" /> {job?.location}
              </p>
            </div>
          </div>
        </div>

        {/* Job Info */}
        <div className="mb-6">
          <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2 line-clamp-1">
            <Briefcase size={18} className="text-gray-700" /> {job?.title}
          </h2>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-3">
            {job?.description}
          </p>
        </div>

        {/* Job Details - Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge className="bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center gap-1 px-3 py-1 text-sm border border-gray-200">
            NPR. {job?.salary}
          </Badge>
          <Badge className="bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center gap-1 px-3 py-1 text-sm border border-gray-200">
            <Briefcase size={14} /> {job?.position}
          </Badge>
          <Badge className="bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center gap-1 px-3 py-1 text-sm border border-gray-200">
            <Users size={14} /> {job?.jobType}
          </Badge>
          <Badge className="bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center gap-1 px-3 py-1 text-sm border border-gray-200">
            <MapPin size={14} /> {job?.location}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate(`/description/${job._id}`)}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Details
          </Button>

          <Button
            variant="solid"
            className={`${
              isSaved ? "bg-[#E67E22]" : "bg-[#2C3E50]"
            } text-white hover:bg-blue-600`}
            onClick={handleSaveForLater}
            disabled={isLoading.save}
          >
            {isLoading.save ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : isSaved ? (
              "Saved!"
            ) : (
              "Save for Later"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Job1;
