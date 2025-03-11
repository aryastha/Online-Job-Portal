import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Briefcase, MapPin, DollarSign, Users } from "lucide-react";

const Description = () => {
  const isApplied = false;

  return (
    <div className="max-w-7xl mx-auto my-4 p-6 bg-white shadow-md rounded-lg">
      {/* Job Title & Badges */}
      <div className="mb-6">
        <h2 className="font-semibold text-xl text-gray-900">Title</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge className="bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center gap-1 px-3 py-1 text-sm border border-gray-200">
            <DollarSign size={14} /> Salary
          </Badge>
          <Badge className="bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center gap-1 px-3 py-1 text-sm border border-gray-200">
            <Briefcase size={14} /> Position
          </Badge>
          <Badge className="bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center gap-1 px-3 py-1 text-sm border border-gray-200">
            <Users size={14} /> Candidates
          </Badge>
          <Badge className="bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center gap-1 px-3 py-1 text-sm border border-gray-200">
            <MapPin size={14} /> Nepal
          </Badge>
        </div>
      </div>

      {/* Apply Button */}
      <div className="mb-6">
        <Button
          disabled={isApplied}
          className={`rounded-lg px-6 py-2 font-medium transition-all duration-300 ${
            isApplied
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#E67E22] hover:bg-[#dd9352] text-white"
          }`}
        >
          {isApplied ? "Already Applied" : "Apply"}
        </Button>
      </div>

      {/* Job Description Section */}
      <div className="border-b-2 pb-4 mb-4">
        <h1 className="font-semibold text-lg text-gray-800">Job Description</h1>
      </div>

      {/* Job Details */}
      <div className="space-y-2">
        <h1 className="font-bold text-gray-900">
          Role: <span className="text-gray-700 font-normal pl-2">SEO Executive</span>
        </h1>
        <h1 className="font-bold text-gray-900">
          Location: <span className="text-gray-700 font-normal pl-2">Remote</span>
        </h1>
        <h1 className="font-bold text-gray-900">
          Salary: <span className="text-gray-700 font-normal pl-2">Rs: 00.00</span>
        </h1>
        <h1 className="font-bold text-gray-900">
          Experience: <span className="text-gray-700 font-normal pl-2">2+ years</span>
        </h1>
        <h1 className="font-bold text-gray-900">
          Job Type: <span className="text-gray-700 font-normal pl-2">Full-time</span>
        </h1>
      </div>

      {/* About Company */}
      <div className="mt-4">
        <h1 className="font-bold text-gray-900">
          About Company:
          <span className="text-gray-700 font-normal pl-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </span>
        </h1>
      </div>

      {/* Total Applicants */}
      <div className="mt-4">
        <h1 className="font-bold text-gray-900">
          Total Applicants:
          <span className="text-gray-700 font-normal pl-2">12</span>
        </h1>
      </div>
    </div>
  );
};

export default Description;
