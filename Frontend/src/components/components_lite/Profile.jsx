import React, { useState } from "react";
import Navbar from "./Navbar";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Pen, Mail, Contact } from "lucide-react";
import AppliedJobs from "./AppliedJobs";
import EditProfileModel from "./EditProfileModel";
import { useSelector } from "react-redux";

const Profile = () => {

  const [open, setOpen] = useState(false);
  const {user} = useSelector((store)=>store.auth);

  const isResume = true;

  return (
    <div>
      <Navbar />

      <div className="max-w-7xl mx-auto bg-white border-gray-200 rounded-2xl my-5 p-8 shadow shadow-gray-500 hover:shadow-[#d9731d]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-5">
            {/* Avatar with proper styling */}
            <div className="h-20 w-20 rounded-full overflow-hidden border border-gray-300">
              <Avatar className="h-full w-full">
                <AvatarImage
                  src={user?.profile.profilePhoto} 
                  alt="profilepicture"
                  className="w-full h-full object-cover"
                />
              </Avatar>
            </div>

            {/* User Info */}
            <div className="">
              <h1 className="font-medium text-lg">{user?.fullname}</h1>
              <p className="text-gray-600 text-justify max-w-2xl text-sm">
                {user?.profile?.bio}
              </p>
            </div>
        </div>

          {/* Edit Button aligned properly */}
          <Button 
          onClick={() => setOpen(true) }
          variant="outline" 
          className="flex items-center gap-2">
            <Pen size={16} />
            Edit
            
          </Button>
        </div>

        {/* Contact Details */}
        <div className="mt-5">
          <div className="flex items-center gap-3 my-2">
            <Mail size={18} />
            <span>
              <a href={`mailto:${user?.email}`}>{user?.email}</a></span>
          </div>

          <div className="flex items-center gap-3 my-2">
            <Contact size={18} />
            <span>
              <a href={`tel:${user?.phoneNumber}`}>{user?.phoneNumber}</a></span>
          </div>
        </div>

        <div>
          <h2 className="text-medium font-bold mt-5"> Skills </h2>
          <div className="flex items-center gap-5 mt-4">
            {user?.profile?.skills.length !== 0 ? (
              user?.profile?.skills.map((item, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="p-2 font-medium"
                >
                  {" "}
                  {item}{" "}
                </Badge>
              ))
            ) : (
              <span className=""> NA</span>
            )}
          </div>
        </div>

        {/* Resume */}
        <div>
          <h2 className="text-medium font-bold mt-5"> Resume</h2>
          <div>
            {isResume ? (
              <a
                target="_blank"
                href={user?.profile?.resume}
              >
                <Button
                  variant="outline"
                  className="p-3 mt-4 bg-[#2C3E50] text-white hover:bg-[#394f66] hover:text-white"
                >
                  {" "}
                  Download
                </Button>
              </a>
            ) : (
              <span> No Resume Found</span>
            )}
          </div>
        </div>
        {/* Application Table */}
      </div>

      <div className="max-w-7xl mx-auto bg-white rounded-2xl mt-5">
          <h2 className="text-md font-bold"> Applied Jobs</h2>
          <AppliedJobs />
      </div>

      {/* Edit Profile Model */}
      <EditProfileModel open={open} setOpen={setOpen} />
      </div>
  );
};

export default Profile;
