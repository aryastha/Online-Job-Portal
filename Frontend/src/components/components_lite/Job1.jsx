import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Briefcase, MapPin, DollarSign, Users, Bookmark } from "lucide-react";

const Job1 = () => {
  return (
    <div>
      <div className="p-6 shadow-lg border border-gray-200 bg-white rounded-lg cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 transform">
        {/* Company Info */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-500 text-sm font-light">3 days ago</p>
            <Button variant="ghost" className="rounded-full p-2 hover:bg-gray-100" size="icon">
              <Bookmark size={18} className="text-gray-600 hover:text-blue-500" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12 border-2 border-blue-100">
              <AvatarImage src="https://github.com/shadcn.png" />
            </Avatar>

            <div>
              <h1 className="font-bold text-xl text-gray-800">Company Name</h1>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin size={16} className="text-gray-500" /> Nepal
              </p>
            </div>
          </div>
        </div>

        {/* Job Info */}
        <div className="mb-6">
          <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
            <Briefcase size={18} className="text-blue-500" /> Job Title
          </h2>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates
            at dolor id amet repellat, beatae suscipit laboriosam eos saepe?
          </p>
        </div>

        {/* Job Details - Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100 hover:text-blue-600 flex items-center gap-1 px-3 py-1 text-sm">
            <DollarSign size={14} /> Salary
          </Badge>
          <Badge className="bg-green-100 text-green-600 hover:bg-green-100 hover:text-green-600 flex items-center gap-1 px-3 py-1 text-sm">
            <Briefcase size={14} /> Position
          </Badge>
          <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100 hover:text-orange-600 flex items-center gap-1 px-3 py-1 text-sm">
            <Users size={14} /> Candidates
          </Badge>
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 hover:text-gray-700 flex items-center gap-1 px-3 py-1 text-sm">
            <MapPin size={14} /> Nepal
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Button variant="solid" className="bg-[#2C3E50] text-white hover:bg-[#1A252F]">
            Details
          </Button>
          <Button variant="solid" className="bg-[#E67E22] text-white hover:bg-[#D35400]">
            Save for Later
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Job1;