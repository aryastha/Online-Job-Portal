import React from "react";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Briefcase, MapPin, DollarSign, Users, Bookmark } from "lucide-react";

const Job1 = ({ job }) => {
  const navigate = useNavigate();
  const jobId = "123";

  return (
    <div className="mb-6">
      <div className="p-6 shadow-sm border border-gray-100 bg-white rounded-lg cursor-pointer hover:shadow-md transition-all duration-200 w-[320px] h-[480px] flex flex-col justify-between">
        {/* Company Info */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-500 text-sm font-light">3 days ago</p>
            <Button
              variant="ghost"
              className="rounded-full p-2 hover:bg-gray-50"
              size="icon"
            >
              <Bookmark
                size={18}
                className="text-gray-600 hover:text-gray-800"
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
                <MapPin size={16} className="text-gray-500" /> Nepal
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
            <DollarSign size={14} /> {job?.salary}
          </Badge>
          <Badge className="bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center gap-1 px-3 py-1 text-sm border border-gray-200">
            <Briefcase size={14} /> {job?.position}
          </Badge>
          <Badge className="bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center gap-1 px-3 py-1 text-sm border border-gray-200">
            <Users size={14} /> {job?.location}
          </Badge>
          <Badge className="bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center gap-1 px-3 py-1 text-sm border border-gray-200">
            <MapPin size={14} /> {job?.jobType}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Button
            onClick={() => {
              navigate(`/description/${jobId}`);
            }}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Details
          </Button>

          <Button
            variant="solid"
            className="bg-[#2C3E50] text-white hover:bg-blue-600"
          >
            Save for Later
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Job1;