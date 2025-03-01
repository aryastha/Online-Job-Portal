import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Briefcase, MapPin, DollarSign, Users, Bookmark } from "lucide-react";

const Job1 = () => {
  return (
    <div>
      <div className="p-6 shadow-md border border-gray-300 bg-white rounded-lg cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300">
        {/* Company Info */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <p className="text-gray-500 text-sm"> 3 days ago </p>
            <Button variant="outline" className="rounded-full" size="icon">
              <Bookmark />{" "}
            </Button>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <Button variant="outline" className="p-6" size="icon">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
              </Avatar>
            </Button>

            <div>
              <h1 className="font-semibold text-lg text-gray-800">
                Company Name
              </h1>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin size={14} className="text-gray-400" /> Nepal
              </p>
            </div>
          </div>
        </div>

        {/* Job Info */}
        <div className="mb-4">
          <h2 className="font-medium text-md text-gray-700 flex items-center gap-2">
            <Briefcase size={16} className="text-blue-500" /> Job Title
          </h2>
          <p className="text-xs text-gray-600 mt-2 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates
            at dolor id amet repellat, beatae suscipit laboriosam eos saepe?
          </p>
        </div>

        {/* Job Details - Badges (No Hover) */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100 hover:text-blue-600 flex items-center gap-1 px-2 py-1 text-xs">
            <DollarSign size={12} /> Salary
          </Badge>
          <Badge className="bg-green-100 text-green-600 hover:bg-green-100 hover:text-green-600 flex items-center gap-1 px-2 py-1 text-xs">
            <Briefcase size={12} /> Position
          </Badge>
          <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100 hover:text-orange-600 flex items-center gap-1 px-2 py-1 text-xs">
            <Users size={12} /> Candidates
          </Badge>
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 hover:text-gray-700 flex items-center gap-1 px-2 py-1 text-xs">
            <MapPin size={12} /> Nepal
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default Job1;
